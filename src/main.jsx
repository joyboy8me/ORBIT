import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivacyPage from './PrivacyPage.jsx'

const isPrivacyPage = window.location.pathname.replace(/\/+$/, '') === '/privacy'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isPrivacyPage ? <PrivacyPage /> : <App />}
  </StrictMode>,
)
