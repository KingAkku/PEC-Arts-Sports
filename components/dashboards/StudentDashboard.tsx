
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Registration, Event, RegistrationStatus } from '../../types';
import { apiService } from '../../services/mockApiService';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '../../constants';
import Button from '../ui/Button';

const StudentDashboard: React.FC = () => {
    const { user, updateUserProfilePicture } = useAuth();
    const [registrations, setRegistrations] = useState<(Registration & { event: Event | undefined })[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (user) {
                const regs = await apiService.getStudentRegistrations(user.id);
                setRegistrations(regs);
            }
        };
        fetchRegistrations();
    }, [user]);

    const getStatusIcon = (status: RegistrationStatus) => {
        switch (status) {
            case RegistrationStatus.APPROVED:
            case RegistrationStatus.REGISTERED:
                return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
            case RegistrationStatus.PENDING:
                return <ClockIcon className="w-6 h-6 text-yellow-400" />;
            case RegistrationStatus.REJECTED:
                return <XCircleIcon className="w-6 h-6 text-red-400" />;
            default:
                return null;
        }
    };
    
    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newImageUrl = reader.result as string;
                await updateUserProfilePicture(newImageUrl);
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
                <div className="flex items-center gap-6 bg-white/5 p-4 rounded-lg">
                    <img 
                        src={user?.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} 
                        alt="Profile"
                        className="h-20 w-20 rounded-full object-cover border-2 border-brand-amber"
                    />
                    <div>
                        <label htmlFor="profile-picture-upload" className="cursor-pointer">
                            <Button as="span" variant="secondary" isLoading={isUploading}>
                                {isUploading ? 'Uploading...' : 'Change Picture'}
                            </Button>
                        </label>
                        <input id="profile-picture-upload" type="file" className="hidden" accept="image/*" onChange={handlePictureChange} />
                        <p className="text-xs text-white/50 mt-2">Upload a new profile image.</p>
                    </div>
                </div>
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold mb-6">My Registrations</h2>
                {registrations.length === 0 ? (
                    <p className="text-white/60">You have not registered for any events yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-white/20">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Event Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => (
                                    <tr key={reg.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 whitespace-nowrap">{reg.event?.name}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(reg.status)}
                                                <span>{reg.status}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap font-semibold text-brand-amber">
                                            {reg.score !== undefined ? reg.score : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
};

export default StudentDashboard;