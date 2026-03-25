import type { AICommentRequest } from '@/types/qweather'
import { fetchAICommet } from '../components/AIComment/fetchAICommet'
import { useState, useRef, useEffect, useCallback } from 'react'

export function useAIStream() {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const generateComment = useCallback(async (params: AICommentRequest) => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    setIsLoading(true)
    setError(null)
    setContent('')

    try {
      const response = await fetchAICommet(params)
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''
      while (!signal.aborted) {
        const { done, value } = await reader.read() //要写await,不然会报错
        if (done) break
        buffer += decoder.decode(value)
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            try {
              const json = JSON.parse(data)
              const delta = json.choices?.[0]?.delta?.content
              if (delta) {
                setContent(prev => prev + delta)
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      setError(err instanceof Error ? err.message : '生成失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }, [])
  const canel = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }, [])
  const clearContent = useCallback(() => {
    setContent('')
    setError(null)
  }, [])

  return {
    content,
    isLoading,
    error,
    generateComment,
    canel,
    clearContent,
  }
}
