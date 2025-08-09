import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { debouncedGeneratePortfolio } from '@/lib/portfolio-generator'
import { useState, useEffect } from 'react'

export const usePortfolioData = () => {
  const portfolioData = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (selectedTemplate && portfolioData.personalInfo?.fullName) {
      setIsGenerating(true)
      debouncedGeneratePortfolio(
        portfolioData, 
        selectedTemplate, 
        (html) => {
          setGeneratedHtml(html)
          setIsGenerating(false)
        }
      )
    }
  }, [portfolioData, selectedTemplate])

  return {
    portfolioData,
    generatedHtml,
    isGenerating,
    selectedTemplate
  }
}