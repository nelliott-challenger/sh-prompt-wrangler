interface OpenAIRequest {
  systemPrompt: string
  userPrompt: string
  inputText: string
  temperature: string
  maxTokens: string
}

interface OpenAIResponse {
  result: any // Raw API response
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  responseTime: number // Response time in milliseconds
}

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

export const replaceInputTextPlaceholder = (userPrompt: string, inputText: string): string => {
  return userPrompt.replace(/\{INPUT_TEXT\}/g, inputText)
}

export const buildRequestBody = (requestData: OpenAIRequest) => {
  const messages = []
  if (requestData.systemPrompt.trim()) {
    messages.push({
      role: 'system',
      content: requestData.systemPrompt
    })
  }
  
  let processedUserPrompt = requestData.userPrompt
  if (requestData.inputText.trim() && requestData.userPrompt.trim()) {
    processedUserPrompt = replaceInputTextPlaceholder(requestData.userPrompt, requestData.inputText)
  }
  
  if (processedUserPrompt.trim()) {
    messages.push({
      role: 'user', 
      content: processedUserPrompt
    })
  }
  
  if (requestData.inputText.trim()) {
    if (!requestData.userPrompt.trim() || !requestData.userPrompt.includes('{INPUT_TEXT}')) {
      messages.push({
        role: 'user',
        content: requestData.inputText
      })
    }
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
  const startTime = Date.now()
  
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
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`)
    }
    
    const tokenUsage = {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0
    }
    
    return { 
      result: data,
      tokenUsage,
      responseTime
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    throw error
  }
} 