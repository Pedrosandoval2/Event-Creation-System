import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserAuthI } from './authStoreI';

type AuthStore = {
    user: UserAuthI | null;
    setUser: (user: UserAuthI | null) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: UserAuthI | null) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)