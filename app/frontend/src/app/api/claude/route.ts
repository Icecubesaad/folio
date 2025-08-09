import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Template-specific prompts for better results
const TEMPLATE_PROMPTS = {
  'modern-minimal': `
    Create a modern, minimal portfolio with:
    - Clean typography (Inter/San Francisco fonts)
    - Subtle shadows and borders
    - Plenty of whitespace
    - Neutral color palette (grays, whites, one accent color)
    - Grid-based layouts
    - Smooth micro-animations
  `,
  'creative-portfolio': `
    Create a creative, artistic portfolio with:
    - Bold typography mixing serif and sans-serif
    - Vibrant color gradients
    - Creative layouts and asymmetry
    - Interactive hover effects
    - CSS animations and transforms
    - Artistic visual elements
  `,
  'professional-corporate': `
    Create a professional, corporate portfolio with:
    - Conservative, readable fonts
    - Professional color scheme (blues, grays)
    - Structured, formal layouts
    - Business-appropriate styling
    - Clear hierarchy and sections
    - Minimal but elegant interactions
  `,
  'developer-showcase': `
    Create a developer-focused portfolio with:
    - Monospace fonts for code sections
    - Dark/light theme toggle
    - Tech-inspired design elements
    - Syntax highlighting styles
    - GitHub-style cards and components
    - Terminal/code aesthetic touches
  `
}

const BASE_SYSTEM_PROMPT = `You are a world-class web developer creating stunning, professional portfolios. 
Create a complete, responsive HTML file with embedded CSS and JavaScript that works perfectly on all devices.

Requirements:
1. Single HTML file with embedded <style> and <script> tags
2. Modern, responsive design (mobile-first)
3. Smooth animations and professional interactions
4. Perfect typography and spacing
5. Semantic HTML structure
6. Accessible design (proper contrast, alt texts, ARIA labels)
7. Working contact form (frontend validation)
8. No external dependencies or CDN links
9. Optimized performance (efficient CSS, minimal JS)
10. Cross-browser compatibility

Return ONLY the complete HTML code with no explanations or markdown formatting.`

export async function POST(request: NextRequest) {
  try {
    const { portfolioData, template } = await request.json()

    // Validate required data
    if (!portfolioData?.personalInfo?.fullName) {
      return NextResponse.json({
        error: 'Missing required personal information',
        success: false
      }, { status: 400 })
    }

    // Get template-specific styling
    const templatePrompt = TEMPLATE_PROMPTS[template?.id as keyof typeof TEMPLATE_PROMPTS] || TEMPLATE_PROMPTS['modern-minimal']

    // Build comprehensive prompt
    const prompt = `${BASE_SYSTEM_PROMPT}

${templatePrompt}

PERSONAL INFORMATION:
- Full Name: ${portfolioData.personalInfo.fullName}
- Professional Title: ${portfolioData.personalInfo.professionalTitle || 'Professional'}
- Email: ${portfolioData.personalInfo.email || ''}
- Phone: ${portfolioData.personalInfo.phone || ''}
- Location: ${portfolioData.personalInfo.location || ''}
- Bio: ${portfolioData.personalInfo.bio || 'Passionate professional with expertise in various domains.'}

WORK EXPERIENCE:
${portfolioData.experience?.length ? 
  portfolioData.experience.map((exp: any) => 
    `• ${exp.role} at ${exp.company} (${exp.duration})\n  ${exp.description || 'Key contributor to team success.'}`
  ).join('\n') : 
  '• No work experience provided - create a placeholder section encouraging users to add their experience.'
}

SKILLS & EXPERTISE:
${portfolioData.skills?.length ? 
  portfolioData.skills.map((skillGroup: any) => 
    `${skillGroup.category}: ${skillGroup.items?.join(', ') || 'Various skills'}`
  ).join('\n') : 
  'Technical Skills: HTML, CSS, JavaScript\nSoft Skills: Communication, Problem Solving, Teamwork'
}

PROJECTS:
${portfolioData.projects?.length ? 
  portfolioData.projects.map((project: any) => 
    `• ${project.name}\n  Description: ${project.description || 'Innovative project showcasing technical skills.'}\n  Technologies: ${project.tech || 'Modern web technologies'}\n  ${project.link ? `Live: ${project.link}` : ''}\n  ${project.github ? `Code: ${project.github}` : ''}`
  ).join('\n') : 
  '• Portfolio Website\n  Description: Personal portfolio showcasing skills and experience\n  Technologies: HTML, CSS, JavaScript'
}

EDUCATION:
${portfolioData.education?.length ? 
  portfolioData.education.map((edu: any) => 
    `• ${edu.degree || 'Degree'} from ${edu.school || 'Institution'} (${edu.year || 'Year'})`
  ).join('\n') : 
  '• Education details to be added'
}

SOCIAL LINKS:
${portfolioData.socialLinks ? 
  Object.entries(portfolioData.socialLinks)
    .filter(([_, url]) => url)
    .map(([platform, url]) => `${platform}: ${url}`)
    .join('\n') : 
  'Social media links to be added'
}

Create sections: Header/Navigation, Hero, About, Experience, Skills, Projects, Education, Contact
Include a working contact form with proper validation and user feedback.
Make it visually stunning and highly professional.`

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Use latest model
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const htmlContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Error generating portfolio content'

    // Validate generated HTML
    if (!htmlContent.includes('<html') || !htmlContent.includes('</html>')) {
      throw new Error('Invalid HTML generated')
    }

    return NextResponse.json({ 
      html: htmlContent,
      success: true,
      template: template?.name || 'Default',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Claude API error:', error)
    
    // Return more specific error messages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      { 
        error: `Portfolio generation failed: ${errorMessage}`,
        success: false,
        timestamp: Date.now()
      },
      { status: 500 }
    )
  }
}