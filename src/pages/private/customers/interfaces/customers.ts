
export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    isActive: boolean;
    isMember: boolean;
}

export type CreateCustomer = Omit<Customer, 'id' | 'createdAt'>;