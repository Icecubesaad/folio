import { useState, useEffect, useCallback, useRef } from 'react'

// Configuration for localStorage behavior
interface LocalStorageConfig {
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
  syncAcrossTabs?: boolean
  debounceMs?: number
  onError?: (error: Error, operation: 'read' | 'write') => void
}

const defaultConfig: Required<LocalStorageConfig> = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  syncAcrossTabs: true,
  debounceMs: 300,
  onError: (error, operation) => {
    console.error(`localStorage ${operation} error:`, error)
  }
}

// Enhanced localStorage hook with better error handling, debouncing, and cross-tab sync
export function useLocalStorage<T>(
  key: string, 
  initialValue: T, 
  config: LocalStorageConfig = {}
): [T, (value: T | ((val: T) => T)) => void, { 
  isLoading: boolean
  error: Error | null
  remove: () => void
  refresh: () => void
}] {
  const finalConfig = { ...defaultConfig, ...config }
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Refs to prevent infinite re-renders and manage debouncing
  const writeTimeoutRef = useRef<NodeJS.Timeout>()
  const isWritingRef = useRef(false)
  const initialValueRef = useRef(initialValue)

  // Safe read from localStorage
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValueRef.current
    }

    try {
      const item = window.localStorage.getItem(key)
      
      if (item === null) {
        return initialValueRef.current
      }

      return finalConfig.deserialize(item)
    } catch (error) {
      finalConfig.onError(error as Error, 'read')
      setError(error as Error)
      return initialValueRef.current
    }
  }, [key, finalConfig])

  // Safe write to localStorage with debouncing
  const writeValue = useCallback((value: T) => {
    if (typeof window === 'undefined') return

    // Clear existing timeout
    if (writeTimeoutRef.current) {
      clearTimeout(writeTimeoutRef.current)
    }

    // Debounce write operations
    writeTimeoutRef.current = setTimeout(() => {
      try {
        isWritingRef.current = true
        
        if (value === undefined || value === null) {
          window.localStorage.removeItem(key)
        } else {
          window.localStorage.setItem(key, finalConfig.serialize(value))
        }
        
        setError(null)
      } catch (error) {
        finalConfig.onError(error as Error, 'write')
        setError(error as Error)
      } finally {
        isWritingRef.current = false
      }
    }, finalConfig.debounceMs)
  }, [key, finalConfig])

  // Initialize state from localStorage
  useEffect(() => {
    try {
      setIsLoading(true)
      const value = readValue()
      setStoredValue(value)
      setError(null)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [readValue])

  // Listen for storage events (cross-tab synchronization)
  useEffect(() => {
    if (!finalConfig.syncAcrossTabs || typeof window === 'undefined') return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && !isWritingRef.current) {
        try {
          const newValue = e.newValue 
            ? finalConfig.deserialize(e.newValue)
            : initialValueRef.current
          
          setStoredValue(newValue)
          setError(null)
        } catch (error) {
          finalConfig.onError(error as Error, 'read')
          setError(error as Error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, finalConfig])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (writeTimeoutRef.current) {
        clearTimeout(writeTimeoutRef.current)
      }
    }
  }, [])

  // Enhanced setValue function
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      writeValue(valueToStore)
    } catch (error) {
      finalConfig.onError(error as Error, 'write')
      setError(error as Error)
    }
  }, [storedValue, writeValue, finalConfig])

  // Remove item from localStorage
  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      setStoredValue(initialValueRef.current)
      setError(null)
    } catch (error) {
      finalConfig.onError(error as Error, 'write')
      setError(error as Error)
    }
  }, [key, finalConfig])

  // Refresh value from localStorage
  const refresh = useCallback(() => {
    try {
      const value = readValue()
      setStoredValue(value)
      setError(null)
    } catch (error) {
      finalConfig.onError(error as Error, 'read')
      setError(error as Error)
    }
  }, [readValue, finalConfig])

  return [
    storedValue,
    setValue,
    {
      isLoading,
      error,
      remove,
      refresh
    }
  ]
}

// Specialized hook for portfolio data with automatic backup
export function usePortfolioLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const backupKey = `${key}_backup`
  const timestampKey = `${key}_timestamp`
  
  const [value, setValue, { error, remove, refresh }] = useLocalStorage(
    key,
    initialValue,
    {
      onError: (error, operation) => {
        console.error(`Portfolio ${operation} error:`, error)
        
        // Try to restore from backup on read errors
        if (operation === 'read') {
          try {
            const backup = localStorage.getItem(backupKey)
            if (backup) {
              const backupData = JSON.parse(backup)
              localStorage.setItem(key, backup)
              console.info('Restored portfolio data from backup')
            }
          } catch (backupError) {
            console.error('Failed to restore from backup:', backupError)
          }
        }
      },
      debounceMs: 500 // Longer debounce for portfolio data
    }
  )

  // Enhanced setValue with automatic backup
  const setValueWithBackup = useCallback((newValue: T | ((val: T) => T)) => {
    setValue(newValue)
    
    // Create backup after a short delay
    setTimeout(() => {
      try {
        const currentValue = newValue instanceof Function ? newValue(value) : newValue
        localStorage.setItem(backupKey, JSON.stringify(currentValue))
        localStorage.setItem(timestampKey, Date.now().toString())
      } catch (backupError) {
        console.warn('Failed to create portfolio backup:', backupError)
      }
    }, 1000)
  }, [setValue, value, backupKey, timestampKey])

  // Get backup info
  const getBackupInfo = useCallback(() => {
    try {
      const timestamp = localStorage.getItem(timestampKey)
      const hasBackup = !!localStorage.getItem(backupKey)
      
      return {
        hasBackup,
        lastBackup: timestamp ? new Date(parseInt(timestamp)) : null
      }
    } catch {
      return { hasBackup: false, lastBackup: null }
    }
  }, [timestampKey, backupKey])

  // Restore from backup
  const restoreFromBackup = useCallback(() => {
    try {
      const backup = localStorage.getItem(backupKey)
      if (backup) {
        const backupData = JSON.parse(backup)
        setValue(backupData)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to restore from backup:', error)
      return false
    }
  }, [backupKey, setValue])

  return {
    value,
    setValue: setValueWithBackup,
    error,
    remove,
    refresh,
    getBackupInfo,
    restoreFromBackup
  }
}

// Hook for managing multiple localStorage keys with namespace
export function useLocalStorageNamespace(namespace: string) {
  const getKey = useCallback((key: string) => `${namespace}:${key}`, [namespace])
  
  const get = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(getKey(key))
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }, [getKey])
  
  const set = useCallback(<T>(key: string, value: T): void => {
    try {
      localStorage.setItem(getKey(key), JSON.stringify(value))
    } catch (error) {
      console.error(`Failed to set ${key}:`, error)
    }
  }, [getKey])
  
  const remove = useCallback((key: string): void => {
    try {
      localStorage.removeItem(getKey(key))
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error)
    }
  }, [getKey])
  
  const clear = useCallback((): void => {
    try {
      const keys = Object.keys(localStorage)
      const namespacePrefix = `${namespace}:`
      
      keys.forEach(key => {
        if (key.startsWith(namespacePrefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error(`Failed to clear namespace ${namespace}:`, error)
    }
  }, [namespace])
  
  const list = useCallback((): string[] => {
    try {
      const keys = Object.keys(localStorage)
      const namespacePrefix = `${namespace}:`
      
      return keys
        .filter(key => key.startsWith(namespacePrefix))
        .map(key => key.substring(namespacePrefix.length))
    } catch {
      return []
    }
  }, [namespace])

  return { get, set, remove, clear, list }
}