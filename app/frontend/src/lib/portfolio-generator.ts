import { debounce } from 'lodash'
import { generatePortfolio } from './claude-api'

export const debouncedGeneratePortfolio = debounce(
  async (portfolioData: any, template: any, callback: (html: string) => void) => {
    try {
      const html = await generatePortfolio(portfolioData, template)
      callback(html)
    } catch (error) {
      console.error('Portfolio generation failed:', error)
      callback('<div>Error generating portfolio</div>')
    }
  },
  2000
)