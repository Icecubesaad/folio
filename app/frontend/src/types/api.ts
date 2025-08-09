export interface ClaudeResponse {
	html: string
	success: boolean
	error?: string
  }
  
  export interface SavePortfolioResponse {
	success: boolean
	portfolioId: string
	portfolioUrl: string
	message: string
	error?: string
  }