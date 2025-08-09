'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'
import { Card } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Frontend Developer',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
    content: 'I built my portfolio in 10 minutes and got 3 interview requests in the first week. The AI really understood my style!',
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    role: 'UX Designer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    content: 'The templates are gorgeous and the customization is perfect. Finally, a portfolio builder that gets design right.',
    rating: 5
  },
  {
    name: 'Elena Rodriguez',
    role: 'Data Scientist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    content: 'Clean code, responsive design, and it showcases my projects beautifully. Worth every minute I spent setting it up.',
    rating: 5
  }
]

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by professionals worldwide
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands who've built amazing portfolios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white">
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="mb-4">
                <Quote className="h-8 w-8 text-gray-300 mb-2" />
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}