
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { WEBSITE_TITLE } from '../constants';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        if (isLogin) {
            try {
                const user = await login(email, password);
                if (user) {
                    navigate('/');
                } else {
                    setError('Invalid email or password.');
                }
            } catch (err: any) {
                setError(err.message || 'An unexpected error occurred.');
            }
        } else {
            // Sign-up logic would go here. For this demo, it's mocked.
            setError('Sign up is not implemented in this demo.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark px-4 sm:px-6 lg:px-8"
             style={{backgroundImage: 'radial-gradient(circle at top, rgba(255, 191, 0, 0.1), transparent 50%)'}}>
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="text-center text-4xl font-bold font-serif text-brand-amber">{WEBSITE_TITLE}</h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>
                <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-8 space-y-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <Input
                                id="name"
                                label="Full Name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                            />
                        )}
                        <Input
                            id="email-address"
                            label="Email address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@pec.ac.in"
                        />
                        <Input
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                        
                        {error && <p className="text-sm text-red-400">{error}</p>}
                        
                        <div>
                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                    <div className="text-sm text-center">
                        <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-brand-amber hover:text-amber-400">
                            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;