import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import ProtectedRoute from './Components/ProtectedRoute';
import Regshow from './Components/regshow'
import Tableregister from './Components/Tableregister'
import Dashboard from './Components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        <Route
          path="/Regshow/*"
          element={
            <ProtectedRoute>
              <Regshow />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/regshow/:name"
          element={
            <ProtectedRoute>
              <Tableregister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
