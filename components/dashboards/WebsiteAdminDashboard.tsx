
import React, { useState, useEffect } from 'react';
import { Event, User, House } from '../../types';
import { apiService } from '../../services/mockApiService';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';

const WebsiteAdminDashboard: React.FC = () => {
    const { user, updateUserProfilePicture } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setUsers(await apiService.getAllUsers());
            setEvents(await apiService.getEvents());
        };
        loadData();
    }, []);

    const handleCreateEvent = () => {
        // In a real app, this would handle form submission
        console.log("Creating event...");
        setIsEventModalOpen(false);
    }
    
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
             <Modal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} title="Create New Event">
                <form className="space-y-4" onSubmit={handleCreateEvent}>
                    <Input label="Event Name" id="eventName" type="text" required/>
                    {/* Add more form fields for event details */}
                    <div className="pt-4 flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={() => setIsEventModalOpen(false)}>Cancel</Button>
                        <Button type="submit">Create Event</Button>
                    </div>
                </form>
            </Modal>

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
            
            {/* Event Management */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Event Management</h2>
                    <Button onClick={() => setIsEventModalOpen(true)}>Create Event</Button>
                </div>
                <div className="bg-white/5 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {events.map(event => (
                        <div key={event.id} className="flex justify-between items-center p-2 border-b border-white/10 last:border-b-0">
                            <span>{event.name}</span>
                            <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">Edit</Button>
                                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10">Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* User Management */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                <div className="bg-white/5 p-4 rounded-lg max-h-64 overflow-y-auto">
                    {users.map(user => (
                        <div key={user.id} className="grid grid-cols-3 gap-4 items-center p-2 border-b border-white/10 last:border-b-0">
                            <span>{user.name}</span>
                            <span className="text-white/60">{user.role}</span>
                             <div className="flex space-x-2 justify-end">
                                <Button size="sm" variant="ghost">Edit</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Other Controls */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Other Controls</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">House Management</h3>
                        <p className="text-sm text-white/60 mb-4">Assign house admins to houses.</p>
                        <Button>Manage Houses</Button>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Finalize Results</h3>
                        <p className="text-sm text-white/60 mb-4">Lock judging and finalize leaderboard scores for the year.</p>
                        <Button>Lock Judging</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WebsiteAdminDashboard;