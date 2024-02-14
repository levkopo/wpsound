import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AdaptiveProvider, ThemeProvider } from '@znui/react'
import '@znui/react/dist/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider scheme="system">
      <AdaptiveProvider>
        <App />
      </AdaptiveProvider>
    </ThemeProvider>
  </React.StrictMode>
)
