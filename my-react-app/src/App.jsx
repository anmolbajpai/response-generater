<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { authAPI } from '../services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.verify();
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    verifyUser();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 50%, #FAF5FF 100%)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #E5E7EB',
          borderTop: '4px solid #4F46E5',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
=======
// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";  
>>>>>>> b1ac0ba857e8079bb2f2d40f835fd9ab2baaf977

export default function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {/* <nav style={{ marginBottom: "20px" }}>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/signup">Signup</Link>
        </nav> */}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}
