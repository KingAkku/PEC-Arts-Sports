
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { WEBSITE_TITLE } from '../../constants';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Events', path: '/events' },
        { name: 'About', path: '/about' },
    ];
    
    return (
        <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold font-serif text-brand-amber">
                            {WEBSITE_TITLE}
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {user && navLinks.map((link) => (
                                <Link key={link.name} to={link.path} className="text-white/80 hover:text-brand-amber px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center space-x-4">
                               <Link to="/dashboard" className="flex items-center space-x-3 group">
                                    <img 
                                        src={user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} 
                                        alt="User"
                                        className="h-9 w-9 rounded-full object-cover border-2 border-white/20 group-hover:border-brand-amber transition-colors"
                                    />
                                   <span className="text-white/70 text-sm group-hover:text-white transition-colors">Welcome, {user.name}</span>
                               </Link>
                               <Button onClick={handleLogout} variant="secondary" size="sm">Logout</Button>
                            </div>
                        ) : (
                           <div className="flex items-center space-x-2">
                            <Button onClick={() => navigate('/auth')} variant="primary" size="sm">Login</Button>
                           </div>
                        )}
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            {!isMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && user && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path} className="text-gray-300 hover:text-brand-amber block px-3 py-2 rounded-md text-base font-medium transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-gray-700">
                        <div className="flex items-center px-5">
                             <Link to="/dashboard" className="flex items-center space-x-3 group">
                                <img 
                                    src={user.profilePictureUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} 
                                    alt="User"
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                    <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                </div>
                            </Link>
                        </div>
                        <div className="mt-3 px-2 space-y-1">
                            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;