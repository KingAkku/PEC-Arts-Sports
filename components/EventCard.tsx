
import React, { useState, useEffect } from 'react';
import { Event, EventType, RegistrationStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/mockApiService';
import Card from './ui/Card';
import Button from './ui/Button';
import { CalendarIcon, CheckCircleIcon, ClockIcon } from '../constants';

interface EventCardProps {
    event: Event;
    onRegister: (eventId: string, eventType: EventType) => Promise<void>;
}

const EventCard: React.FC<EventCardProps> = ({ event, onRegister }) => {
    const { user } = useAuth();
    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchStatus = async () => {
            if (user) {
                const status = await apiService.getRegistrationStatus(event.id, user.id);
                setRegistrationStatus(status);
            }
        };
        fetchStatus();
    }, [event.id, user]);

    const handleRegistration = async () => {
        setIsLoading(true);
        await onRegister(event.id, event.eventType);
        // Refetch status after action
        if (user) {
            const status = await apiService.getRegistrationStatus(event.id, user.id);
            setRegistrationStatus(status);
        }
        setIsLoading(false);
    };
    
    const getStatusBadge = () => {
        if (!registrationStatus) return null;

        const baseClasses = "absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5";
        switch (registrationStatus) {
            case RegistrationStatus.REGISTERED:
            case RegistrationStatus.APPROVED:
                return <div className={`${baseClasses} bg-green-500/20 text-green-300`}><CheckCircleIcon className="w-4 h-4" /> Approved</div>;
            case RegistrationStatus.PENDING:
                return <div className={`${baseClasses} bg-yellow-500/20 text-yellow-300`}><ClockIcon className="w-4 h-4" /> Pending</div>;
            case RegistrationStatus.REJECTED:
                return <div className={`${baseClasses} bg-red-500/20 text-red-300`}>Rejected</div>;
            default:
                return null;
        }
    };

    return (
        <Card className="flex-shrink-0 w-80 md:w-96 snap-center overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 relative">
            <div className="p-6 flex flex-col h-full">
                {getStatusBadge()}
                <div className="flex-grow">
                    <span className={`text-sm font-semibold ${event.category === 'Arts' ? 'text-brand-orange' : 'text-blue-400'}`}>{event.category}</span>
                    <h3 className="text-2xl font-bold font-serif text-brand-amber mt-2 mb-3">{event.name}</h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-white/50 mb-4">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>{event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>
                <div className="mt-auto pt-4 border-t border-white/10">
                     <div className="flex justify-between items-center">
                       <span className={`px-3 py-1 text-xs font-medium rounded-full ${event.eventType === EventType.NORMAL ? 'bg-cyan-500/20 text-cyan-300' : 'bg-purple-500/20 text-purple-300'}`}>
                           {event.eventType}
                       </span>
                       <Button 
                           onClick={handleRegistration} 
                           size="sm" 
                           variant="secondary"
                           disabled={!!registrationStatus || isLoading}
                           isLoading={isLoading}
                        >
                           {registrationStatus ? 'Registered' : (event.eventType === EventType.NORMAL ? 'Register' : 'Request')}
                       </Button>
                   </div>
                </div>
            </div>
        </Card>
    );
};

export default EventCard;