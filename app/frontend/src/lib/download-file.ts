export const downloadFile = async (portfolioData: any, template: any) => {
	try {
	  const response = await fetch('/api/download', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ portfolioData, template })
	  })
  
	  if (!response.ok) throw new Error('Download failed')
  
	  const blob = await response.blob()
	  const url = window.URL.createObjectURL(blob)
	  const a = document.createElement('a')
	  a.href = url
	  a.download = `${portfolioData.personalInfo?.fullName?.replace(/\s+/g, '-').toLowerCase() || 'portfolio'}-portfolio.zip`
	  document.body.appendChild(a)
	  a.click()
	  window.URL.revokeObjectURL(url)
	  document.body.removeChild(a)
	} catch (error) {
	  console.error('Download error:', error)
	  throw error
	}
  }