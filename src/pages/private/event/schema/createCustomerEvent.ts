import type { CreateCustomerEventFormData } from '../interfaces/customerEvent';
import * as yup from 'yup';

export const eventPaymentSchema = (
    price_event: number
): yup.ObjectSchema<CreateCustomerEventFormData> =>
    yup.object({
        customerId: yup
            .number()
            .typeError('Debe ser un número')
            .required('El ID del cliente es obligatorio'),

        description: yup.string().optional(),

        quantity: yup
            .number()
            .typeError('Debe ser un número')
            .required('La cantidad es obligatoria')
            .min(1, 'La cantidad debe ser al menos 1'),

        paymentsMount: yup
            .number()
            .typeError('Debe ser un número')
            .required('El monto es obligatorio')
            .test(
                'max-total',
                `El monto no puede ser mayor que el total`,
                function (value) {
                    const { quantity } = this.parent;
                    if (typeof value !== 'number' || typeof quantity !== 'number') return true;
                    const maxTotal = quantity * price_event;
                    return value <= maxTotal;
                }),
        paymentMethod: yup
            .string()
            .required('El método de pago es obligatorio'),

        eventId: yup
            .number()
            .typeError('Debe ser un número')
            .required('El ID del evento es obligatorio'),
    });
