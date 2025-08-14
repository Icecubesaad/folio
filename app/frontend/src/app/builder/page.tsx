'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  FolderOpen, 
  Mail, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  Download, 
  Eye, 
  ChevronRight,
  Settings,
  Palette,
  Camera,
  MapPin,
  Phone,
  Globe,
  Github,
  Linkedin,
  Twitter,
  X,
  ChevronLeft
} from 'lucide-react'
import { PersonalInfoForm } from '@/components/builder/forms/personal-info'
import { EducationForm } from '@/components/builder/forms/education'
import { ContactForm } from '@/components/builder/forms/contact'
import { ProjectsForm } from '@/components/builder/forms/projects'
import { SkillsForm } from '@/components/builder/forms/skills'
import { ExperienceForm } from '@/components/builder/forms/experience'
// Mock stores (replace with your actual stores)
const usePortfolioStore = () => ({
  personalInfo: {
    fullName: "John Doe",
    professionalTitle: "Full-Stack Developer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev",
    bio: "Passionate full-stack developer with 5+ years of experience creating scalable web applications. I love turning complex problems into simple, beautiful solutions that users enjoy.",
    profileImage: "/api/placeholder/200/200"
  },
  experience: [
    {
      id: 1,
      position: "Senior Full-Stack Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      startDate: "2022-01",
      endDate: null,
      current: true,
      description: "Led development of microservices architecture serving 1M+ users. Built React frontends and Node.js backends, improved performance by 40%."
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2020-06",
      endDate: "2021-12",
      current: false,
      description: "Developed responsive web applications using React and TypeScript. Collaborated with designers to implement pixel-perfect UIs."
    }
  ],
  skills: [
    { id: 1, name: "JavaScript", level: "Expert", category: "Frontend" },
    { id: 2, name: "React", level: "Expert", category: "Frontend" },
    { id: 3, name: "TypeScript", level: "Advanced", category: "Frontend" },
    { id: 4, name: "Node.js", level: "Advanced", category: "Backend" },
    { id: 5, name: "Python", level: "Intermediate", category: "Backend" },
    { id: 6, name: "PostgreSQL", level: "Advanced", category: "Database" },
    { id: 7, name: "AWS", level: "Intermediate", category: "Cloud" },
    { id: 8, name: "Docker", level: "Intermediate", category: "DevOps" }
  ],
  projects: [
    {
      id: 1,
      name: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with React frontend, Node.js backend, and Stripe integration. Features include user authentication, product management, and order processing.",
      tech: "React, Node.js, MongoDB, Stripe, AWS",
      link: "https://ecommerce-demo.com",
      github: "https://github.com/johndoe/ecommerce-platform",
      featured: true
    },
    {
      id: 2,
      name: "Task Management App",
      description: "Collaborative task management application with real-time updates, file sharing, and team collaboration features.",
      tech: "Vue.js, Express, Socket.io, PostgreSQL",
      link: "https://taskapp-demo.com",
      github: "https://github.com/johndoe/task-manager"
    },
    {
      id: 3,
      name: "Weather Analytics Dashboard",
      description: "Data visualization dashboard showing weather patterns and analytics using D3.js and external APIs.",
      tech: "React, D3.js, Python, FastAPI",
      link: "https://weather-dashboard.com",
      github: "https://github.com/johndoe/weather-dashboard"
    }
  ],
  education: [
    {
      id: 1,
      degree: "Bachelor of Science in Computer Science",
      school: "University of California, Berkeley",
      year: "2019",
      details: "Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering."
    }
  ]
})

const useTemplateStore = () => ({
  selectedTemplate: {
    id: 'modern-professional',
    name: 'Modern Professional',
    style: 'modern'
  }
})
const EnhancedPortfolioBuilder = () => {
  const portfolioData = usePortfolioStore()
  const { selectedTemplate } = useTemplateStore()
  
  // Sidebar states
  const [iconSidebarVisible, setIconSidebarVisible] = useState(true)
  const [formSidebarVisible, setFormSidebarVisible] = useState(false)
  const [activeForm, setActiveForm] = useState('personal')
  const [formSidebarWidth, setFormSidebarWidth] = useState(420)
  
  // Preview states
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Resize functionality
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef(null)
  const containerRef = useRef(null)
  
  const MIN_FORM_WIDTH = 380
  const MAX_FORM_WIDTH = 600
  const ICON_SIDEBAR_WIDTH = 80

  // Handle resize
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
    
    const startX = e.clientX
    const startWidth = formSidebarWidth
    
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const newWidth = Math.min(
        Math.max(startWidth + deltaX, MIN_FORM_WIDTH),
        MAX_FORM_WIDTH
      )
      setFormSidebarWidth(newWidth)
    }
    
    const handleMouseUp = () => {
      setIsResizing(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [formSidebarWidth])

  // Form sections
  const formSections = [
    { id: 'personal', title: 'Personal Info', icon: User, color: 'bg-blue-500' },
    { id: 'experience', title: 'Experience', icon: Briefcase, color: 'bg-green-500' },
    { id: 'education', title: 'Education', icon: GraduationCap, color: 'bg-purple-500' },
    { id: 'skills', title: 'Skills', icon: Code2, color: 'bg-orange-500' },
    { id: 'projects', title: 'Projects', icon: FolderOpen, color: 'bg-red-500' },
    { id: 'contact', title: 'Contact', icon: Mail, color: 'bg-cyan-500' }
  ]

  // Handle form section click
  const handleFormSectionClick = (sectionId) => {
    if (activeForm === sectionId && formSidebarVisible) {
      setFormSidebarVisible(false)
    } else {
      setActiveForm(sectionId)
      setFormSidebarVisible(true)
    }
  }

  // Generate beautiful default template
  const generateHTML = () => {
    const { personalInfo, experience, skills, projects, education } = portfolioData
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: #ffffff;
            min-height: 100vh;
            box-shadow: 0 0 50px rgba(0,0,0,0.1);
        }
        
        /* Header Section */
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff08" points="0,0 1000,300 1000,1000 0,700"/></svg>');
            background-size: cover;
        }
        
        .header-content {
            position: relative;
            z-index: 2;
        }
        
        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 6px solid rgba(255,255,255,0.2);
            margin: 0 auto 2rem;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
            color: white;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #ffffff, #e0e7ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .header .title {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 1rem;
            font-weight: 300;
        }
        
        .header .bio {
            font-size: 1.1rem;
            opacity: 0.8;
            max-width: 600px;
            margin: 0 auto 2rem;
            line-height: 1.8;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            gap: 2rem;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.95rem;
            opacity: 0.9;
        }
        
        /* Main Content */
        .main-content {
            padding: 4rem 2rem;
        }
        
        .section {
            margin-bottom: 4rem;
        }
        
        .section-title {
            font-size: 2.2rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 2rem;
            position: relative;
            padding-bottom: 0.5rem;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        /* Experience Cards */
        .experience-grid {
            display: grid;
            gap: 2rem;
        }
        
        .experience-item {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .experience-item:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        
        .experience-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border-radius: 2px;
        }
        
        .experience-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .experience-company {
            color: #3b82f6;
            font-weight: 500;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
        }
        
        .experience-meta {
            color: #6b7280;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .experience-description {
            color: #4b5563;
            line-height: 1.7;
        }
        
        /* Skills Section */
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .skill-category {
            background: #f8fafc;
            padding: 2rem;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
        }
        
        .skill-category h3 {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #1e293b;
        }
        
        .skill-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .skill-item:last-child { border-bottom: none; }
        
        .skill-level {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-weight: 500;
        }
        
        .level-expert { background: #dcfce7; color: #166534; }
        .level-advanced { background: #dbeafe; color: #1e40af; }
        .level-intermediate { background: #fef3c7; color: #92400e; }
        .level-beginner { background: #fee2e2; color: #dc2626; }
        
        /* Projects Grid */
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
        }
        
        .project-card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
        }
        
        .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        
        .project-header {
            background: linear-gradient(45deg, #f8fafc, #e2e8f0);
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        .project-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .project-description {
            color: #4b5563;
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        
        .tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .tech-tag {
            background: #e0f2fe;
            color: #0369a1;
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .project-links {
            display: flex;
            gap: 1rem;
        }
        
        .project-link {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #3b82f6;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border: 1px solid #3b82f6;
            border-radius: 8px;
            transition: all 0.2s;
        }
        
        .project-link:hover {
            background: #3b82f6;
            color: white;
        }
        
        /* Education */
        .education-item {
            background: #ffffff;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
            border: 1px solid #e5e7eb;
        }
        
        .education-degree {
            font-size: 1.2rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 0.5rem;
        }
        
        .education-school {
            color: #3b82f6;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .header {
                padding: 3rem 1rem;
            }
            
            .header h1 {
                font-size: 2.5rem;
            }
            
            .main-content {
                padding: 2rem 1rem;
            }
            
            .contact-info {
                flex-direction: column;
                gap: 1rem;
            }
            
            .skills-grid {
                grid-template-columns: 1fr;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <div class="profile-image">
                    ${personalInfo.fullName.charAt(0)}
                </div>
                <h1>${personalInfo.fullName}</h1>
                <div class="title">${personalInfo.professionalTitle}</div>
                <div class="bio">${personalInfo.bio}</div>
                <div class="contact-info">
                    <div class="contact-item">📧 ${personalInfo.email}</div>
                    <div class="contact-item">📱 ${personalInfo.phone}</div>
                    <div class="contact-item">📍 ${personalInfo.location}</div>
                    <div class="contact-item">🌐 ${personalInfo.website}</div>
                </div>
            </div>
        </header>

        <main class="main-content">
            <section class="section">
                <h2 class="section-title">Experience</h2>
                <div class="experience-grid">
                    ${experience.map(exp => `
                        <div class="experience-item">
                            <div class="experience-title">${exp.position}</div>
                            <div class="experience-company">${exp.company}</div>
                            <div class="experience-meta">
                                <span>${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
                                <span>${exp.location}</span>
                            </div>
                            <div class="experience-description">${exp.description}</div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Skills & Expertise</h2>
                <div class="skills-grid">
                    ${Object.entries(groupSkillsByCategory(skills)).map(([category, categorySkills]) => `
                        <div class="skill-category">
                            <h3>${category}</h3>
                            ${categorySkills.map(skill => `
                                <div class="skill-item">
                                    <span>${skill.name}</span>
                                    <span class="skill-level level-${skill.level.toLowerCase()}">${skill.level}</span>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Featured Projects</h2>
                <div class="projects-grid">
                    ${projects.map(project => `
                        <div class="project-card">
                            <div class="project-header">
                                <div class="project-title">${project.name}</div>
                            </div>
                            <div class="project-content">
                                <div class="project-description">${project.description}</div>
                                <div class="tech-stack">
                                    ${project.tech.split(',').map(tech => `
                                        <span class="tech-tag">${tech.trim()}</span>
                                    `).join('')}
                                </div>
                                <div class="project-links">
                                    ${project.link ? `<a href="${project.link}" target="_blank" class="project-link">🔗 Live Demo</a>` : ''}
                                    ${project.github ? `<a href="${project.github}" target="_blank" class="project-link">💻 GitHub</a>` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section class="section">
                <h2 class="section-title">Education</h2>
                ${education.map(edu => `
                    <div class="education-item">
                        <div class="education-degree">${edu.degree}</div>
                        <div class="education-school">${edu.school}</div>
                        <div class="education-meta">${edu.year}</div>
                        ${edu.details ? `<div class="education-details">${edu.details}</div>` : ''}
                    </div>
                `).join('')}
            </section>
        </main>
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
                if (!acc[skill.category]) acc[skill.category] = []
                acc[skill.category].push(skill)
                return acc
            }, {})
        }
    </script>
</body>
</html>`
  }

  // Get device dimensions
  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: 375, height: 812 }
      case 'tablet':
        return { width: 768, height: 1024 }
      case 'desktop':
      default:
        return { width: '90%', height: '100%' }
    }
  }

  const dimensions = getPreviewDimensions()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">Portfolio Builder</h1>
            <div className="hidden md:flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              {[
                { mode: 'desktop', icon: Monitor, label: 'Desktop' },
                { mode: 'tablet', icon: Tablet, label: 'Tablet' },
                { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-all flex items-center space-x-2 ${
                    previewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm font-medium'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Builder */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Icon Sidebar */}
        <div className="bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2"
             style={{ width: `${ICON_SIDEBAR_WIDTH}px` }}>
          {formSections.map((section) => {
            const Icon = section.icon
            const isActive = activeForm === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => handleFormSectionClick(section.id)}
                className={`relative w-12 h-12 rounded-xl transition-all duration-200 flex items-center justify-center group ${
                  isActive && formSidebarVisible
                    ? `${section.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={section.title}
              >
                <Icon className="h-5 w-5" />
                {isActive && formSidebarVisible && (
                  <ChevronRight className="absolute -right-1 h-3 w-3 text-white" />
                )}
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  {section.title}
                </div>
              </button>
            )
          })}
        </div>

        {/* Forms Sidebar */}
        <div
          className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-hidden relative ${
            formSidebarVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ width: formSidebarVisible ? `${formSidebarWidth}px` : '0px' }}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {(() => {
                  const section = formSections.find(s => s.id === activeForm)
                  const Icon = section?.icon
                  return (
                    <>
                      {Icon && <Icon className="h-5 w-5 text-gray-600" />}
                      <h2 className="text-lg font-semibold text-gray-900">{section?.title}</h2>
                    </>
                  )
                })()}
              </div>
              <button 
                onClick={() => setFormSidebarVisible(false)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Render the appropriate form component */}
              {activeForm === 'personal' && <PersonalInfoForm />}
              {activeForm === 'experience' && <ExperienceForm />}
              {activeForm === 'education' && <EducationForm />}
              {activeForm === 'skills' && <SkillsForm />}
              {activeForm === 'projects' && <ProjectsForm />}
              {activeForm === 'contact' && <ContactForm />}
            </div>
          </div>

          {/* Resize Handle */}
          {formSidebarVisible && (
            <div
              ref={resizeRef}
              onMouseDown={handleMouseDown}
              className={`absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-500 transition-colors z-10 group ${
                isResizing ? 'bg-blue-500' : ''
              }`}
              title="Drag to resize sidebar"
            >
              <div className="absolute inset-y-0 right-0 w-1 bg-gray-300 group-hover:bg-blue-500 transition-colors" />
            </div>
          )}
        </div>

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-gray-100">
          <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Preview Container */}
              <div
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{
                  width: previewMode === 'desktop' ? '90%' : `${dimensions.width}px`,
                  height: previewMode === 'desktop' ? '90%' : `${dimensions.height}px`,
                  maxWidth: previewMode === 'desktop' ? 'none' : `${dimensions.width}px`,
                  maxHeight: previewMode === 'desktop' ? 'none' : `${dimensions.height}px`,
                  minHeight: previewMode === 'desktop' ? '500px' : 'auto',
                }}
              >
                {/* Device Frame for Mobile/Tablet */}
                {previewMode !== 'desktop' && (
                  <div className="absolute inset-0 pointer-events-none z-10">
                    <div className={`absolute inset-0 border-4 rounded-lg ${
                      previewMode === 'mobile' 
                        ? 'border-gray-800 rounded-3xl' 
                        : 'border-gray-600 rounded-xl'
                    }`} />
                    {previewMode === 'mobile' && (
                      <>
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-700 rounded-full" />
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-700 rounded-full" />
                      </>
                    )}
                  </div>
                )}

                {/* Iframe */}
                <iframe
                  srcDoc={generateHTML()}
                  className="w-full h-full border-0"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  title="Portfolio Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>

              {/* Preview Mode Label */}
              <div className="absolute -top-8 left-0 text-sm text-gray-600 font-medium">
                {previewMode.charAt(0).toUpperCase() + previewMode.slice(1)} Preview
                {previewMode !== 'desktop' && (
                  <span className="ml-2 text-gray-500">
                    {dimensions.width} × {dimensions.height}px
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Preview Footer */}
          <div className="bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Template: {selectedTemplate?.name || 'Modern Professional'}</span>
                <span>Mode: {previewMode}</span>
                {formSidebarVisible && (
                  <span>Sidebar: {formSidebarWidth}px</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">Live Preview Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resize Indicator Overlay */}
        {isResizing && (
          <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white px-6 py-4 rounded-lg shadow-xl">
              <div className="text-xl font-semibold text-gray-900">{formSidebarWidth}px</div>
              <div className="text-sm text-gray-600">Sidebar Width</div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Responsive Handler */}
      <style jsx>{`
        @media (max-width: 768px) {
          .preview-container {
            transform: scale(0.7);
            transform-origin: center top;
          }
        }
      `}</style>
    </div>
  )
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString + '-01').toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  })
}

function groupSkillsByCategory(skills) {
  if (!skills || !Array.isArray(skills)) return {}
  
  return skills.reduce((acc, skill) => {
    const category = skill.category || 'Other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(skill)
    return acc
  }, {})
}

export default EnhancedPortfolioBuilder