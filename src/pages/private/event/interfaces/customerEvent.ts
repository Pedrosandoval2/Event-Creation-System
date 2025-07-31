import type { Customer } from "./event"

export interface PaymentI {
    id: number;
    amount: number;
    method: string;
    date: string;
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

export interface CreateCustomerEventFormData {
    customerId: number;
    description?: string;
    quantity: number;
    paymentsMount: number;
    paymentMethod: string;
    eventId: number;
}

