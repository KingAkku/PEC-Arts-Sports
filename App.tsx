
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import EventsPage from './pages/EventsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
};

const MainApp: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen flex flex-col font-sans bg-brand-bg bg-fixed" style={{backgroundImage: 'radial-gradient(circle at top right, rgba(249, 115, 22, 0.1), transparent 40%)'}}>
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
                    <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
                    <Route path="/events" element={user ? <EventsPage /> : <Navigate to="/auth" />} />
                    <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/auth" />} />
                    <Route path="/about" element={user ? <AboutPage /> : <Navigate to="/auth" />} />
                    <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;