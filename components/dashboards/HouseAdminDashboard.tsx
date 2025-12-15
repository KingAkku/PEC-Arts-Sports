
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Registration, User, Event } from '../../types';
import { apiService } from '../../services/mockApiService';
import Button from '../ui/Button';

interface PendingRequest extends Registration {
    student?: User;
    event?: Event;
}

const HouseAdminDashboard: React.FC = () => {
    const { user, updateUserProfilePicture } = useAuth();
    const [requests, setRequests] = useState<PendingRequest[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const fetchRequests = useCallback(async () => {
        if (user && user.house) {
            const reqs = await apiService.getPendingRequests(user.house);
            setRequests(reqs);
        }
    }, [user]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApproval = async (registrationId: string, approve: boolean) => {
        await apiService.updateRegistrationStatus(registrationId, approve);
        fetchRequests(); // Refresh list
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
                <h2 className="text-2xl font-semibold mb-6">Pending Registration Requests ({user?.house} House)</h2>
                {requests.length === 0 ? (
                    <p className="text-white/60">There are no pending requests for your house.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="border-b border-white/20">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Student Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Event Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-white/70 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 whitespace-nowrap">{req.student?.name}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">{req.event?.name}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <Button size="sm" onClick={() => handleApproval(req.id, true)}>Approve</Button>
                                                <Button size="sm" variant="secondary" onClick={() => handleApproval(req.id, false)}>Reject</Button>
                                            </div>
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

export default HouseAdminDashboard;