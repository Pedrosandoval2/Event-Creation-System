import type { Role } from "@/pages/private/users/interfaces/user";

export interface UserAuthI {
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
    email: string;
    accessToken: string;
}

export interface AuthStoreI { id: string; firstName: string; lastName: string; email: string; role: Role; isActive: boolean; accessToken: string; }

export interface AuthStoreILocalStorage {
    state: {
        user: UserAuthI | null;
    }
}
