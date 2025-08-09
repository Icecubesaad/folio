// src/components/builder/form-sidebar.tsx
'use client'

import React from 'react'
import { X, User, Briefcase, GraduationCap, Code2, FolderOpen, Mail, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/sidebar'
import { cn } from '@/lib/utils'
import { usePortfolioStore } from '@/store/portfolio-store'

// Import form components (these would need to be created)
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
        <Sidebar
          activeItem={activeForm}
          onItemSelect={onFormChange}
          items={formSections}
          onCollapse={onCollapse}
        />
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
            <div className="max-w-2xl">
              {ActiveFormComponent && <ActiveFormComponent />}
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
  return descriptions[formId as keyof typeof descriptions] || ''
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
  if (collapsed) {
    return (
      <div className={cn('w-16 bg-white border-r border-gray-200', className)}>
        <Sidebar
          collapsed={true}
          activeItem={activeForm}
          onItemSelect={onFormChange}
          items={[
            { id: 'personal', title: 'Personal Info', icon: User, completed: true },
            { id: 'experience', title: 'Experience', icon: Briefcase, count: 2 },
            { id: 'education', title: 'Education', icon: GraduationCap, count: 1 },
            { id: 'skills', title: 'Skills', icon: Code2, count: 3 },
            { id: 'projects', title: 'Projects', icon: FolderOpen, count: 2 },
            { id: 'contact', title: 'Contact', icon: Mail, completed: true }
          ]}
        />
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