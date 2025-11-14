import { useState, useEffect } from 'react'
import Icon from '@mdi/react'
import * as mdi from '@mdi/js'
import './App.css'

interface App {
  name: string
  url: string
  icon: string
  target?: string
}

type Theme = 'coffee' | 'blue' | 'purple' | 'green' | 'dark'

const themes = {
  coffee: {
    name: 'Coffee',
    background: '#1a1410',
    cardBg: '#2a2018',
    cardBgHover: '#3d2f24',
    border: '#3d2f24',
    borderHover: '#c9a876',
    text: '#e8d5c4',
    icon: '#c9a876',
    iconHover: '#e8d5c4'
  },
  blue: {
    name: 'Ocean',
    background: '#0f1419',
    cardBg: '#1a2332',
    cardBgHover: '#243447',
    border: '#2d4561',
    borderHover: '#4a9eff',
    text: '#e6f1ff',
    icon: '#4a9eff',
    iconHover: '#80b3ff'
  },
  purple: {
    name: 'Purple',
    background: '#1a1025',
    cardBg: '#2a1f3d',
    cardBgHover: '#3d2e5c',
    border: '#4a3a6b',
    borderHover: '#a78bfa',
    text: '#f3e8ff',
    icon: '#a78bfa',
    iconHover: '#c4b5fd'
  },
  green: {
    name: 'Forest',
    background: '#0f1a14',
    cardBg: '#1a2a20',
    cardBgHover: '#243d2e',
    border: '#2d5241',
    borderHover: '#4ade80',
    text: '#e6f5ea',
    icon: '#4ade80',
    iconHover: '#86efac'
  },
  dark: {
    name: 'Dark',
    background: '#0d0d0d',
    cardBg: '#1a1a1a',
    cardBgHover: '#262626',
    border: '#333333',
    borderHover: '#666666',
    text: '#e5e5e5',
    icon: '#a3a3a3',
    iconHover: '#d4d4d4'
  }
}

function App() {
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as Theme) || 'coffee'
  })

  useEffect(() => {
    fetch('/apps.json')
      .then(response => response.json())
      .then(data => {
        setApps(data.apps)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading apps:', error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const selectedTheme = themes[theme]
    document.documentElement.style.setProperty('--bg-color', selectedTheme.background)
    document.documentElement.style.setProperty('--card-bg', selectedTheme.cardBg)
    document.documentElement.style.setProperty('--card-bg-hover', selectedTheme.cardBgHover)
    document.documentElement.style.setProperty('--border-color', selectedTheme.border)
    document.documentElement.style.setProperty('--border-hover', selectedTheme.borderHover)
    document.documentElement.style.setProperty('--text-color', selectedTheme.text)
    document.documentElement.style.setProperty('--icon-color', selectedTheme.icon)
    document.documentElement.style.setProperty('--icon-hover', selectedTheme.iconHover)
    localStorage.setItem('theme', theme)
  }, [theme])

  const getIconPath = (iconName: string): string => {
    // Convert icon name to camelCase and add mdi prefix
    const camelCase = iconName
      .split('-')
      .map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('')
    
    const iconKey = `mdi${camelCase.charAt(0).toUpperCase() + camelCase.slice(1)}`
    return (mdi as Record<string, string>)[iconKey] || mdi.mdiApplication
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="container">
      <div className="theme-picker">
        {(Object.keys(themes) as Theme[]).map((themeName) => (
          <button
            key={themeName}
            className={`theme-button ${theme === themeName ? 'active' : ''}`}
            onClick={() => setTheme(themeName)}
            title={themes[themeName].name}
          >
            <span className="theme-dot" style={{ backgroundColor: themes[themeName].icon }}></span>
          </button>
        ))}
      </div>
      <h1>Welcome to the Homelab!</h1>
      <div className="apps-grid">
        {apps.map((app, index) => (
          <a 
            key={index}
            href={app.url}
            target={app.target || '_self'}
            className="app-card"
            rel={app.target === '_blank' ? 'noopener noreferrer' : undefined}
          >
            <Icon path={getIconPath(app.icon)} size={2} />
            <span className="app-name">{app.name}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default App
