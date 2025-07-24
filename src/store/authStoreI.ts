export interface UserAuthI {
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    email: string;
    iat: number;
    exp: number;
    accessToken: string;
}


export interface AuthStoreILocalStorage {
    state: {
        user: UserAuthI | null;
    }
}
