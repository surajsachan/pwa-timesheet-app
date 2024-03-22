// AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext'

const AdminRoute = ({ children }) => {
    const { isAdmin, isLoading } = useAdmin();

    if (isLoading) {
        return <div>Loading...</div>;  // Show a loading spinner or message until isAdmin is determined
    }

    return isAdmin ? children : <Navigate to="/home" />;
};

export default AdminRoute;
