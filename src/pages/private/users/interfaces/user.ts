export interface UserI {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    isActive: boolean;
}

export type CreateUserI = Omit<UserI, 'id'>;

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

export type Role = 'admin' | 'user';