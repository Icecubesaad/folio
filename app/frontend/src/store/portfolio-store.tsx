// src/components/builder/preview-pane.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { Monitor, Tablet, Smartphone, RotateCcw, ExternalLink, Eye, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PortfolioRenderer } from '@/components/portfolio/portfolio-renderer'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { cn } from '@/lib/utils'

interface PreviewPaneProps {
  previewMode: 'desktop' | 'tablet' | 'mobile'
  isGenerating: boolean
  onExpand?: () => void
  className?: string
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  previewMode,
  isGenerating,
  onExpand,
  className
}) => {
  const portfolioData = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [generatedHtml, setGeneratedHtml] = useState<string>('')
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now())

  // Simulate HTML generation based on portfolio data changes
  useEffect(() => {
    const generateHtml = () => {
      if (!portfolioData.personalInfo?.fullName) {
        setGeneratedHtml('')
        return
      }

      // Simple HTML generation - in real app this would come from your API
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.personalInfo.fullName} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: #f8fafc;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 4rem 2rem; 
            text-align: center; 
            margin-bottom: 3rem; 
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header h1 { font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; }
        .header .title { font-size: 1.5rem; opacity: 0.9; margin-bottom: 1rem; }
        .header .contact { font-size: 1rem; opacity: 0.8; }
        .section { 
            background: white; 
            padding: 2rem; 
            margin-bottom: 2rem; 
            border-radius: 12px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border: 1px solid #e2e8f0;
        }
        .section h2 { 
            font-size: 1.8rem; 
            font-weight: 600; 
            margin-bottom: 1.5rem; 
            color: #1f2937; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 0.5rem;
        }
        .item { 
            margin-bottom: 2rem; 
            padding-bottom: 1.5rem; 
            border-bottom: 1px solid #e5e7eb; 
        }
        .item:last-child { border-bottom: none; margin-bottom: 0; }
        .item-title { font-size: 1.2rem; font-weight: 600; color: #1f2937; margin-bottom: 0.25rem; }
        .item-subtitle { color: #3b82f6; font-weight: 500; margin-bottom: 0.5rem; }
        .item-meta { color: #6b7280; font-size: 0.9rem; margin-bottom: 1rem; }
        .item-description { color: #4b5563; white-space: pre-line; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
        .skill-category { background: #f8fafc; padding: 1.5rem; border-radius: 8px; border: 1px solid #e2e8f0; }
        .skill-category h3 { font-size: 1.1rem; font-weight: 600; margin-bottom: 1rem; color: #1e293b; }
        .skill-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 0.5rem 0; 
            border-bottom: 1px solid #e2e8f0; 
        }
        .skill-item:last-child { border-bottom: none; }
        .skill-level { 
            font-size: 0.75rem; 
            padding: 0.25rem 0.75rem; 
            border-radius: 12px; 
            font-weight: 500; 
        }
        .level-beginner { background: #fef2f2; color: #dc2626; }
        .level-intermediate { background: #fefce8; color: #ca8a04; }
        .level-advanced { background: #eff6ff; color: #2563eb; }
        .level-expert { background: #f0fdf4; color: #16a34a; }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem; }
        .project-card { 
            background: #f8fafc; 
            padding: 2rem; 
            border-radius: 12px; 
            border: 1px solid #e2e8f0; 
            transition: all 0.3s ease;
        }
        .project-card:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
        .tech-tag { 
            background: #dbeafe; 
            color: #1e40af; 
            padding: 0.25rem 0.75rem; 
            border-radius: 12px; 
            font-size: 0.75rem; 
            font-weight: 500; 
        }
        .project-links { display: flex; gap: 1rem; margin-top: 1rem; }
        .project-link { 
            color: #3b82f6; 
            text-decoration: none; 
            font-size: 0.9rem; 
            font-weight: 500; 
            padding: 0.5rem 1rem;
            border: 1px solid #3b82f6;
            border-radius: 6px;
            transition: all 0.2s;
        }
        .project-link:hover { 
            background: #3b82f6;
            color: white;
        }
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .header { padding: 2rem 1rem; }
            .header h1 { font-size: 2rem; }
            .section { padding: 1.5rem; }
            .skills-grid { grid-template-columns: 1fr; }
            .projects-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>${portfolioData.personalInfo.fullName}</h1>
            <div class="title">${portfolioData.personalInfo.professionalTitle || 'Professional'}</div>
            <div class="contact">
                ${portfolioData.personalInfo.email || ''}
                ${portfolioData.personalInfo.phone ? ` • ${portfolioData.personalInfo.phone}` : ''}
                ${portfolioData.personalInfo.location ? ` • ${portfolioData.personalInfo.location}` : ''}
            </div>
        </header>

        ${portfolioData.personalInfo.bio ? `
        <section class="section">
            <h2>About Me</h2>
            <div class="item-description">${portfolioData.personalInfo.bio}</div>
        </section>
        ` : ''}

        ${portfolioData.experience.length > 0 ? `
        <section class="section">
            <h2>Work Experience</h2>
            ${portfolioData.experience.map(exp => `
                <div class="item">
                    <div class="item-title">${exp.position}</div>
                    <div class="item-subtitle">${exp.company}</div>
                    <div class="item-meta">
                        ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                        ${exp.location ? ` • ${exp.location}` : ''}
                    </div>
                    <div class="item-description">${exp.description}</div>
                </div>
            `).join('')}
        </section>
        ` : ''}

        ${portfolioData.skills.length > 0 ? `
        <section class="section">
            <h2>Skills & Expertise</h2>
            <div class="skills-grid">
                ${Object.entries(groupSkillsByCategory(portfolioData.skills)).map(([category, skills]) => `
                    <div class="skill-category">
                        <h3>${category}</h3>
                        ${skills.map(skill => `
                            <div class="skill-item">
                                <span>${skill.name}</span>
                                <span class="skill-level level-${skill.level.toLowerCase()}">${skill.level}</span>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${portfolioData.projects.length > 0 ? `
        <section class="section">
            <h2>Featured Projects</h2>
            <div class="projects-grid">
                ${portfolioData.projects.map(project => `
                    <div class="project-card">
                        <h3 class="item-title">${project.name}</h3>
                        <div class="item-description">${project.description}</div>
                        <div class="tech-tags">
                            ${project.tech.split(',').map(tech => `
                                <span class="tech-tag">${tech.trim()}</span>
                            `).join('')}
                        </div>
                        <div class="project-links">
                            ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">Live Demo</a>` : ''}
                            ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">GitHub</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${portfolioData.education.length > 0 ? `
        <section class="section">
            <h2>Education</h2>
            ${portfolioData.education.map(edu => `
                <div class="item">
                    <div class="item-title">${edu.degree}</div>
                    <div class="item-subtitle">${edu.school}</div>
                    <div class="item-meta">${edu.year}</div>
                    ${edu.details ? `<div class="item-description">${edu.details}</div>` : ''}
                </div>
            `).join('')}
        </section>
        ` : ''}
    </div>

    <script>
        function formatDate(dateString) {
            if (!dateString) return ''
            return new Date(dateString + '-01').toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            })
        }

        function groupSkillsByCategory(skills) {
            return skills.reduce((acc, skill) => {
                const category = skill.category || 'Other'
                if (!acc[category]) acc[category] = []
                acc[category].push(skill)
                return acc
            }, {})
        }
    </script>
</body>
</html>`

      setGeneratedHtml(html)
      setLastUpdateTime(Date.now())
    }

    const timer = setTimeout(generateHtml, 300) // Debounce generation
    return () => clearTimeout(timer)
  }, [portfolioData])

  const handleRefresh = () => {
    setLastUpdateTime(Date.now())
  }

  const handleExternalPreview = () => {
    if (generatedHtml) {
      const blob = new Blob([generatedHtml], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }

  const getPreviewScale = () => {
    switch (previewMode) {
      case 'mobile': return 0.8
      case 'tablet': return 0.7
      case 'desktop': return 1
      default: return 1
    }
  }

  return (
    <div className={cn('flex flex-col h-full bg-gray-100', className)}>
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onExpand && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExpand}
                className="lg:hidden flex items-center space-x-2"
              >
                <Menu className="h-4 w-4" />
                <span>Forms</span>
              </Button>
            )}
            
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Live Preview</span>
              {selectedTemplate && (
                <span className="text-sm text-gray-500">• {selectedTemplate.name}</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isGenerating}
              title="Refresh preview"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* External preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExternalPreview}
              disabled={!generatedHtml || isGenerating}
              title="Open in new window"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div 
            className="transition-all duration-300 ease-in-out"
            style={{ 
              transform: `scale(${getPreviewScale()})`,
              transformOrigin: 'center top'
            }}
          >
            <PortfolioRenderer
              htmlContent={generatedHtml}
              isGenerating={isGenerating}
              previewMode={previewMode}
            />
          </div>
        </div>

        {/* Empty State */}
        {!isGenerating && !generatedHtml && !portfolioData.personalInfo?.fullName && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gray-200 rounded-xl mb-6 mx-auto flex items-center justify-center">
                <Eye className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Portfolio Preview
              </h3>
              <p className="text-gray-600 mb-6">
                Fill out the forms to see your portfolio come to life. 
                Changes will appear here in real-time.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-semibold text-blue-900 mb-3">Getting Started:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Start with <strong>Personal Information</strong></li>
                  <li>Add your <strong>Work Experience</strong></li>
                  <li>Include your <strong>Skills</strong> and <strong>Projects</strong></li>
                  <li>Complete <strong>Education</strong> and <strong>Contact</strong> details</li>
                  <li>Watch your portfolio update automatically!</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Template: {selectedTemplate?.name || 'Default'}</span>
            <span>Mode: {previewMode}</span>
            <span>Scale: {Math.round(getPreviewScale() * 100)}%</span>
          </div>
          <div className="flex items-center space-x-2">
            {portfolioData.personalInfo?.fullName && (
              <span className="text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Live Preview Active
              </span>
            )}
            <span>Last updated: {new Date(lastUpdateTime).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function formatDate(dateString: string): string {
  if (!dateString) return ''
  return new Date(dateString + '-01').toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}

function groupSkillsByCategory(skills: any[]): Record<string, any[]> {
  if (!skills || !Array.isArray(skills)) return {}
  
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {} as Record<string, any[]>)
}