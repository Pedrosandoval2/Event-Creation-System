import type { Customer } from "../../customers/interfaces/customers";

export interface PaymentI {
    id: number;
    amount: number;
    method: string;
    createdAt: string;
}

export interface EventCustomer {
    id: number;
    customer: Customer;
    event: {
        id: number;
        title: string;
    };
    description: string;
    payments: PaymentI[];
    createdAt: string;
    isActive: boolean;
    quantity: number;
    total_price: number;
}

export interface Payment {
    amount: number;
    method: string;
}
export interface CustomerEvent {
    id: number;
    firstName: string;
    lastName: string;
}

export interface CreateCustomer {
    customer: Customer;
    description?: string;
    quantity: number;
    payments: Payment[];
    eventId: number;
}

export interface CreateCustomerEventFormData {
    customerId: number;
    description?: string;
    quantity: number;
    payments: Payment[];
    eventId: number;
}