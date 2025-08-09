'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Sparkles, Zap, Download, Eye, Code, Star, Users, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-600" />,
      title: "AI-Powered Generation",
      description: "Claude creates beautiful, unique portfolios tailored to your profession and style"
    },
    {
      icon: <Zap className="h-6 w-6 text-green-600" />,
      title: "Lightning Fast",
      description: "Go from idea to published portfolio in under 10 minutes"
    },
    {
      icon: <Eye className="h-6 w-6 text-purple-600" />,
      title: "Live Preview",
      description: "See your portfolio update in real-time as you fill out forms"
    },
    {
      icon: <Download className="h-6 w-6 text-orange-600" />,
      title: "Export Ready",
      description: "Download clean HTML, CSS, and JS files ready for hosting anywhere"
    },
    {
      icon: <Code className="h-6 w-6 text-red-600" />,
      title: "No Coding Required",
      description: "Beautiful, professional websites without writing a single line of code"
    },
    {
      icon: <Users className="h-6 w-6 text-teal-600" />,
      title: "Multiple Templates",
      description: "Choose from designer-crafted templates for different professions and styles"
    }
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Frontend Developer",
      content: "Built my portfolio in 8 minutes. Got 3 job interviews in the first week!",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      role: "UX Designer",
      content: "The AI understood my style perfectly. Clients love the modern, clean design.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Manager",
      content: "Finally, a portfolio builder that doesn't look generic. Highly recommend!",
      rating: 5
    }
  ]

  const stats = [
    { number: "10K+", label: "Portfolios Created" },
    { number: "95%", label: "User Satisfaction" },
    { number: "<10min", label: "Average Build Time" },
    { number: "50+", label: "Template Variations" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PortfolioBuilder</span>
            </div>
            <Button 
              onClick={() => router.push('/onboarding')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Build Your Dream
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Portfolio in Minutes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Let AI create a stunning, professional portfolio tailored to your field. 
              No design skills needed. No coding required. Just beautiful results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => router.push('/onboarding')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Building Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg border-2 border-gray-300 hover:border-gray-400 rounded-xl"
              >
                View Examples
                <Eye className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose PortfolioBuilder?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've reimagined portfolio creation with cutting-edge AI and intuitive design
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-gray-50">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600">From zero to portfolio in minutes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Tell Us About You", desc: "Share your profession, experience, and style preferences" },
              { step: "2", title: "Choose Template", desc: "Pick from AI-curated templates that match your field" },
              { step: "3", title: "Fill Your Details", desc: "Add your experience, projects, and skills in our smart forms" },
              { step: "4", title: "Export & Launch", desc: "Download your portfolio or get a shareable link instantly" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Professionals
            </h2>
            <p className="text-xl text-gray-600">Join thousands who've built amazing portfolios</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Portfolio?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who've already created stunning portfolios
          </p>
          <Button 
            size="lg"
            onClick={() => router.push('/onboarding')}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Building Now - It's Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">PortfolioBuilder</span>
            </div>
            <div className="text-gray-400">
              © 2024 PortfolioBuilder. Made with ❤️ for professionals everywhere.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}