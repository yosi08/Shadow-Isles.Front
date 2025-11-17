import { useState } from 'react'
import nature from '/nature.png'
import theater from '/theater.png'
import classroom from '/classroom.svg'
import kundoIcon from './assets/none_background_kundo.png'
import computerIcon from './assets/streamline-pixel--computer-old-electronics.svg'
import trashIcon from './assets/pixel--trash.svg'
import './App.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome')
  const [selectedBackground, setSelectedBackground] = useState(null)

  const backgrounds = [
    { id: 'nature', image: nature, label: 'nature' },
    { id: 'classroom', image: classroom, label: 'classroom' },
    { id: 'theater', image: theater, label: 'theater' }
  ]

  const handleBackgroundSelect = (background) => {
    setSelectedBackground(background)
    setCurrentScreen('background-view')
  }

  if (currentScreen === 'welcome') {
    return (
      <div className="welcome-screen">
        <h1 className="welcome-title">
          Welcome to <img src={kundoIcon} alt="K" className="kundo-icon" />undo
        </h1>
        <button className="start-button" onClick={() => setCurrentScreen('choose-background')}>
          start
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
