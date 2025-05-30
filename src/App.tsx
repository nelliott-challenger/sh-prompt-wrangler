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

function App() {
  const [formData, setFormData] = useState<FormData>({
    systemPrompt: '',
    userPrompt: '',
    inputText: '',
    temperature: '',
    maxTokens: ''
  })
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await callOpenAI(formData)
      setApiResponse(result.result)
    } catch (error) {
      console.error('Error calling OpenAI service:', error)
      setApiResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' })
    } finally {
      setIsLoading(false)
    }
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
        
        {apiResponse && (
          <div className="output-box">
            <h3>OpenAI API Response:</h3>
            <pre className="api-response">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
