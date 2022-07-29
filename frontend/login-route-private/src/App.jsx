import React from 'react'
import { Router } from 'react-router-dom';
import history from './services/history'
import { AuthProvider} from './Context/AuthContext'
import Routes from './routes/PrivateRoutes'


function App() {

  return (
    <div >
        <AuthProvider>
          <Router history={history}>
            <Routes />
          </Router>
        </AuthProvider>
    </div>
  )
}

export default App
