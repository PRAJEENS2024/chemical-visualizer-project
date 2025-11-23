// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage'; // Import the new page
import RequireAuth from './components/Layout/RequireAuth';
import { useAuth } from './context/AuthProvider'; // Import Auth hook

function App() {
    const { auth } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={ auth?.accessToken ? <Navigate to="/dashboard" /> : <LandingPage /> } />
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;