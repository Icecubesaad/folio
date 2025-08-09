'use client'

import React from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CTAProps {
  onGetStarted: () => void
}

const benefits = [
  'Professional templates',
  'AI-powered generation',
  'Mobile responsive',
  'Clean code export',
  'No monthly fees'
]

export const CTA: React.FC<CTAProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to build your dream portfolio?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of professionals who've already built amazing portfolios
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-2 text-blue-100">
              <Check className="h-4 w-4 text-green-300" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Start Building Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-blue-100 text-sm">
            No credit card required • Takes 5 minutes
          </p>
        </div>
      </div>
    </section>
  )
}