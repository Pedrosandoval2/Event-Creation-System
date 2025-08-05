import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthStoreI, UserAuthI } from './authStoreI';

type AuthStore = {
    user: UserAuthI | AuthStoreI | null;
    setUser: (user: Partial<UserAuthI>) => void;
    updateSetUser: (user: Partial<UserAuthI>) => void;
    clearUser: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (partialUser: Partial<UserAuthI>) => {
                return set({ user: { ...partialUser } as UserAuthI });
            },
            updateSetUser: (partialUser: Partial<UserAuthI>) => {
                return set((state) => ({
                    user: { ...state.user, ...partialUser } as UserAuthI
                }));
            },
            clearUser: () => set({ user: null }),
        }),
        {
            name: 'user', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
)