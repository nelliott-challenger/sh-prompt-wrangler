interface OpenAIRequest {
  systemPrompt: string
  userPrompt: string
  inputText: string
  temperature: string
  maxTokens: string
}

interface OpenAIResponse {
  result: any // Raw API response for now
}

const API_KEY = 'API_KEY_HERE'

export const buildRequestBody = (requestData: OpenAIRequest) => {
  const messages = []
  
  // Add system message if provided
  if (requestData.systemPrompt.trim()) {
    messages.push({
      role: 'system',
      content: requestData.systemPrompt
    })
  }
  
  // Add user message if provided
  if (requestData.userPrompt.trim()) {
    messages.push({
      role: 'user', 
      content: requestData.userPrompt
    })
  }
  
  // Add input text as another user message if provided
  if (requestData.inputText.trim()) {
    messages.push({
      role: 'user',
      content: requestData.inputText
    })
  }
  
  // If no messages were added, add a default one
  if (messages.length === 0) {
    messages.push({
      role: 'user',
      content: 'Hello'
    })
  }
  
  const requestBody = {
    model: 'gpt-4.1',
    messages: messages,
    ...(requestData.temperature && { temperature: parseFloat(requestData.temperature) }),
    ...(requestData.maxTokens && { max_tokens: parseInt(requestData.maxTokens) })
  }
  
  return requestBody
}

export const callOpenAI = async (requestData: OpenAIRequest): Promise<OpenAIResponse> => {
  const requestBody = buildRequestBody(requestData)
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
    }
    
    return { result: data }
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
} 