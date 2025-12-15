
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/mockApiService';

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<User | null>;
    logout: () => void;
    loading: boolean;
    updateUserProfilePicture: (imageUrl: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to load user from session storage to persist login
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            const loggedInUser = await apiService.login(email, pass);
            if (loggedInUser) {
                setUser(loggedInUser);
                sessionStorage.setItem('user', JSON.stringify(loggedInUser));
            }
            return loggedInUser;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };
    
    const updateUserProfilePicture = async (imageUrl: string) => {
        if (!user) return;
        try {
            const updatedUser = await apiService.updateProfilePicture(user.id, imageUrl);
            if(updatedUser) {
                setUser(updatedUser);
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Failed to update profile picture", error);
        }
    };


    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUserProfilePicture }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};