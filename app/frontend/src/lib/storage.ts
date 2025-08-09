export const saveToLocalStorage = (key: string, data: any) => {
	try {
	  localStorage.setItem(key, JSON.stringify(data))
	} catch (error) {
	  console.error('Failed to save to localStorage:', error)
	}
  }
  
  export const loadFromLocalStorage = (key: string) => {
	try {
	  const item = localStorage.getItem(key)
	  return item ? JSON.parse(item) : null
	} catch (error) {
	  console.error('Failed to load from localStorage:', error)
	  return null
	}
  }
  