import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard.jsx'
// import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <BrowserRouter> */}
      <Toaster position="top-right" />
      <App />
    {/* </BrowserRouter> */}
  </StrictMode>
)




