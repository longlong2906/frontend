"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import API_BASE from '../config';

interface User {
    username: string;
    fullName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
    favorites: number[];
    toggleFavorite: (movieId: number) => Promise<void>;
    removeFavorite: (movieId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchFavorites = async (currentToken: string) => {
        try {
            const res = await fetch(`${API_BASE}/user/favorites/ids`, {
                headers: { 'Authorization': `Bearer ${currentToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFavorites(data.favorites);
            }
        } catch (e) {
            console.error("Failed to fetch favorites", e);
        }
    };

    useEffect(() => {
        // Check local storage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data:", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (token) {
            fetchFavorites(token);
        } else {
            setFavorites([]);
        }
    }, [token]);

    const login = (newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setFavorites([]);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    const toggleFavorite = async (movieId: number) => {
        if (!token) return;

        // Optimistic update
        const isFav = favorites.includes(movieId);
        const newFavs = isFav ? favorites.filter(id => id !== movieId) : [...favorites, movieId];
        setFavorites(newFavs);

        try {
            const res = await fetch(`${API_BASE}/user/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ movieId }) // Default toggle
            });

            if (!res.ok) {
                fetchFavorites(token);
            }
        } catch (e) {
            console.error("Error toggling favorite", e);
            fetchFavorites(token);
        }
    };

    const removeFavorite = async (movieId: number) => {
        if (!token) return;

        // Optimistic Remove
        const newFavs = favorites.filter(id => id !== movieId);
        setFavorites(newFavs);

        try {
            await fetch(`${API_BASE}/user/favorites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ movieId, action: 'remove' })
            });
        } catch (e) {
            console.error("Error removing favorite", e);
            fetchFavorites(token);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            isLoading,
            favorites,
            toggleFavorite,
            removeFavorite
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
