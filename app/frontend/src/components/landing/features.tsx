'use client'

import React from 'react'
import { Brain, Palette, Download, Code, Smartphone, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Generation',
    description: 'Our AI creates custom portfolios based on your information and chosen style.',
    color: 'text-purple-600'
  },
  {
    icon: Palette,
    title: 'Professional Templates',
    description: 'Choose from carefully designed templates for different industries and styles.',
    color: 'text-pink-600'
  },
  {
    icon: Smartphone,
    title: 'Mobile Responsive',
    description: 'Every portfolio looks perfect on desktop, tablet, and mobile devices.',
    color: 'text-blue-600'
  },
  {
    icon: Code,
    title: 'Clean Code Export',
    description: 'Download clean HTML, CSS, and JavaScript files ready for hosting anywhere.',
    color: 'text-green-600'
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Get your complete portfolio as a zip file in seconds, no hosting required.',
    color: 'text-orange-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Build professional portfolios in minutes, not hours or days.',
    color: 'text-yellow-600'
  }
]

export const Features: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to stand out
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build professional portfolios with cutting-edge AI technology and modern design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
