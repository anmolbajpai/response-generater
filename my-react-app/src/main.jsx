import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import ReviewResponderApp from './components/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {<ReviewResponderApp />}
  </StrictMode>,
)
