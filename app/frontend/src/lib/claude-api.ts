export const generatePortfolio = async (portfolioData: any, template: any) => {
	try {
	  const response = await fetch('/api/claude', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ portfolioData, template })
	  })
	  
	  if (!response.ok) throw new Error('Failed to generate portfolio')
	  
	  const data = await response.json()
	  return data.html
	} catch (error) {
	  console.error('Generate portfolio error:', error)
	  throw error
	}
  }