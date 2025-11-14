// src/App.js
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequireAuth from './components/Layout/RequireAuth';

function App() {
    return (
        // This 'min-h-screen bg-gray-100' is from Tailwind!
        <div className="min-h-screen bg-gray-100">
            <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Route */}
                <Route element={<RequireAuth />}>
                    <Route path="/" element={<DashboardPage />} />
                </Route>

                {/* Fallback for any other path */}
                <Route path="*" element={<LoginPage />} />
            </Routes>
        </div>
    );
}

export default App;