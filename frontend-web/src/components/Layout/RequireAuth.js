
// src/components/Layout/RequireAuth.js
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const RequireAuth = () => {
    const { auth } = useAuth(); // Get auth state from our context
    const location = useLocation();

    // Check if the user has an accessToken
    return auth?.accessToken ? (
        <Outlet /> // If yes, show the child component (e.g., DashboardPage)
    ) : (
        // If no, redirect them to the /login page
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default RequireAuth;