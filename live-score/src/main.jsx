import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { SportsProvider } from './context/context'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SportsProvider>
    <App />
    </SportsProvider>
  </StrictMode>,
)
