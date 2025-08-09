import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

// Improved HTML parsing with better CSS/JS extraction
const extractAssetsFromHTML = (html: string) => {
  // Extract CSS from style tags
  const cssMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []
  const extractedCSS = cssMatches
    .map(match => match.replace(/<\/?style[^>]*>/gi, ''))
    .join('\n\n')
    .trim()

  // Extract JavaScript from script tags (excluding external scripts)
  const jsMatches = html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi) || []
  const extractedJS = jsMatches
    .map(match => match.replace(/<\/?script[^>]*>/gi, ''))
    .join('\n\n')
    .trim()

  // Clean HTML by replacing style/script tags with links
  let cleanHTML = html
  
  // Replace style tags with CSS link if we extracted CSS
  if (extractedCSS) {
    cleanHTML = cleanHTML.replace(
      /<style[^>]*>[\s\S]*?<\/style>/gi,
      '<link rel="stylesheet" href="styles.css">'
    )
  }

  // Replace inline script tags with JS link if we extracted JS
  if (extractedJS) {
    cleanHTML = cleanHTML.replace(
      /<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi,
      '<script src="script.js"></script>'
    )
  }

  // Add meta tags for better SEO and mobile responsiveness if missing
  if (!cleanHTML.includes('viewport')) {
    cleanHTML = cleanHTML.replace(
      '<head>',
      '<head>\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">'
    )
  }

  return {
    html: cleanHTML,
    css: extractedCSS,
    js: extractedJS
  }
}

// Generate comprehensive README
const generateREADME = (portfolioData: any, template: any) => {
  const name = portfolioData.personalInfo?.fullName || 'Portfolio Owner'
  const templateName = template?.name || 'Default Template'
  
  return `# ${name} - Personal Portfolio

This portfolio was generated using PortfolioBuilder AI with the "${templateName}" template.

## 📁 Files Included

- **index.html** - Main portfolio webpage
- **styles.css** - Stylesheet with responsive design
- **script.js** - Interactive functionality and animations
- **README.md** - This documentation file

## 🚀 Getting Started

### Option 1: Simple Hosting
1. Upload all files to your web hosting service
2. Ensure \`index.html\` is in the root directory
3. Access your portfolio via your domain

### Option 2: GitHub Pages
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your portfolio will be available at: \`https://yourusername.github.io/repository-name\`

### Option 3: Netlify (Recommended)
1. Drag and drop this folder to [Netlify Drop](https://app.netlify.com/drop)
2. Get an instant live URL
3. Optional: Connect to GitHub for automatic deployments

## 🎨 Customization

### Updating Content
- Edit the HTML content in \`index.html\`
- Modify styles in \`styles.css\`
- Add interactive features in \`script.js\`

### Colors and Fonts
- Main color variables are defined at the top of \`styles.css\`
- Font selections can be changed in the CSS \`:root\` section

### Adding New Sections
- Copy the structure of existing sections in \`index.html\`
- Add corresponding styles in \`styles.css\`
- Include any JavaScript interactions in \`script.js\`

## 📱 Features

✅ Fully responsive design (mobile, tablet, desktop)
✅ Modern CSS animations and transitions
✅ Interactive contact form with validation
✅ Smooth scrolling navigation
✅ Optimized performance
✅ SEO-friendly structure
✅ Cross-browser compatible

## 🛠️ Technical Details

- **Framework**: Vanilla HTML, CSS, JavaScript (no dependencies)
- **CSS**: Modern CSS3 with Flexbox/Grid layouts
- **JavaScript**: ES6+ with progressive enhancement
- **Performance**: Optimized images and minified code
- **Compatibility**: Works in all modern browsers

## 📞 Support

Need help customizing your portfolio? 
- Check the comments in the code files
- Search for tutorials on HTML/CSS customization
- Consider hiring a web developer for major changes

---

*Generated with ❤️ by PortfolioBuilder AI*
*Template: ${templateName}*
*Generated on: ${new Date().toLocaleDateString()}*`
}

// Generate a deployment guide
const generateDeploymentGuide = () => {
  return `# 🚀 Portfolio Deployment Guide

## Quick Deployment Options

### 1. Netlify (Easiest - Recommended)
1. Go to [netlify.com](https://netlify.com)
2. Drag your portfolio folder to the deployment area
3. Get instant live URL
4. Free custom domain available

### 2. GitHub Pages (Free)
1. Create GitHub account
2. Create new repository
3. Upload files
4. Enable GitHub Pages in settings
5. Access at: yourusername.github.io/repo-name

### 3. Vercel (Developer-Friendly)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Automatic deployments on every change
4. Lightning-fast global CDN

### 4. Traditional Web Hosting
1. Purchase hosting from providers like:
   - Bluehost, HostGator, SiteGround
   - Upload files via FTP/File Manager
   - Point domain to hosting

## Domain Setup

### Free Subdomains
- yourname.netlify.app
- yourname.github.io
- yourname.vercel.app

### Custom Domain (Recommended)
1. Purchase from: Namecheap, GoDaddy, Google Domains
2. Point DNS to your hosting provider
3. Enable HTTPS (usually automatic)

## SEO Optimization

After deployment:
1. Submit to Google Search Console
2. Add Google Analytics
3. Create sitemap.xml
4. Optimize images
5. Test mobile-friendliness

## Performance Tips

- Enable compression (Gzip)
- Use CDN for assets
- Optimize images (WebP format)
- Minify CSS/JS if needed
- Test with PageSpeed Insights

## Security Best Practices

- Always use HTTPS
- Keep contact forms secure
- Regular security scans
- Backup your files regularly

## Analytics Setup

### Google Analytics
1. Create account at analytics.google.com
2. Add tracking code to your HTML
3. Monitor visitor behavior

### Simple Analytics Alternatives
- Plausible Analytics
- Fathom Analytics
- Simple Analytics

## Content Management

### Regular Updates
- Keep projects section current
- Update skills as you learn
- Add new work experience
- Refresh testimonials

### SEO Content Tips
- Use relevant keywords naturally
- Write compelling meta descriptions
- Include alt text for images
- Create quality, original content

## Troubleshooting

### Common Issues
- **Site not loading**: Check file paths and names
- **Mobile display issues**: Test responsive design
- **Contact form not working**: Check form processing
- **Slow loading**: Optimize images and code

### Getting Help
- Check hosting provider documentation
- Search for specific error messages
- Consider hiring a web developer
- Join web development communities

---

*Need more help? Most hosting providers offer 24/7 support!*

## Advanced Features (Optional)

### Adding a Blog
1. Consider static site generators (Jekyll, Hugo)
2. Or use headless CMS (Contentful, Strapi)
3. Integrate with your existing portfolio

### E-commerce Integration
- Add Stripe for service payments
- PayPal integration for consultations
- Gumroad for digital products

### Advanced Analytics
- Heat mapping (Hotjar, Crazy Egg)
- A/B testing tools
- Conversion tracking

## Maintenance Schedule

### Weekly
- Check for broken links
- Review contact form submissions
- Monitor site performance

### Monthly
- Update portfolio content
- Check analytics reports
- Security scan

### Quarterly
- Redesign review
- SEO audit
- Backup verification

Good luck with your portfolio deployment! 🎉`
}

// Generate a performance optimization guide
const generatePerformanceGuide = () => {
  return `# ⚡ Portfolio Performance Optimization Guide

## Image Optimization

### Best Practices
- Use WebP format when possible
- Compress images (TinyPNG, ImageOptim)
- Implement lazy loading
- Use appropriate image sizes
- Add proper alt attributes

### Code Example
\`\`\`html
<img src="image.webp" 
     alt="Project screenshot" 
     loading="lazy"
     width="800" 
     height="600">
\`\`\`

## CSS Optimization

### Techniques
- Remove unused CSS
- Minify CSS files
- Use CSS Grid/Flexbox efficiently
- Avoid excessive animations
- Implement critical CSS

### Tools
- PurgeCSS for unused styles
- CSSNano for minification
- Chrome DevTools Coverage tab

## JavaScript Optimization

### Best Practices
- Minimize JavaScript usage
- Use modern ES6+ features
- Implement code splitting
- Defer non-critical scripts
- Remove console.log statements

## Loading Performance

### Core Web Vitals
- **LCP**: Largest Contentful Paint < 2.5s
- **FID**: First Input Delay < 100ms
- **CLS**: Cumulative Layout Shift < 0.1

### Improvement Strategies
- Optimize above-the-fold content
- Use resource hints (preload, prefetch)
- Minimize render-blocking resources
- Implement service workers for caching

## Accessibility Optimization

### Essential Checks
- Color contrast ratios
- Keyboard navigation
- Screen reader compatibility
- Focus indicators
- ARIA labels where needed

## SEO Performance

### Technical SEO
- Semantic HTML structure
- Meta tags optimization
- Schema markup
- XML sitemap
- Internal linking

### Content SEO
- Relevant keywords
- Quality content
- Regular updates
- Local SEO (if applicable)

## Monitoring Tools

### Free Tools
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)

### Performance Budgets
Set limits for:
- Page load time: < 3 seconds
- Page size: < 1MB
- Number of requests: < 50
- Time to interactive: < 5 seconds

Remember: Performance is an ongoing process, not a one-time optimization!`
}

// Generate security guide
const generateSecurityGuide = () => {
  return `# 🔒 Portfolio Security Guide

## Basic Security Measures

### HTTPS
- Always use SSL/TLS certificates
- Most hosting providers offer free SSL
- Redirect HTTP to HTTPS automatically

### Contact Form Security
- Validate all inputs
- Use CAPTCHA for spam prevention
- Sanitize user data
- Implement rate limiting

## Content Security

### Protect Your Work
- Watermark images when necessary
- Use copyright notices
- Consider disabling right-click (limited effectiveness)
- Monitor for content theft

### Backup Strategy
- Regular automated backups
- Store backups in multiple locations
- Test backup restoration process
- Version control with Git

## Privacy Considerations

### GDPR Compliance (if applicable)
- Privacy policy
- Cookie consent
- Data processing transparency
- User data rights

### Analytics Privacy
- Use privacy-focused analytics
- Anonymize IP addresses
- Inform users about tracking

## Hosting Security

### Best Practices
- Keep software updated
- Use strong passwords
- Enable two-factor authentication
- Regular security scans
- Monitor access logs

### Hosting Provider Features
- Choose providers with:
  - DDoS protection
  - Malware scanning
  - Regular security updates
  - SSL certificates included

## Emergency Response

### If Your Site is Compromised
1. Change all passwords immediately
2. Scan for malware
3. Restore from clean backup
4. Update all software
5. Review access logs
6. Implement additional security measures

### Prevention is Key
- Regular updates
- Strong authentication
- Monitoring and alerts
- Security-focused hosting
- Regular backups

Stay secure! 🛡️`
}

export async function POST(request: NextRequest) {
  try {
    const { portfolioData, template } = await request.json()
    
    // Validate input data
    if (!portfolioData?.personalInfo?.fullName) {
      return NextResponse.json({
        error: 'Missing required portfolio data',
        success: false
      }, { status: 400 })
    }

    // Generate portfolio HTML using Claude API
    const baseUrl = process.env.NEXTAUTH_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000'
                   
    const claudeResponse = await fetch(`${baseUrl}/api/claude`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'PortfolioBuilder/1.0',
        // Add authorization if needed
        ...(process.env.INTERNAL_API_KEY && {
          'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`
        })
      },
      body: JSON.stringify({ portfolioData, template })
    })
    
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      throw new Error(`Claude API failed (${claudeResponse.status}): ${errorText}`)
    }
    
    const { html, success } = await claudeResponse.json()
    
    if (!success || !html) {
      throw new Error('Failed to generate portfolio HTML')
    }

    // Extract and optimize assets
    const { html: cleanHTML, css, js } = extractAssetsFromHTML(html)
    
    // Generate safe file names
    const fileName = portfolioData.personalInfo.fullName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .substring(0, 50) // Limit length
    
    const safeFileName = fileName || 'portfolio'
    const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
    
    // Create ZIP file with organized structure
    const zip = new JSZip()
    
    // Main files
    zip.file('index.html', cleanHTML)
    
    if (css) {
      const cssHeader = `/*
 * ${portfolioData.personalInfo.fullName} - Portfolio Styles
 * Generated by PortfolioBuilder AI
 * Template: ${template?.name || 'Default'}
 * Generated on: ${new Date().toLocaleDateString()}
 * 
 * This file contains all the styles for your portfolio.
 * Feel free to customize colors, fonts, and layouts to match your style!
 */\n\n`
      
      zip.file('styles.css', cssHeader + css)
    }
    
    if (js) {
      const jsHeader = `/*
 * ${portfolioData.personalInfo.fullName} - Portfolio Scripts
 * Generated by PortfolioBuilder AI
 * 
 * This file contains interactive functionality for your portfolio.
 * Includes form validation, smooth scrolling, and animations.
 */\n\n`
      
      zip.file('script.js', jsHeader + js)
    }
    
    // Documentation files
    zip.file('README.md', generateREADME(portfolioData, template))
    zip.file('DEPLOYMENT.md', generateDeploymentGuide())
    zip.file('PERFORMANCE.md', generatePerformanceGuide())
    zip.file('SECURITY.md', generateSecurityGuide())
    
    // Configuration files
    zip.file('package.json', JSON.stringify({
      name: `${safeFileName}-portfolio`,
      version: "1.0.0",
      description: `Personal portfolio website for ${portfolioData.personalInfo.fullName}`,
      main: "index.html",
      homepage: ".",
      scripts: {
        start: "npx serve . -s",
        build: "echo 'Static site - no build needed'",
        deploy: "echo 'See DEPLOYMENT.md for deployment instructions'",
        validate: "npx html-validate index.html",
        optimize: "npx imagemin-cli images/* --out-dir=images"
      },
      keywords: [
        "portfolio", 
        "personal-website",
        portfolioData.personalInfo.professionalTitle?.toLowerCase().replace(/\s+/g, '-'),
        "responsive-design"
      ].filter(Boolean),
      author: {
        name: portfolioData.personalInfo.fullName,
        email: portfolioData.personalInfo.email,
        url: portfolioData.socialLinks?.website || portfolioData.socialLinks?.linkedin
      },
      license: "MIT",
      repository: {
        type: "git",
        url: "git+https://github.com/yourusername/your-portfolio.git"
      },
      bugs: {
        url: "https://github.com/yourusername/your-portfolio/issues"
      },
      devDependencies: {
        serve: "^14.0.0",
        "html-validate": "^8.0.0",
        "imagemin-cli": "^8.0.0"
      }
    }, null, 2))
    
    // .gitignore file for version control
    zip.file('.gitignore', `# Dependencies
node_modules/

# Logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Editor files
.vscode/
.idea/
*.swp
*.swo

# Temporary files
tmp/
temp/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local`)

    // Netlify configuration
    zip.file('netlify.toml', `[build]
  publish = "."
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    
[[headers]]
  for = "*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600"
    
[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
    
[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"`)

    // Vercel configuration
    zip.file('vercel.json', JSON.stringify({
      version: 2,
      builds: [
        {
          src: "**/*",
          use: "@vercel/static"
        }
      ],
      headers: [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY"
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block"
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff"
            }
          ]
        }
      ]
    }, null, 2))

    // Generate optimized ZIP with metadata
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { 
        level: 9 // Maximum compression
      },
      comment: `
Portfolio for ${portfolioData.personalInfo.fullName}
Generated by PortfolioBuilder AI on ${new Date().toLocaleDateString()}
Template: ${template?.name || 'Default'}
Files: HTML, CSS, JS, Documentation, Configuration
Ready for deployment to any hosting platform
      `.trim()
    })
    
    // Generate comprehensive filename with timestamp
    const downloadFileName = `${safeFileName}-portfolio-${timestamp}.zip`
    
    // Return ZIP file with comprehensive headers
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${downloadFileName}"`,
        'Content-Length': zipBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        
        // Custom headers for tracking
        'X-Portfolio-Generated': 'PortfolioBuilder-AI',
        'X-Template-Used': template?.name || 'Default',
        'X-Generation-Date': new Date().toISOString(),
        'X-Portfolio-Owner': portfolioData.personalInfo.fullName,
        'X-File-Count': Object.keys(zip.files).length.toString()
      }
    })

  } catch (error) {
    console.error('Portfolio download error:', error)
    
    // Enhanced error reporting with context
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      operation: 'portfolio-download',
      ...(process.env.NODE_ENV === 'development' && {
        stack: (error as Error)?.stack,
        details: error
      })
    }
    
    // Log error for monitoring (in production, send to error tracking service)
    if (process.env.NODE_ENV === 'production') {
      // Example: await errorTrackingService.captureException(error, errorDetails)
      console.error('Production error:', errorDetails)
    }
    
    return NextResponse.json({
      error: 'Failed to generate portfolio download',
      message: 'We encountered an issue while preparing your portfolio files. Please try again.',
      details: process.env.NODE_ENV === 'development' ? errorDetails.message : undefined,
      success: false,
      timestamp: errorDetails.timestamp
    }, { 
      status: 500,
      headers: {
        'X-Error-Type': 'portfolio-generation-failed',
        'X-Error-Timestamp': errorDetails.timestamp
      }
    })
  }
}