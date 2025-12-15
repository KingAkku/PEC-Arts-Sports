
import React, { useEffect, useState } from 'react';
import { Event, EventCategory, EventType } from '../types';
import { apiService } from '../services/mockApiService';
import EventCard from '../components/EventCard';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState<string | null>(null);
    const { user } = useAuth();
    
    useEffect(() => {
        const fetchEvents = async () => {
            const data = await apiService.getEvents();
            setEvents(data);
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        let tempEvents = events;

        if (categoryFilter !== 'all') {
            tempEvents = tempEvents.filter(event => event.category === categoryFilter);
        }

        if (searchQuery) {
            tempEvents = tempEvents.filter(event => 
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredEvents(tempEvents);
    }, [categoryFilter, searchQuery, events]);
    
    const handleRegister = async (eventId: string, eventType: EventType) => {
        if (!user) return;
        try {
            const success = await apiService.registerForEvent(eventId, user.id, eventType);
            if (success) {
                setNotification(`Successfully ${eventType === EventType.NORMAL ? 'registered' : 'requested permission'}!`);
            } else {
                setNotification('Registration failed. The event might be full.');
            }
        } catch (error: any) {
            setNotification(error.message);
        }
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {notification && (
              <div className="fixed top-24 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
                  {notification}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">All Events</h1>
            <p className="text-center text-white/60 mb-12">Browse and register for arts and sports events.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-center">
                <div className="md:col-span-2">
                    <Input 
                        type="text"
                        placeholder="Search by event name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex justify-center md:justify-end space-x-2">
                    <button 
                        onClick={() => setCategoryFilter('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${categoryFilter === 'all' ? 'bg-brand-amber text-brand-dark' : 'bg-white/10 text-white'}`}
                    >
                        All
                    </button>
                    <button 
                        onClick={() => setCategoryFilter(EventCategory.ARTS)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${categoryFilter === EventCategory.ARTS ? 'bg-brand-amber text-brand-dark' : 'bg-white/10 text-white'}`}
                    >
                        Arts
                    </button>
                    <button 
                        onClick={() => setCategoryFilter(EventCategory.SPORTS)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${categoryFilter === EventCategory.SPORTS ? 'bg-brand-amber text-brand-dark' : 'bg-white/10 text-white'}`}
                    >
                        Sports
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.length > 0 ? (
                    filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} onRegister={handleRegister}/>
                    ))
                ) : (
                    <p className="text-center text-white/60 md:col-span-3">No events match your criteria.</p>
                )}
            </div>
        </div>
    );
};

export default EventsPage;