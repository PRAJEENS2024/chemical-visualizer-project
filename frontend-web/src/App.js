// src/App.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import RequireAuth from './components/Layout/RequireAuth';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;