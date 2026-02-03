
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Profile, UserRole } from '../types.ts';

interface AdminLayoutProps {
    currentUser: Profile | null;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentUser }) => {
    // Security Layer
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="admin-root min-h-screen bg-[#09090b] text-zinc-100">
            {/* The Admin Layout is minimalistic because the AdminPanel provides its own sidebar */}
            <div className="flex-1 overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
};
