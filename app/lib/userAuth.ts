'use client';

export type UserRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Docent' | 'Parent';

export interface MoskeeUser {
    id: string;
    username: string;
    role: UserRole;
    realName?: string;
    studentId?: string; // For parents
}

export const getSession = (): MoskeeUser | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('moskee_user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('moskee_user');
    window.location.href = '/login';
};

export const isAdmin = (user: MoskeeUser | null): boolean => {
    return user?.role === 'Super Admin' || user?.role === 'Admin';
};

export const isDocent = (user: MoskeeUser | null): boolean => {
    return user?.role === 'Docent';
};

export const isParent = (user: MoskeeUser | null): boolean => {
    return user?.role === 'Parent';
};
