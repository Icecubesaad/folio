import { generatePortfolio } from './claude-api'

// Enhanced cache with better key generation and cleanup
const portfolioCache = new Map<string, { 
  html: string
  timestamp: number
  templateId: string
  dataHash: string
}>()
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
const MAX_CACHE_SIZE = 50

// Active generation tracking
let currentGenerationPromise: Promise<string> | null = null
let debounceTimeout: NodeJS.Timeout | null = null
let generationQueue: Array<() => void> = []

// Create comprehensive hash from portfolio data
const createDataHash = (portfolioData: any): string => {
  const essentialData = {
    // Personal info
    name: portfolioData.personalInfo?.fullName || '',
    title: portfolioData.personalInfo?.professionalTitle || '',
    email: portfolioData.personalInfo?.email || '',
    phone: portfolioData.personalInfo?.phone || '',
    location: portfolioData.personalInfo?.location || '',
    bio: portfolioData.personalInfo?.bio || '',
    
    // Experience
    experience: portfolioData.experience?.map((exp: any) => ({
      company: exp.company || '',
      role: exp.role || '',
      duration: exp.duration || '',
      description: exp.description || '',
      current: exp.current || false
    })) || [],
    
    // Projects
    projects: portfolioData.projects?.map((proj: any) => ({
      name: proj.name || '',
      description: proj.description || '',
      tech: proj.tech || '',
      link: proj.link || '',
      github: proj.github || ''
    })) || [],
    
    // Skills
    skills: portfolioData.skills?.map((skill: any) => ({
      category: skill.category || '',
      items: skill.items || [],
      proficiency: skill.proficiency || 0
    })) || [],
    
    // Education
    education: portfolioData.education?.map((edu: any) => ({
      school: edu.school || '',
      degree: edu.degree || '',
      year: edu.year || '',
      details: edu.details || ''
    })) || []
  }
  
  // Create hash from stringified data
  return btoa(JSON.stringify(essentialData))
    .replace(/[+/=]/g, '') // Remove special chars
    .slice(0, 32) // Limit length
}

// Create cache key
const createCacheKey = (portfolioData: any, template: any): string => {
  const dataHash = createDataHash(portfolioData)
  const templateId = template?.id || 'default'
  return `${templateId}_${dataHash}`
}

// Cleanup old cache entries
const cleanupCache = () => {
  const now = Date.now()
  const entries = Array.from(portfolioCache.entries())
  
  // Remove expired entries
  entries.forEach(([key, value]) => {
    if (now - value.timestamp > CACHE_DURATION) {
      portfolioCache.delete(key)
    }
  })
  
  // Remove oldest entries if cache is too large
  if (portfolioCache.size > MAX_CACHE_SIZE) {
    const sortedEntries = entries
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
      .slice(0, portfolioCache.size - MAX_CACHE_SIZE)
    
    sortedEntries.forEach(([key]) => portfolioCache.delete(key))
  }
}

// Enhanced validation
const isValidPortfolioData = (portfolioData: any): boolean => {
  return !!(
    portfolioData?.personalInfo?.fullName?.trim() &&
    portfolioData?.personalInfo?.email?.trim() &&
    portfolioData?.personalInfo?.professionalTitle?.trim()
  )
}

const isValidHTML = (html: string): boolean => {
  if (!html || typeof html !== 'string') return false
  
  // Check for required HTML structure
  const requiredTags = ['<html', '</html>', '<head', '</head>', '<body', '</body>']
  const hasRequiredTags = requiredTags.every(tag => html.includes(tag))
  
  // Check for basic content
  const hasContent = html.length > 500 // Minimum reasonable HTML size
  
  // Check for common error patterns
  const hasErrors = html.includes('Error generating') || 
                   html.includes('<!DOCTYPE html><html><head><title>Error') ||
                   html.includes('Portfolio generation failed')
  
  return hasRequiredTags && hasContent && !hasErrors
}

// Main debounced generation function
export const debouncedGeneratePortfolio = async (
  portfolioData: any, 
  template: any, 
  callback: (html: string, isFromCache?: boolean) => void,
  debounceDelay: number = 1000
) => {
  // Validate data first
  if (!isValidPortfolioData(portfolioData)) {
    callback(generateQuickPreview(portfolioData, template), false)
    return
  }

  // Create cache key
  const cacheKey = createCacheKey(portfolioData, template)
  
  // Check cache first
  const cached = portfolioCache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    callback(cached.html, true)
    return
  }

  // Clear existing timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  // Add to generation queue
  const queueItem = () => generatePortfolioInternal(portfolioData, template, callback, cacheKey)
  
  // Set new timeout
  debounceTimeout = setTimeout(async () => {
    try {
      cleanupCache() // Cleanup before generating
      await queueItem()
    } catch (error) {
      console.error('Portfolio generation failed:', error)
      callback(generateErrorHTML(error, portfolioData), false)
    } finally {
      debounceTimeout = null
    }
  }, debounceDelay)
}

// Internal generation with queue management
const generatePortfolioInternal = async (
  portfolioData: any,
  template: any,
  callback: (html: string, isFromCache?: boolean) => void,
  cacheKey: string
) => {
  // If already generating, wait for current generation
  if (currentGenerationPromise) {
    try {
      const html = await currentGenerationPromise
      callback(html, false)
      return
    } catch (error) {
      // Continue with new generation if current one failed
    }
  }

  // Start new generation
  currentGenerationPromise = generatePortfolioWithRetry(portfolioData, template, 3)
  
  try {
    const html = await currentGenerationPromise
    
    // Validate generated HTML
    if (!isValidHTML(html)) {
      throw new Error('Generated HTML is invalid or incomplete')
    }
    
    // Cache the result
    portfolioCache.set(cacheKey, {
      html,
      timestamp: Date.now(),
      templateId: template?.id || 'default',
      dataHash: createDataHash(portfolioData)
    })
    
    callback(html, false)
  } catch (error) {
    console.error('Portfolio generation failed:', error)
    callback(generateErrorHTML(error, portfolioData), false)
  } finally {
    currentGenerationPromise = null
  }
}

// Generate portfolio with retry logic and exponential backoff
const generatePortfolioWithRetry = async (
  portfolioData: any, 
  template: any, 
  maxRetries: number = 3
): Promise<string> => {
  let lastError: Error
  const baseDelay = 1000 // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Portfolio generation attempt ${attempt}/${maxRetries}`)
      
      const html = await generatePortfolio(portfolioData, template)
      
      // Validate generated HTML
      if (!isValidHTML(html)) {
        throw new Error(`Generated HTML is invalid (attempt ${attempt})`)
      }
      
      console.log('Portfolio generation successful')
      return html
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      console.warn(`Portfolio generation attempt ${attempt} failed:`, lastError.message)
      
      if (attempt === maxRetries) {
        throw new Error(`Portfolio generation failed after ${maxRetries} attempts: ${lastError.message}`)
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError!
}

// Generate quick preview for immediate feedback
export const generateQuickPreview = (portfolioData: any, template: any): string => {
  const name = portfolioData.personalInfo?.fullName || 'Your Name'
  const title = portfolioData.personalInfo?.professionalTitle || 'Professional Title'
  const bio = portfolioData.personalInfo?.bio || 'Add your professional bio to see it here...'
  const email = portfolioData.personalInfo?.email || 'your.email@example.com'
  const location = portfolioData.personalInfo?.location || 'Your Location'
  
  // Get template-specific styling
  const templateStyle = getQuickPreviewStyle(template?.id || 'modern-minimal')
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio Preview</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background: ${templateStyle.background};
            min-height: 100vh;
        }
        
        .preview-banner {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
            padding: 8px 16px;
            font-size: 12px;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .hero {
            text-align: center;
            padding: 4rem 2rem;
            background: ${templateStyle.cardBackground};
            border-radius: ${templateStyle.borderRadius};
            box-shadow: ${templateStyle.shadow};
            margin-bottom: 2rem;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: ${templateStyle.accent};
        }
        
        .hero h1 {
            font-size: clamp(2rem, 5vw, 3.5rem);
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: ${templateStyle.titleGradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero .subtitle {
            font-size: clamp(1rem, 3vw, 1.5rem);
            color: ${templateStyle.accent};
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .hero .bio {
            font-size: 1.1rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto 2rem;
            line-height: 1.7;
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
            color: #666;
            font-size: 0.9rem;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 3rem;
        }
        
        .stat-card {
            background: ${templateStyle.cardBackground};
            padding: 1.5rem;
            border-radius: ${templateStyle.borderRadius};
            box-shadow: ${templateStyle.shadow};
            text-align: center;
            border: 1px solid #e5e7eb;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .stat-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: ${templateStyle.accent};
            display: block;
        }
        
        .stat-label {
            color: #666;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
        
        .loading-pulse {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        @media (max-width: 768px) {
            .container { padding: 1rem; }
            .hero { padding: 2rem 1rem; }
            .contact-info { 
                flex-direction: column; 
                align-items: center; 
                gap: 1rem; 
            }
            .stats-grid { 
                grid-template-columns: 1fr; 
                gap: 1rem; 
            }
        }
    </style>
</head>
<body>
    <div class="preview-banner">
        ⚡ Live Preview - Your portfolio is being generated by Claude...
    </div>
    
    <div class="container">
        <div class="hero loading-pulse">
            <h1>${name}</h1>
            <div class="subtitle">${title}</div>
            <p class="bio">${bio}</p>
            
            <div class="contact-info">
                <div class="contact-item">
                    <span>📧</span>
                    <span>${email}</span>
                </div>
                ${location !== 'Your Location' ? `
                <div class="contact-item">
                    <span>📍</span>
                    <span>${location}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <span class="stat-number">${portfolioData.experience?.length || 0}</span>
                <div class="stat-label">Years Experience</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${portfolioData.projects?.length || 0}</span>
                <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${portfolioData.skills?.length || 0}</span>
                <div class="stat-label">Skill Categories</div>
            </div>
            <div class="stat-card">
                <span class="stat-number">${portfolioData.education?.length || 0}</span>
                <div class="stat-label">Education</div>
            </div>
        </div>
    </div>
</body>
</html>`
}

// Get template-specific quick preview styles
const getQuickPreviewStyle = (templateId: string) => {
  const styles = {
    'modern-minimal': {
      background: '#f8fafc',
      cardBackground: 'white',
      accent: '#3b82f6',
      titleGradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      borderRadius: '12px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    'creative-portfolio': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      accent: '#8b5cf6',
      titleGradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
      borderRadius: '20px',
      shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },
    'professional-corporate': {
      background: '#f1f5f9',
      cardBackground: 'white',
      accent: '#1e40af',
      titleGradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
      borderRadius: '8px',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    'developer-showcase': {
      background: '#0f172a',
      cardBackground: '#1e293b',
      accent: '#10b981',
      titleGradient: 'linear-gradient(135deg, #10b981, #059669)',
      borderRadius: '10px',
      shadow: '0 8px 25px rgba(0, 0, 0, 0.3)'
    }
  }
  
  return styles[templateId as keyof typeof styles] || styles['modern-minimal']
}

// Generate sophisticated error HTML
const generateErrorHTML = (error: any, portfolioData: any): string => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  const name = portfolioData?.personalInfo?.fullName || 'User'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Generation - ${name}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 3rem 2rem;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 1.5rem;
            opacity: 0.8;
            animation: pulse 2s infinite;
        }
        h1 {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        p {
            font-size: 1rem;
            line-height: 1.6;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        .error-details {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 1rem;
            margin: 1rem 0;
            font-size: 0.875rem;
            text-align: left;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">⚡</div>
        <h1>Portfolio Generating</h1>
        <p>
            Hi ${name}! Your portfolio is being crafted by Claude AI. 
            This process may take a moment as we create something truly unique for you.
        </p>
        <div class="error-details">
            Status: Processing your information...<br>
            Template: ${portfolioData?.template?.name || 'Custom Design'}<br>
            Please wait while we generate your portfolio.
        </div>
        <button class="retry-btn" onclick="window.parent.location.reload()">
            Refresh Preview
        </button>
    </div>
</body>
</html>`
}

// Force clear cache
export const clearPortfolioCache = () => {
  portfolioCache.clear()
  console.log('Portfolio cache cleared')
}

// Get cache stats for debugging
export const getCacheStats = () => {
  return {
    size: portfolioCache.size,
    maxSize: MAX_CACHE_SIZE,
    entries: Array.from(portfolioCache.entries()).map(([key, value]) => ({
      key,
      templateId: value.templateId,
      age: Date.now() - value.timestamp,
      isExpired: Date.now() - value.timestamp > CACHE_DURATION
    }))
  }
}

// Periodic cache cleanup
setInterval(cleanupCache, 5 * 60 * 1000) // Every 5 minutes