
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import HouseAdminDashboard from '../components/dashboards/HouseAdminDashboard';
import JudgeDashboard from '../components/dashboards/JudgeDashboard';
import WebsiteAdminDashboard from '../components/dashboards/WebsiteAdminDashboard';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case Role.STUDENT:
                return <StudentDashboard />;
            case Role.HOUSE_ADMIN:
                return <HouseAdminDashboard />;
            case Role.JUDGE:
                return <JudgeDashboard />;
            case Role.WEBSITE_ADMIN:
                return <WebsiteAdminDashboard />;
            default:
                return <div className="text-center">No dashboard available for your role.</div>;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-3xl font-bold font-serif mb-2 text-brand-amber">
                    {user?.role} Dashboard
                </h1>
                <p className="text-white/60 mb-8">Welcome, {user?.name}. Here's your overview.</p>
                {renderDashboard()}
            </div>
        </div>
    );
};

export default DashboardPage;