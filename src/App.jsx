import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import { AuthProvider } from './context/AuthContext';
import CalendarView from './pages/CalendarView';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<CalendarView />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EventsProvider>
    </AuthProvider>
  );
}

export default App;
