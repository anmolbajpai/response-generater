import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard.jsx'
// import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" />
    {<Dashboard />}
  </StrictMode>,
)


