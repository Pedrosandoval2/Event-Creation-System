// Tipos de datos
export interface Event {
    id: number;
    name_event: string;
    description?: string;
    price_unit: string;
    start_date: string;
    end_date: string;
    createdAt: string;
    userCreate: string;
    totalPayments: number;
    totalQuantityCustomers: number;
    totalAmount: string;
}

export interface CreateEventFormData {
    name_event: string;
    description: string;
    price_unit: string;
    start_date: Date;
    end_date: Date;
}

export interface Customer {
    id: number
    name: string
}

export interface EventCustomer {
    id: number
    customer: Customer
    event: {
        id: number
        title: string
    }
    description: string
    payments: Array<{
        id: number
        amount: number
        method: string
        date: string
    }>
    createdAt: string
    isActive: boolean
    quantity: number
    total_price: number
}