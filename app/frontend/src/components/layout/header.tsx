// src/components/layout/header.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Code, Menu, X, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePortfolioStore } from '@/store/portfolio-store'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { personalInfo, reset } = usePortfolioStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navigation = [
    { name: 'Home', href: '/', current: pathname === '/' },
    { name: 'Templates', href: '/templates', current: pathname === '/templates' },
    { name: 'Builder', href: '/builder', current: pathname === '/builder' }
  ]

  const handleReset = () => {
    reset()
    router.push('/')
  }

  return (
    <header className={cn(
      'bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40',
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PortfolioBuilder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-blue-600',
                  item.current 
                    ? 'text-blue-600' 
                    : 'text-gray-700'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {personalInfo?.fullName ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{personalInfo.fullName}</div>
                  <div className="text-gray-500">{personalInfo.professionalTitle}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push('/onboarding')}
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    item.current
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {personalInfo?.fullName ? (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium text-gray-900">{personalInfo.fullName}</div>
                    <div className="text-sm text-gray-500">{personalInfo.professionalTitle}</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleReset()
                      setMobileMenuOpen(false)
                    }}
                    className="ml-3 mt-2 text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <Button
                    className="ml-3"
                    onClick={() => {
                      router.push('/onboarding')
                      setMobileMenuOpen(false)
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}