import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedBuyerRoute() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.userType !== 'buyer') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}