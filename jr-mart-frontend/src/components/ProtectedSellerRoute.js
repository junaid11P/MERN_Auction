import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedSellerRoute() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.userType !== 'seller') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}