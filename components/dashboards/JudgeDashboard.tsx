
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Event, Registration, User } from '../../types';
import { apiService } from '../../services/mockApiService';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface Participant extends Registration {
    student?: User;
}

const JudgeDashboard: React.FC = () => {
    const { user, updateUserProfilePicture } = useAuth();
    const [assignedEvents, setAssignedEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [scores, setScores] = useState<{ [key: string]: string }>({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            if (user) {
                const events = await apiService.getJudgeEvents(user.id);
                setAssignedEvents(events);
            }
        };
        fetchEvents();
    }, [user]);

    const handleSelectEvent = async (event: Event) => {
        setSelectedEvent(event);
        const eventParticipants = await apiService.getEventParticipants(event.id);
        setParticipants(eventParticipants);
        const initialScores = eventParticipants.reduce((acc, p) => {
            acc[p.id] = p.score?.toString() || '';
            return acc;
        }, {} as { [key: string]: string });
        setScores(initialScores);
    };

    const handleScoreChange = (registrationId: string, value: string) => {
        setScores(prev => ({ ...prev, [registrationId]: value }));
    };

    const handleSubmitScores = async () => {
        if (!selectedEvent) return;
        const scoreUpdates = Object.entries(scores)
            .map(([regId, score]) => ({ registrationId: regId, score: parseInt(score, 10) }))
            .filter(update => !isNaN(update.score));

        await apiService.submitScores(selectedEvent.id, scoreUpdates);
        alert('Scores submitted successfully!');
        setSelectedEvent(null);
        setParticipants([]);
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
                <h2 className="text-2xl font-semibold mb-6">Assigned Events for Judging</h2>
                {!selectedEvent ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignedEvents.map(event => (
                            <div key={event.id} className="bg-white/5 p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{event.name}</p>
                                    <p className="text-sm text-white/60">{event.category}</p>
                                </div>
                                <Button size="sm" onClick={() => handleSelectEvent(event)}>Judge</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <Button variant="secondary" onClick={() => setSelectedEvent(null)} className="mb-4">← Back to Events</Button>
                        <h3 className="text-xl font-bold mb-4">Judging: {selectedEvent.name}</h3>
                        <div className="space-y-4">
                            {participants.map(p => (
                                <div key={p.id} className="grid grid-cols-3 items-center gap-4 bg-white/5 p-3 rounded-lg">
                                    <span className="col-span-2">{p.student?.name}</span>
                                    <Input
                                        type="number"
                                        placeholder="Score"
                                        value={scores[p.id] || ''}
                                        onChange={(e) => handleScoreChange(p.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-right">
                            <Button onClick={handleSubmitScores}>Submit All Scores</Button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default JudgeDashboard;