import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FirebaseProvider } from './context/FirebaseContext'
import { AuthProvider } from './context/AuthContext'
import AuthModal from './components/AuthModal'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <App />
        <AuthModal />
      </AuthProvider>
    </FirebaseProvider>
  </StrictMode>,
)
