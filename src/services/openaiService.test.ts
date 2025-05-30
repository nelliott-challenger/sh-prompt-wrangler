import { describe, it, expect } from 'vitest'
import { buildRequestBody } from './openaiService'

describe('buildRequestBody', () => {
  describe('Message Construction', () => {
    it('should create system message when systemPrompt is provided', () => {
      const requestData = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: '',
        inputText: '',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.messages).toHaveLength(1)
      expect(result.messages[0]).toEqual({
        role: 'system',
        content: 'You are a helpful assistant'
      })
    })

    it('should create user message when userPrompt is provided', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'What is the weather like?',
        inputText: '',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.messages).toHaveLength(1)
      expect(result.messages[0]).toEqual({
        role: 'user',
        content: 'What is the weather like?'
      })
    })

    it('should create user message when inputText is provided', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: '',
        inputText: 'Some input text',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.messages).toHaveLength(1)
      expect(result.messages[0]).toEqual({
        role: 'user',
        content: 'Some input text'
      })
    })

    it('should create all message types when all prompts are provided', () => {
      const requestData = {
        systemPrompt: 'You are a helpful assistant',
        userPrompt: 'What is the weather like?',
        inputText: 'Additional context',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.messages).toHaveLength(3)
      expect(result.messages[0]).toEqual({
        role: 'system',
        content: 'You are a helpful assistant'
      })
      expect(result.messages[1]).toEqual({
        role: 'user',
        content: 'What is the weather like?'
      })
      expect(result.messages[2]).toEqual({
        role: 'user',
        content: 'Additional context'
      })
    })

    it('should trim whitespace from prompts', () => {
      const requestData = {
        systemPrompt: '  You are helpful  ',
        userPrompt: '\n  Ask question  \t',
        inputText: '   Input text   ',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.messages).toHaveLength(3)
      expect(result.messages[0].content).toBe('  You are helpful  ')
      expect(result.messages[1].content).toBe('\n  Ask question  \t')
      expect(result.messages[2].content).toBe('   Input text   ')
    })
  })

  describe('Model Configuration', () => {
    it('should always include model as gpt-4.1', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: '',
        inputText: '',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.model).toBe('gpt-4.1')
    })
  })

  describe('Temperature Parameter', () => {
    it('should include temperature when provided as valid number string', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '0.7',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.temperature).toBe(0.7)
    })

    it('should include temperature when provided as integer string', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '1',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.temperature).toBe(1)
    })

    it('should not include temperature when empty string', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result).not.toHaveProperty('temperature')
    })

    it('should handle edge case temperature values', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '0.0',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result.temperature).toBe(0.0)
    })
  })

  describe('Max Tokens Parameter', () => {
    it('should include max_tokens when provided as valid number string', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '',
        maxTokens: '100'
      }

      const result = buildRequestBody(requestData)

      expect(result.max_tokens).toBe(100)
    })

    it('should include max_tokens when provided as large number', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '',
        maxTokens: '4000'
      }

      const result = buildRequestBody(requestData)

      expect(result.max_tokens).toBe(4000)
    })

    it('should not include max_tokens when empty string', () => {
      const requestData = {
        systemPrompt: '',
        userPrompt: 'Test',
        inputText: '',
        temperature: '',
        maxTokens: ''
      }

      const result = buildRequestBody(requestData)

      expect(result).not.toHaveProperty('max_tokens')
    })
  })

  describe('Combined Parameters', () => {
    it('should include both temperature and max_tokens when both provided', () => {
      const requestData = {
        systemPrompt: 'System',
        userPrompt: 'User',
        inputText: 'Input',
        temperature: '0.8',
        maxTokens: '500'
      }

      const result = buildRequestBody(requestData)

      expect(result.temperature).toBe(0.8)
      expect(result.max_tokens).toBe(500)
      expect(result.messages).toHaveLength(3)
    })

    it('should handle complete request with all fields populated', () => {
      const requestData = {
        systemPrompt: 'You are an expert assistant',
        userPrompt: 'Please help me with this task',
        inputText: 'Here is the data to process',
        temperature: '0.5',
        maxTokens: '1000'
      }

      const result = buildRequestBody(requestData)

      expect(result).toEqual({
        model: 'gpt-4.1',
        messages: [
          { role: 'system', content: 'You are an expert assistant' },
          { role: 'user', content: 'Please help me with this task' },
          { role: 'user', content: 'Here is the data to process' }
        ],
        temperature: 0.5,
        max_tokens: 1000
      })
    })
  })
}) 