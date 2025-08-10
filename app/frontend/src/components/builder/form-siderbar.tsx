// src/components/builder/form-sidebar.tsx
'use client'

import React from 'react'
import { X, User, Briefcase, GraduationCap, Code2, FolderOpen, Mail, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { usePortfolioStore } from '@/store/portfolio-store'

// Import form components
import { PersonalInfoForm } from './forms/personal-info'
import { ExperienceForm } from './forms/experience'
import { EducationForm } from './forms/education'
import { SkillsForm } from './forms/skills'
import { ProjectsForm } from './forms/projects'
import { ContactForm } from './forms/contact'

interface FormSidebarProps {
  activeForm: string
  onFormChange: (form: string) => void
  onCollapse?: () => void
  className?: string
}

export const FormSidebar: React.FC<FormSidebarProps> = ({
  activeForm,
  onFormChange,
  onCollapse,
  className
}) => {
  const { personalInfo, experience, education, skills, projects } = usePortfolioStore()

  const formSections = [
    {
      id: 'personal',
      title: 'Personal Info',
      icon: User,
      completed: Boolean(personalInfo?.fullName && personalInfo?.email && personalInfo?.professionalTitle),
      component: PersonalInfoForm
    },
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      count: experience.length,
      component: ExperienceForm
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      count: education.length,
      component: EducationForm
    },
    {
      id: 'skills',
      title: 'Skills & Expertise',
      icon: Code2,
      count: skills.length,
      component: SkillsForm
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: FolderOpen,
      count: projects.length,
      component: ProjectsForm
    },
    {
      id: 'contact',
      title: 'Contact & Social',
      icon: Mail,
      completed: Boolean(personalInfo?.email),
      component: ContactForm
    }
  ]

  const activeSection = formSections.find(section => section.id === activeForm)
  const ActiveFormComponent = activeSection?.component

  return (
    <div className={cn('flex h-full', className)}>
      {/* Navigation Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Portfolio Forms</h2>
            {onCollapse && (
              <Button variant="ghost" size="sm" onClick={onCollapse}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-2">
              {formSections.map((section) => {
                const Icon = section.icon
                const isActive = activeForm === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => onFormChange(section.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200',
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={cn(
                        'h-5 w-5',
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      )} />
                      <div>
                        <div className="font-medium text-sm">{section.title}</div>
                        {section.count !== undefined && (
                          <div className="text-xs text-gray-500">
                            {section.count} {section.count === 1 ? 'item' : 'items'}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {section.completed && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {section.count !== undefined && section.count > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {section.count}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 bg-gray-50">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            {/* Form Header */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-2">
                {activeSection && <activeSection.icon className="h-6 w-6 text-blue-600" />}
                <h2 className="text-2xl font-semibold text-gray-900">
                  {activeSection?.title}
                </h2>
              </div>
              <p className="text-gray-600">
                {getFormDescription(activeForm)}
              </p>
            </div>

            {/* Form Component */}
            <div className="max-w-4xl">
              {ActiveFormComponent ? (
                <ActiveFormComponent />
              ) : (
                <Card className="p-8 text-center">
                  <div className="text-gray-500">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Settings className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Form Not Available</h3>
                    <p className="text-gray-600">
                      This form component is not yet implemented or couldn't be loaded.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFormDescription(formId: string): string {
  const descriptions = {
    personal: 'Add your basic information to personalize your portfolio.',
    experience: 'Showcase your professional work history and achievements.',
    education: 'Add your educational background and qualifications.',
    skills: 'Highlight your technical skills and areas of expertise.',
    projects: 'Feature your best projects and portfolio pieces.',
    contact: 'Add your contact information and social media links.'
  }
  return descriptions[formId as keyof typeof descriptions] || 'Complete this section to enhance your portfolio.'
}

// Collapsible version for mobile
interface CollapsibleFormSidebarProps extends FormSidebarProps {
  collapsed: boolean
}

export const CollapsibleFormSidebar: React.FC<CollapsibleFormSidebarProps> = ({
  activeForm,
  onFormChange,
  onCollapse,
  collapsed,
  className
}) => {
  const { personalInfo, experience, education, skills, projects } = usePortfolioStore()

  const formSections = [
    { id: 'personal', title: 'Personal Info', icon: User, completed: Boolean(personalInfo?.fullName) },
    { id: 'experience', title: 'Experience', icon: Briefcase, count: experience.length },
    { id: 'education', title: 'Education', icon: GraduationCap, count: education.length },
    { id: 'skills', title: 'Skills', icon: Code2, count: skills.length },
    { id: 'projects', title: 'Projects', icon: FolderOpen, count: projects.length },
    { id: 'contact', title: 'Contact', icon: Mail, completed: Boolean(personalInfo?.email) }
  ]

  if (collapsed) {
    return (
      <div className={cn('w-16 bg-white border-r border-gray-200', className)}>
        <div className="flex flex-col items-center py-4 space-y-4">
          {formSections.map((section) => {
            const Icon = section.icon
            const isActive = activeForm === section.id

            return (
              <button
                key={section.id}
                onClick={() => onFormChange(section.id)}
                className={cn(
                  'p-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                )}
                title={section.title}
              >
                <Icon className="h-5 w-5" />
                {(section.count || 0) > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <FormSidebar
      activeForm={activeForm}
      onFormChange={onFormChange}
      onCollapse={onCollapse}
      className={className}
    />
  )
}