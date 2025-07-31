// Tipos de datos
export interface Event {
    id: number;
    name_event: string;
    description?: string;
    price_unit: number;
    start_date: string;
    end_date: string;
    createdAt: string;
    userCreate: string;
    totalPayments: number;
    totalQuantityCustomers: number;
    totalAmount: number;
}

export interface CreateEventFormData {
    name_event: string;
    description?: string;
    price_unit: number;
    start_date: string;
    end_date: string;
}

export interface Customer {
    id: number
    firstName: string
    lastName: string
    isMember: boolean
    phone: string
    createdAt: string
    isActive: boolean
}

export interface EventFormValuesI {
    id: number;
    data: CreateEventFormData;
}