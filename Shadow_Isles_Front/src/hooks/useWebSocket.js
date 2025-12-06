import { useEffect, useRef, useState, useCallback } from 'react'

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [error, setError] = useState(null)
  const ws = useRef(null)
  const reconnectTimeout = useRef(null)

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        console.log('WebSocket Connected')
        setIsConnected(true)
        setError(null)
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
        } catch (err) {
          setLastMessage(event.data)
        }
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket Error:', error)
        setError('Connection error')
      }

      ws.current.onclose = () => {
        console.log('WebSocket Disconnected')
        setIsConnected(false)

        // 자동 재연결 (5초 후)
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...')
          connect()
        }, 5000)
      }
    } catch (err) {
      console.error('Failed to create WebSocket:', err)
      setError('Failed to connect')
    }
  }, [url])

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const data = typeof message === 'string' ? message : JSON.stringify(message)
      ws.current.send(data)
      return true
    } else {
      console.warn('WebSocket is not connected')
      return false
    }
  }, [])

  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current)
    }
    if (ws.current) {
      ws.current.close()
    }
  }, [])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    lastMessage,
    error,
    sendMessage,
    disconnect,
    reconnect: connect
  }
}
