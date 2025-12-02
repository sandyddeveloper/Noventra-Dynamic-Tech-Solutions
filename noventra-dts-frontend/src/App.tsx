import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from './routes/routes'

const AppRoutes = () => useRoutes(routes)

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App