export interface UserI {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
}

export interface UserFormValuesI {
    id: string;
    data: {
        firstName: string;
        lastName: string;
        email: string;
        role: Role;
        isActive: boolean;
    };
}

export interface UserEditFormValuesI {
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    isActive: boolean;
}

type Role = 'admin' | 'user';