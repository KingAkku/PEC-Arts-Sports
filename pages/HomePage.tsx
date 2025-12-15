
import React, { useEffect, useState, useCallback } from 'react';
import { Event, EventType, LeaderboardData } from '../types';
import { apiService } from '../services/mockApiService';
import Button from '../components/ui/Button';
import EventCard from '../components/EventCard';
import { TrophyIcon } from '../constants';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [notification, setNotification] = useState<string | null>(null);
    const { user } = useAuth();

    const fetchLeaderboard = useCallback(async (year: number) => {
        const data = await apiService.getLeaderboard(year);
        setLeaderboardData(data);
    }, []);

    const fetchEvents = useCallback(async () => {
        const data = await apiService.getEvents();
        setEvents(data);
    }, []);

    useEffect(() => {
        fetchLeaderboard(currentYear);
        fetchEvents();
    }, [currentYear, fetchLeaderboard, fetchEvents]);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentYear(Number(e.target.value));
    };

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

    const sortedScores = leaderboardData?.scores.sort((a, b) => b.score - a.score);

    const houseColors: { [key: string]: string } = {
        Red: 'border-red-500',
        Blue: 'border-blue-500',
        Green: 'border-green-500',
        Yellow: 'border-yellow-500',
    };

    return (
        <div className="space-y-24 md:space-y-32">
            {notification && (
              <div className="fixed top-24 right-5 bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg z-50">
                  {notification}
              </div>
            )}
            
            {/* Hero Section */}
            <section className="relative h-[80vh] flex items-center justify-center text-center overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                    style={{ backgroundImage: `url(https://picsum.photos/seed/collegefest/1920/1080)`, filter: 'blur(8px)' }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-8 animate-fade-in-up">
                    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-8 md:px-16 py-12">
                        <h2 className="text-white/70 text-lg md:text-xl tracking-widest font-medium">A COLLEGE WEBSITE FOR</h2>
                        <h1 className="text-5xl md:text-8xl font-black font-serif my-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-amber to-brand-orange">
                            ARTS & SPORTS – PEC
                        </h1>
                        <p className="mt-8 text-white/60 animate-pulse">Scroll Down ↓</p>
                    </div>
                </div>
            </section>
            
            {/* House Leaderboard Section */}
            <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-4">House Leaderboard</h2>
                <div className="flex justify-center mb-8">
                     <select 
                        value={currentYear} 
                        onChange={handleYearChange}
                        className="bg-white/5 border border-white/20 rounded-md py-2 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber focus:outline-none"
                    >
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sortedScores?.map((item, index) => (
                        <div key={item.house} className={`bg-black/20 p-6 rounded-xl border-t-4 ${houseColors[item.house]} flex items-center space-x-4 shadow-lg`}>
                            <div className="text-4xl font-bold text-brand-amber">{index + 1}</div>
                            <div>
                                <h3 className="text-2xl font-semibold">{item.house} House</h3>
                                <p className="text-3xl font-bold text-white mt-1">{item.score} <span className="text-lg text-white/50">pts</span></p>
                            </div>
                            {index === 0 && <TrophyIcon className="w-10 h-10 text-brand-gold ml-auto" />}
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Events Carousel Section */}
            <section id="events" className="w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-12">Upcoming Events</h2>
                </div>
                <div className="flex overflow-x-auto space-x-8 pb-8 px-4 sm:px-6 lg:px-8 snap-x snap-mandatory scrollbar-hide">
                   {events.map(event => (
                       <EventCard key={event.id} event={event} onRegister={handleRegister} />
                   ))}
                </div>
            </section>
            
            {/* Contact Us Section */}
            <section id="contact" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                 <h2 className="text-4xl md:text-5xl font-bold font-serif text-center mb-8">Contact Us</h2>
                 <p className="text-center text-white/60 mb-12">Have questions? Feel free to reach out to us.</p>
                 <form className="space-y-6">
                    <Input id="name" name="name" type="text" label="Name" placeholder="Your Name" required />
                    <Input id="email" name="email" type="email" label="Email" placeholder="your.email@example.com" required />
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-2">Message</label>
                      <textarea id="message" name="message" rows={4} className="w-full bg-white/5 border border-white/20 rounded-md py-2 px-4 text-white placeholder-white/40 focus:ring-2 focus:ring-brand-amber focus:border-brand-amber focus:outline-none transition-colors" placeholder="Your message..." required></textarea>
                    </div>
                    <div className="text-center">
                       <Button type="submit">Send Message</Button>
                    </div>
                 </form>
            </section>
        </div>
    );
};

export default HomePage;