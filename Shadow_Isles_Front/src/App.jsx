import { useState, useEffect } from 'react'
import nature from '/nature.png'
import theater from '/theater.png'
import classroom from '/classroom.svg'
import kundoIcon from './assets/none_background_kundo.png'
import computerIcon from './assets/streamline-pixel--computer-old-electronics.svg'
import trashIcon from './assets/pixel--trash.svg'
import './App.css'
import { useWebSocket } from './hooks/useWebSocket'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [selectedBackground, setSelectedBackground] = useState(null)
  const [messages, setMessages] = useState([])

  // WebSocket 연결 (필요시 URL 변경)
  const { isConnected, lastMessage, sendMessage, error } = useWebSocket('ws://localhost:8080')

  const backgrounds = [
    { id: 'nature', image: nature, label: 'nature' },
    { id: 'classroom', image: classroom, label: 'classroom' },
    { id: 'theater', image: theater, label: 'theater' }
  ]

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background)
    setCurrentScreen('background-view')

    // WebSocket으로 배경 선택 정보 전송
    sendMessage({
      type: 'background_selected',
      background: background.id,
      timestamp: new Date().toISOString()
    })
  }

  // 새 메시지 수신 시 처리
  useEffect(() => {
    if (lastMessage) {
      setMessages(prev => [...prev, lastMessage])
      console.log('Received message:', lastMessage)
    }
  }, [lastMessage])

  // 테스트 메시지 전송 함수
  const sendTestMessage = () => {
    sendMessage({
      type: 'test',
      message: 'Hello from client!',
      timestamp: new Date().toISOString()
    })
  }

  if (currentScreen === 'welcome') {
    return (
      <div className="welcome-screen">
        <h1 className="welcome-title">
          Welcome to <img src={kundoIcon} alt="K" className="kundo-icon" />undo
        </h1>
        <div style={{ marginBottom: '20px', fontSize: '14px' }}>
          WebSocket Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          {error && <div style={{ color: 'red' }}>Error: {error}</div>}
        </div>
        <button className="start-button" onClick={() => setCurrentScreen('choose-background')}>
          start
        </button>
        <button
          className="start-button"
          onClick={sendTestMessage}
          style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}
        >
          Send Test Message
        </button>
      </div>
    )
  }

  if (currentScreen === 'background-view' && selectedBackground) {
    return (
      <div className="background-view" style={{ backgroundImage: `url(${selectedBackground.image})` }}>
        {selectedBackground.id === 'nature' && (
          <div className="desktop-icons">
            <div className="desktop-icon">
              <img src={computerIcon} alt="Computer" />
              <span>Computer</span>
            </div>
            <div className="desktop-icon">
              <img src={trashIcon} alt="Trash" />
              <span>Trash</span>
            </div>
          </div>
        )}
        <button className="back-button" onClick={() => setCurrentScreen('choose-background')}>
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="app">
      <h1 className="title">Choose Background</h1>
      <div className="background-container">
        {backgrounds.map((bg) => (
          <div key={bg.id} className="background-card" onClick={() => handleBackgroundSelect(bg)}>
            <div className="image-wrapper">
              <img src={bg.image} alt={bg.label} />
            </div>
            <p className="background-name">{bg.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
