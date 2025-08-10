import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { debouncedGeneratePortfolio, generateQuickPreview, clearPortfolioCache } from '@/lib/portfolio-generator'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useDebounce } from './use-debounce'

export const usePortfolioData = () => {
  const portfolioStore = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [isFromCache, setIsFromCache] = useState(false)
  const [lastGeneratedAt, setLastGeneratedAt] = useState<number>(0)
  const [generationId, setGenerationId] = useState<string>('')
  
  // Debounce portfolio data changes to avoid too frequent generations
  const debouncedPortfolioData = useDebounce(portfolioStore, 800)
  
  // Refs to prevent stale closures
  const portfolioDataRef = useRef(portfolioStore)
  const selectedTemplateRef = useRef(selectedTemplate)
  const isGeneratingRef = useRef(false)
  
  // Update refs when data changes
  useEffect(() => {
    portfolioDataRef.current = debouncedPortfolioData
  }, [debouncedPortfolioData])
  
  useEffect(() => {
    selectedTemplateRef.current = selectedTemplate
  }, [selectedTemplate])

  useEffect(() => {
    isGeneratingRef.current = isGenerating
  }, [isGenerating])

  // Generate portfolio callback with better state management
  const generatePortfolioCallback = useCallback((html: string, fromCache = false) => {
    // Only update if this is the most recent generation
    if (!isGeneratingRef.current && !html) return
    
    setGeneratedHtml(html)
    setIsGenerating(false)
    setIsFromCache(fromCache)
    setLastGeneratedAt(Date.now())
    setGenerationError(null)
    
    console.log('Portfolio generated:', { fromCache, length: html.length })
  }, [])

  // Check if we have minimum data required for generation
  const hasMinimumData = useCallback(() => {
    return !!(
      debouncedPortfolioData.personalInfo?.fullName?.trim() &&
      debouncedPortfolioData.personalInfo?.email?.trim() &&
      debouncedPortfolioData.personalInfo?.professionalTitle?.trim()
    )
  }, [debouncedPortfolioData.personalInfo])

  // Check if data has meaningful content beyond minimum
  const hasRichContent = useCallback(() => {
    const data = debouncedPortfolioData
    return (
      hasMinimumData() && (
        (data.experience && data.experience.length > 0) ||
        (data.projects && data.projects.length > 0) ||
        (data.skills && data.skills.length > 0) ||
        (data.education && data.education.length > 0) ||
        (data.personalInfo?.bio && data.personalInfo.bio.trim().length > 20)
      )
    )
  }, [debouncedPortfolioData, hasMinimumData])

  // Main generation effect
  useEffect(() => {
    const currentGenerationId = Date.now().toString()
    setGenerationId(currentGenerationId)

    if (!selectedTemplate) {
      setGeneratedHtml('')
      setIsGenerating(false)
      return
    }

    // Show quick preview if we have minimum data but not enough for full generation
    if (hasMinimumData() && !hasRichContent()) {
      const preview = generateQuickPreview(debouncedPortfolioData, selectedTemplate)
      setGeneratedHtml(preview)
      setIsGenerating(false)
      setIsFromCache(false)
      return
    }

    // Full generation for rich content
    if (hasRichContent()) {
      setIsGenerating(true)
      setGenerationError(null)

      try {
        debouncedGeneratePortfolio(
          debouncedPortfolioData,
          selectedTemplate,
          (html, fromCache) => {
            // Only update if this is still the current generation
            if (generationId === currentGenerationId) {
              generatePortfolioCallback(html, fromCache)
            }
          },
          1000 // 1 second debounce for real-time feel
        )
      } catch (error) {
        console.error('Portfolio generation setup failed:', error)
        setGenerationError('Failed to start portfolio generation')
        setIsGenerating(false)
      }
    } else {
      // Clear if no minimum data
      setGeneratedHtml('')
      setIsGenerating(false)
    }

    // Cleanup function
    return () => {
      // Mark this generation as stale
      if (generationId === currentGenerationId) {
        setGenerationId('')
      }
    }
  }, [
    debouncedPortfolioData, 
    selectedTemplate, 
    hasMinimumData, 
    hasRichContent, 
    generatePortfolioCallback,
    generationId
  ])

  // Force regeneration (useful for retry buttons)
  const forceRegenerate = useCallback(() => {
    if (!selectedTemplate || !hasMinimumData()) return

    setIsGenerating(true)
    setGenerationError(null)
    setIsFromCache(false)
    clearPortfolioCache() // Clear cache to force fresh generation

    // Generate immediately without debounce
    try {
      debouncedGeneratePortfolio(
        portfolioDataRef.current,
        selectedTemplateRef.current,
        generatePortfolioCallback,
        0 // No debounce for forced regeneration
      )
    } catch (error) {
      setGenerationError('Force regeneration failed')
      setIsGenerating(false)
    }
  }, [selectedTemplate, hasMinimumData, generatePortfolioCallback])

  // Get generation status for UI feedback
  const getGenerationStatus = useCallback(() => {
    if (generationError) return 'error'
    if (isGenerating) return 'generating'
    if (generatedHtml && !isGenerating) {
      return hasRichContent() ? 'completed' : 'preview'
    }
    if (!hasMinimumData()) return 'insufficient_data'
    return 'idle'
  }, [generationError, isGenerating, generatedHtml, hasMinimumData, hasRichContent])

  // Get completion percentage for progress indicators
  const getCompletionPercentage = useCallback(() => {
    const sections = [
      { 
        key: 'personalInfo', 
        weight: 25, 
        hasData: !!(debouncedPortfolioData.personalInfo?.fullName && 
                   debouncedPortfolioData.personalInfo?.email && 
                   debouncedPortfolioData.personalInfo?.professionalTitle) 
      },
      { 
        key: 'bio', 
        weight: 10, 
        hasData: !!(debouncedPortfolioData.personalInfo?.bio && 
                   debouncedPortfolioData.personalInfo.bio.length > 20) 
      },
      { 
        key: 'experience', 
        weight: 25, 
        hasData: !!(debouncedPortfolioData.experience?.length) 
      },
      { 
        key: 'skills', 
        weight: 15, 
        hasData: !!(debouncedPortfolioData.skills?.length) 
      },
      { 
        key: 'projects', 
        weight: 20, 
        hasData: !!(debouncedPortfolioData.projects?.length) 
      },
      { 
        key: 'education', 
        weight: 10, 
        hasData: !!(debouncedPortfolioData.education?.length) 
      },
      { 
        key: 'template', 
        weight: 5, 
        hasData: !!selectedTemplate 
      }
    ]

    const completedWeight = sections
      .filter(section => section.hasData)
      .reduce((sum, section) => sum + section.weight, 0)

    return Math.round(completedWeight)
  }, [debouncedPortfolioData, selectedTemplate])

  // Get suggestions for improving the portfolio
  const getImprovementSuggestions = useCallback(() => {
    const suggestions: Array<{ text: string; priority: 'high' | 'medium' | 'low' }> = []

    if (!debouncedPortfolioData.personalInfo?.fullName) {
      suggestions.push({ text: 'Add your full name', priority: 'high' })
    }
    if (!debouncedPortfolioData.personalInfo?.professionalTitle) {
      suggestions.push({ text: 'Add your professional title', priority: 'high' })
    }
    if (!debouncedPortfolioData.personalInfo?.email) {
      suggestions.push({ text: 'Add your email address', priority: 'high' })
    }
    if (!debouncedPortfolioData.personalInfo?.bio || debouncedPortfolioData.personalInfo.bio.length < 20) {
      suggestions.push({ text: 'Write a compelling professional bio', priority: 'high' })
    }
    if (!debouncedPortfolioData.experience?.length) {
      suggestions.push({ text: 'Add your work experience', priority: 'medium' })
    }
    if (!debouncedPortfolioData.projects?.length) {
      suggestions.push({ text: 'Showcase your projects', priority: 'medium' })
    }
    if (!debouncedPortfolioData.skills?.length) {
      suggestions.push({ text: 'List your technical skills', priority: 'medium' })
    }
    if (!debouncedPortfolioData.personalInfo?.location) {
      suggestions.push({ text: 'Add your location', priority: 'low' })
    }
    if (!debouncedPortfolioData.personalInfo?.phone) {
      suggestions.push({ text: 'Add your phone number', priority: 'low' })
    }
    if (!selectedTemplate) {
      suggestions.push({ text: 'Select a design template', priority: 'high' })
    }

    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      })
      .slice(0, 5) // Return top 5 suggestions
  }, [debouncedPortfolioData, selectedTemplate])

  // Analytics/tracking for generation performance
  const getGenerationStats = useCallback(() => {
    return {
      lastGenerated: lastGeneratedAt,
      timeSinceGenerated: lastGeneratedAt ? Date.now() - lastGeneratedAt : 0,
      isFromCache,
      completionPercentage: getCompletionPercentage(),
      status: getGenerationStatus(),
      hasMinimumData: hasMinimumData(),
      hasRichContent: hasRichContent(),
      dataHash: JSON.stringify(debouncedPortfolioData).length,
      templateId: selectedTemplate?.id || null
    }
  }, [
    lastGeneratedAt, 
    isFromCache, 
    getCompletionPercentage, 
    getGenerationStatus, 
    hasMinimumData, 
    hasRichContent, 
    debouncedPortfolioData, 
    selectedTemplate
  ])

  // Get next recommended action
  const getNextAction = useCallback(() => {
    if (!selectedTemplate) return { action: 'selectTemplate', text: 'Select a template to get started' }
    if (!hasMinimumData()) return { action: 'completeBasics', text: 'Complete your basic information' }
    if (!hasRichContent()) return { action: 'addContent', text: 'Add experience, projects, or skills' }
    if (generationError) return { action: 'retry', text: 'Retry portfolio generation' }
    if (isGenerating) return { action: 'wait', text: 'Portfolio is being generated...' }
    return { action: 'enhance', text: 'Enhance your portfolio with more details' }
  }, [selectedTemplate, hasMinimumData, hasRichContent, generationError, isGenerating])

  return {
    // Core data
    portfolioData: debouncedPortfolioData,
    selectedTemplate,
    generatedHtml,
    
    // Generation state
    isGenerating,
    generationError,
    isFromCache,
    generationId,
    
    // Helper functions
    hasMinimumData: hasMinimumData(),
    hasRichContent: hasRichContent(),
    forceRegenerate,
    
    // Status and progress
    generationStatus: getGenerationStatus(),
    completionPercentage: getCompletionPercentage(),
    improvementSuggestions: getImprovementSuggestions(),
    nextAction: getNextAction(),
    
    // Analytics
    generationStats: getGenerationStats()
  }
}