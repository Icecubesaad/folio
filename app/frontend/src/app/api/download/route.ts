import { NextRequest, NextResponse } from 'next/server'
import JSZip from 'jszip'

export async function POST(request: NextRequest) {
  try {
    const { portfolioData, template } = await request.json()
    
    // Generate portfolio HTML using Claude
    const claudeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/claude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolioData, template })
    })
    
    const { html } = await claudeResponse.json()
    
    // Extract CSS and JS from HTML (basic extraction)
    const cssMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
    const jsMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi)
    
    const css = cssMatch ? cssMatch.map(match => 
      match.replace(/<\/?style[^>]*>/gi, '')
    ).join('\n') : ''
    
    const js = jsMatch ? jsMatch.map(match => 
      match.replace(/<\/?script[^>]*>/gi, '')
    ).join('\n') : ''
    
    // Clean HTML (remove style and script tags)
    const cleanHtml = html
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<link rel="stylesheet" href="styles.css">')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script src="script.js"></script>')
    
    // Create ZIP file
    const zip = new JSZip()
    
    // Add files to ZIP
    zip.file('index.html', cleanHtml)
    zip.file('styles.css', css)
    zip.file('script.js', js)
    zip.file('README.md', `# ${portfolioData.personalInfo?.fullName || 'Portfolio'} - Portfolio Website

Generated with PortfolioBuilder AI

## Files Included:
- index.html - Main portfolio page
- styles.css - Stylesheet 
- script.js - JavaScript functionality

## Deployment:
1. Upload all files to your web hosting
2. Access via index.html
3. Customize as needed

Built with ❤️ using PortfolioBuilder
`)

    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' })
    
    // Return ZIP file
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${portfolioData.personalInfo?.fullName?.replace(/\s+/g, '-').toLowerCase() || 'portfolio'}-portfolio.zip"`
      }
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to generate download', success: false },
      { status: 500 }
    )
  }
}