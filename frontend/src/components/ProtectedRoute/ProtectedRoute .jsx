import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const user = useSelector(store => store.auth?.user);
    return user ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute ;