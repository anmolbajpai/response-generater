import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
<<<<<<< HEAD
// import App from './App.jsx'
import ReviewResponderApp from './components/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {<ReviewResponderApp />}
=======
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard.jsx'
// import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster position="top-right" />
    {<Dashboard />}
>>>>>>> 76105c25d1ba192d6a2d021c34a4ded804e392d3
  </StrictMode>,
)


