import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { portfolioData, template } = await request.json()

    const prompt = `Create a modern, professional portfolio website with the following requirements:

PERSONAL INFO:
- Name: ${portfolioData.personalInfo?.fullName}
- Title: ${portfolioData.personalInfo?.professionalTitle}
- Email: ${portfolioData.personalInfo?.email}
- Phone: ${portfolioData.personalInfo?.phone}
- Location: ${portfolioData.personalInfo?.location}
- Bio: ${portfolioData.personalInfo?.bio}

TEMPLATE STYLE: ${template.name} - ${template.description}

EXPERIENCE:
${portfolioData.experience?.map((exp: any) => 
  `- ${exp.role} at ${exp.company} (${exp.duration}): ${exp.description}`
).join('\n') || 'No experience data yet'}

SKILLS:
${portfolioData.skills?.map((skill: any) => 
  `- ${skill.category}: ${skill.items.join(', ')}`
).join('\n') || 'No skills data yet'}

PROJECTS:
${portfolioData.projects?.map((project: any) => 
  `- ${project.name}: ${project.description} (Tech: ${project.tech})`
).join('\n') || 'No projects data yet'}

EDUCATION:
${portfolioData.education?.map((edu: any) => 
  `- ${edu.degree} from ${edu.school} (${edu.year})`
).join('\n') || 'No education data yet'}

Create a complete, responsive HTML file with embedded CSS and JavaScript. Requirements:
1. Modern, clean design matching the ${template.style} style
2. Fully responsive (mobile-first)
3. Smooth animations and hover effects
4. Professional color scheme
5. All sections: Hero, About, Experience, Skills, Projects, Education, Contact
6. Working contact form (frontend only)
7. No external dependencies
8. Single HTML file with <style> and <script> tags

Return only the complete HTML code, no explanations.`

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const htmlContent = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Error generating portfolio'

    return NextResponse.json({ 
      html: htmlContent,
      success: true 
    })

  } catch (error) {
    console.error('Claude API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate portfolio', success: false },
      { status: 500 }
    )
  }
}
