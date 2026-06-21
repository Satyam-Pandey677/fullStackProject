import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { reportWebVitals } from './reportWebVitals.ts'
import ContextProvider from './context/ContextProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <ContextProvider>
      <App  />
    </ContextProvider>
    </BrowserRouter>
  </StrictMode>,
)

reportWebVitals()
