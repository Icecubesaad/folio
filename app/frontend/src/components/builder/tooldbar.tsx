// src/components/builder/toolbar.tsx
'use client'

import React, { useState } from 'react'
import { 
  Save, 
  Download, 
  Share2, 
  Eye, 
  Undo, 
  Redo, 
  Settings, 
  Palette,
  Code,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { LoadingSpinner } from '@/components/ui/loading'
import { usePortfolioStore } from '@/store/portfolio-store'
import { useTemplateStore } from '@/store/template-store'
import { downloadFile } from '@/lib/download-file'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ToolbarProps {
  className?: string
  isGenerating?: boolean
  onSave?: () => Promise<void>
  onDownload?: () => Promise<void>
  onPreview?: () => void
  onShare?: () => void
}

export const Toolbar: React.FC<ToolbarProps> = ({
  className,
  isGenerating = false,
  onSave,
  onDownload,
  onPreview,
  onShare
}) => {
  const portfolioData = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSave = async () => {
    if (!portfolioData.personalInfo?.fullName) {
      toast.error('Please fill out your personal information first')
      return
    }

    try {
      setIsSaving(true)
      if (onSave) {
        await onSave()
      } else {
        // Default save logic
        const response = await fetch('/api/save-portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            portfolioData,
            template: selectedTemplate
          })
        })

        if (response.ok) {
          const data = await response.json()
          setShareUrl(data.portfolioUrl)
          toast.success('Portfolio saved successfully!')
        } else {
          throw new Error('Failed to save portfolio')
        }
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save portfolio')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!portfolioData.personalInfo?.fullName) {
      toast.error('Please fill out your personal information first')
      return
    }

    try {
      setIsDownloading(true)
      if (onDownload) {
        await onDownload()
      } else {
        // Default download logic
        await downloadFile(portfolioData, selectedTemplate)
        toast.success('Portfolio downloaded successfully!')
      }
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download portfolio')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = () => {
    if (shareUrl) {
      setShowShareModal(true)
    } else {
      // Save first, then share
      handleSave().then(() => {
        if (shareUrl) {
          setShowShareModal(true)
        }
      })
    }
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const canPerformActions = portfolioData.personalInfo?.fullName && selectedTemplate

  return (
    <>
      <div className={cn(
        'flex items-center justify-between bg-white border-b border-gray-200 px-4 py-2',
        className
      )}>
        {/* Left Section - Primary Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!canPerformActions || isSaving || isGenerating}
            className="flex items-center space-x-2"
          >
            {isSaving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            disabled={!canPerformActions || isDownloading || isGenerating}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            {isDownloading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Download</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={!canPerformActions || isGenerating}
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>

        {/* Center Section - Status */}
        <div className="hidden md:flex items-center space-x-4">
          {isGenerating && (
            <div className="flex items-center space-x-2 text-blue-600">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
          
          {portfolioData.personalInfo?.fullName && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-sm">Portfolio Ready</span>
            </div>
          )}
        </div>

        {/* Right Section - Secondary Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPreview}
            disabled={!canPerformActions}
            className="flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Portfolio"
        description="Share your portfolio with others using the link below"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portfolio Link
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyShareUrl}
                className="flex items-center space-x-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => window.open(shareUrl, '_blank')}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Portfolio</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const text = `Check out my portfolio: ${shareUrl}`
                if (navigator.share) {
                  navigator.share({ title: 'My Portfolio', url: shareUrl, text })
                } else {
                  navigator.clipboard.writeText(text)
                  toast.success('Share text copied to clipboard!')
                }
              }}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Portfolio Settings"
        description="Customize your portfolio generation settings"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-sm text-gray-700">Include CSS in separate file</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-sm text-gray-700">Include JavaScript in separate file</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" />
                <span className="text-sm text-gray-700">Minify output files</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-3" defaultChecked />
                <span className="text-sm text-gray-700">Include README.md file</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Generation Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Creativity Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Conservative</option>
                  <option selected>Balanced</option>
                  <option>Creative</option>
                  <option>Experimental</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Quality
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                  <option>Basic</option>
                  <option selected>Professional</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Settings saved!')
                setShowSettingsModal(false)
              }}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}