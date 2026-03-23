import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// App entry point: mount the React app into <div id="root"></div> in index.html.
createRoot(document.getElementById('root')).render(
  // StrictMode helps catch common issues during development.
  <StrictMode>
    <App />
  </StrictMode>,
)
