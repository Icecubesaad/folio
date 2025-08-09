import { generatePortfolio } from './claude-api'

// Cache for generated portfolios to avoid unnecessary API calls
const portfolioCache = new Map<string, { html: string, timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Debounced generation with improved logic
let currentGenerationPromise: Promise<string> | null = null
let debounceTimeout: NodeJS.Timeout | null = null

export const debouncedGeneratePortfolio = (
  portfolioData: any, 
  template: any, 
  callback: (html: string, isFromCache?: boolean) => void,
  debounceDelay: number = 1500 // Reduced from 2000ms for better UX
) => {
  // Create cache key from essential data
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

  // Set new timeout
  debounceTimeout = setTimeout(async () => {
    try {
      // Avoid duplicate API calls
      if (currentGenerationPromise) {
        const html = await currentGenerationPromise
        callback(html)
        return
      }

      // Start generation
      currentGenerationPromise = generatePortfolioWithRetry(portfolioData, template)
      const html = await currentGenerationPromise
      
      // Cache the result
      portfolioCache.set(cacheKey, { html, timestamp: Date.now() })
      
      callback(html)
    } catch (error) {
      console.error('Portfolio generation failed:', error)
      callback(generateErrorHTML(error), false)
    } finally {
      currentGenerationPromise = null
      debounceTimeout = null
    }
  }, debounceDelay)
}

// Generate cache key from essential portfolio data
const createCacheKey = (portfolioData: any, template: any): string => {
  const essentialData = {
    name: portfolioData.personalInfo?.fullName || '',
    title: portfolioData.personalInfo?.professionalTitle || '',
    email: portfolioData.personalInfo?.email || '',
    bio: portfolioData.personalInfo?.bio || '',
    experienceCount: portfolioData.experience?.length || 0,
    skillsCount: portfolioData.skills?.length || 0,
    projectsCount: portfolioData.projects?.length || 0,
    template: template?.id || 'default'
  }
  
  return btoa(JSON.stringify(essentialData)).slice(0, 32)
}

// Generate portfolio with retry logic
const generatePortfolioWithRetry = async (
  portfolioData: any, 
  template: any, 
  maxRetries: number = 2
): Promise<string> => {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const html = await generatePortfolio(portfolioData, template)
      
      // Validate generated HTML
      if (!isValidHTML(html)) {
        throw new Error('Generated HTML is invalid or incomplete')
      }
      
      return html
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      console.warn(`Portfolio generation attempt ${attempt} failed:`, lastError.message)
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // Wait before retry with exponential backoff
      await new Promise(resolve => setTimeout(resolve, attempt * 1000))
    }
  }
  
  throw lastError!
}

// Validate HTML structure
const isValidHTML = (html: string): boolean => {
  if (!html || typeof html !== 'string') return false
  
  const requiredTags = ['<html', '</html>', '<head', '</head>', '<body', '</body>']
  return requiredTags.every(tag => html.includes(tag))
}

// Generate error HTML for failed generations
const generateErrorHTML = (error: any): string => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Generation Error</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .error-container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 60px 40px;
            max-width: 500px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .error-icon {
            font-size: 64px;
            margin-bottom: 24px;
            opacity: 0.8;
        }
        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        p {
            font-size: 16px;
            line-height: 1.6;
            opacity: 0.9;
            margin-bottom: 32px;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 32px;
            border-radius: 50px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">⚡</div>
        <h1>Generation in Progress</h1>
        <p>Your portfolio is being generated. This may take a moment as we craft the perfect design for you.</p>
        <button class="retry-btn" onclick="window.parent.location.reload()">
            Refresh Page
        </button>
    </div>
</body>
</html>`
}

// Clear cache periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of portfolioCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      portfolioCache.delete(key)
    }
  }
}, CACHE_DURATION)

// Generate immediate preview for instant feedback
export const generateQuickPreview = (portfolioData: any, template: any): string => {
  const name = portfolioData.personalInfo?.fullName || 'Your Name'
  const title = portfolioData.personalInfo?.professionalTitle || 'Professional Title'
  const bio = portfolioData.personalInfo?.bio || 'Add your bio to see it here...'
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio Preview</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        .preview-banner {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-align: center;
            padding: 12px;
            font-size: 14px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .hero {
            text-align: center;
            padding: 80px 0;
            background: white;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 40px;
        }
        .hero h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 16px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .hero p {
            font-size: 1.25rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
        }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .hero p { font-size: 1rem; }
        }
    </style>
</head>
<body>
    <div class="preview-banner">
        🚧 Quick Preview - Full portfolio generating...
    </div>
    <div class="container">
        <div class="hero">
            <h1>${name}</h1>
            <p>${title}</p>
            <br>
            <p style="font-size: 1rem; opacity: 0.8;">${bio}</p>
        </div>
    </div>
</body>
</html>`
}