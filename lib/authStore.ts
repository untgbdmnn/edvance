import { create } from 'zustand';
import { persist, PersistStorage, StorageValue } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User } from '@prisma/client';

interface AuthState {
    token: string | null;
    user: User | null;
    setAuth: (token: string, user: User) => void,
    clearAuth: () => void;
}

const customStorage: PersistStorage<Pick<AuthState, 'token' | 'user'>> = {
    getItem: (name: string): StorageValue<Pick<AuthState, 'token' | 'user'>> | null => {
        const item = Cookies.get(name);
        return item ? JSON.parse(item) : null;
    },
    setItem: (name: string, value: StorageValue<Pick<AuthState, 'token' | 'user'>>) => {
        Cookies.set(name, JSON.stringify(value), { expires: 3 });
    },
    removeItem: (name: string) => {
        Cookies.remove(name);
    },
};

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            setAuth: (token: string, user: User) => set({ token, user: user }),
            clearAuth: () => {
                customStorage.removeItem('edvance-auth');
                set({ token: null, user: null });
            },
        }),
        {
            name: 'edvance-auth',
            storage: customStorage,
        }
    )
);

export default useAuthStore;
