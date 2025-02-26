import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import SurveyForm from './components/SurveyForm';
import Dashboard from './components/Dashboard';
import Login from './components/Login'; // Create this component separately
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <h1>Personal Data Store</h1>
          <AuthConsumer />
        </div>
      </Router>
    </AuthProvider>
  );
};

const AuthConsumer: React.FC = () => {
  const { isAuthenticated, logout } = React.useContext(AuthContext)!;

  return (
    <>
      {isAuthenticated ? (
        <>
          <button onClick={logout}>Logout</button>
          <Routes>
            <Route path="/survey" element={<SurveyForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;