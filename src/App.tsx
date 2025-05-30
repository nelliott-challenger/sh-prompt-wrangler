import { useState } from 'react'
import './App.css'
import { callOpenAI } from './services/openaiService'

interface FormData {
  systemPrompt: string
  userPrompt: string
  inputText: string
  temperature: string
  maxTokens: string
}

interface OpenAIResult {
  result: any
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  responseTime: number
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    systemPrompt: '',
    userPrompt: '',
    inputText: '',
    temperature: '',
    maxTokens: ''
  })
  const [openAIResult, setOpenAIResult] = useState<OpenAIResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await callOpenAI(formData)
      setOpenAIResult(result)
    } catch (error) {
      console.error('Error calling OpenAI service:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      setOpenAIResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const renderResponseContent = () => {
    if (!openAIResult?.result?.choices?.[0]?.message?.content) {
      return 'No content available'
    }
    
    const content = openAIResult.result.choices[0].message.content
    const parsedContent = JSON.parse(content)
    const formattedContent = JSON.stringify(parsedContent, null, 2)
    
    return (
      <div className={`response-content json-content`}>
        {formattedContent}
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Enhanced Form Demo</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-fields">
            <div className="field-group">
              <label htmlFor="systemPrompt">System Prompt:</label>
              <textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
                placeholder="Enter system prompt..."
                className="textarea-input"
                rows={3}
              />
            </div>

            <div className="field-group">
              <label htmlFor="userPrompt">User Prompt:</label>
              <textarea
                id="userPrompt"
                value={formData.userPrompt}
                onChange={(e) => handleInputChange('userPrompt', e.target.value)}
                placeholder="Enter user prompt..."
                className="textarea-input"
                rows={3}
              />
            </div>

            <div className="field-group">
              <label htmlFor="inputText">Input Text:</label>
              <input
                type="text"
                id="inputText"
                value={formData.inputText}
                onChange={(e) => handleInputChange('inputText', e.target.value)}
                placeholder="Enter input text..."
                className="text-input"
              />
            </div>

            <div className="field-group">
              <label htmlFor="temperature">Temperature:</label>
              <input
                type="number"
                id="temperature"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value)}
                placeholder="e.g., 0.7"
                className="text-input"
                step="0.1"
                min="0"
                max="2"
              />
            </div>

            <div className="field-group">
              <label htmlFor="maxTokens">Max Tokens:</label>
              <input
                type="number"
                id="maxTokens"
                value={formData.maxTokens}
                onChange={(e) => handleInputChange('maxTokens', e.target.value)}
                placeholder="e.g., 1000"
                className="text-input"
                min="1"
              />
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="output-box error">
            <h3>Error:</h3>
            <pre className="api-response">
              {error}
            </pre>
          </div>
        )}
        
        {openAIResult && (
          <div className="output-box">
            <h3>OpenAI API Response:</h3>
            
            <div className="usage-stats">
              <h4>Usage Statistics:</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <strong>Response Time:</strong>
                  <span>{openAIResult.responseTime}ms</span>
                </div>
                <div className="stat-item">
                  <strong>Total Tokens:</strong>
                  <span>{openAIResult.tokenUsage.totalTokens}</span>
                </div>
                <div className="stat-item">
                  <strong>Prompt Tokens:</strong>
                  <span>{openAIResult.tokenUsage.promptTokens}</span>
                </div>
                <div className="stat-item">
                  <strong>Completion Tokens:</strong>
                  <span>{openAIResult.tokenUsage.completionTokens}</span>
                </div>
              </div>
            </div>
            
            <div className="response-section">
              <h4>Response:</h4>
              {renderResponseContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
