import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes/routes'
import { AuthProvider } from './hooks/useAuth'
import "./index.css"


const AppRoutes = () => useRoutes(routes)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider >
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App