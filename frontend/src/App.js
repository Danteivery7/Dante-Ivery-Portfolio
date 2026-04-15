import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EditProvider } from './context/EditContext';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import EditModeToggle from './components/EditModeToggle';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import './App.css';

function App() {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <EditProvider>
      <Router>
        <div className="App min-h-screen bg-[#0B0F14] text-white">
          <Navigation />
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work" element={<WorkPage />} />
          </Routes>

          <Footer />
          <EditModeToggle />
          <Toaster 
            position="top-right" 
            theme="dark"
            toastOptions={{
              style: {
                background: '#151920',
                color: '#F5F5F5',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </div>
      </Router>
    </EditProvider>
  );
}

export default App;
