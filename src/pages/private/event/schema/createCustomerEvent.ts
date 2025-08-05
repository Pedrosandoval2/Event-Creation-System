import * as yup from 'yup';
import type { CreateCustomerEventFormData } from '../interfaces/customerEvent';

export const eventPaymentSchema = (
    price_event: number
): yup.ObjectSchema<CreateCustomerEventFormData> =>
    yup.object({
        customerId: yup
            .number()
            .typeError('Debe ser un número')
            .required('El ID del cliente es obligatorio')
            .min(1, 'Escoge un cliente válido'),

        description: yup.string().optional(),

        quantity: yup
            .number()
            .typeError('Debe ser un número')
            .required('La cantidad es obligatoria')
            .min(1, 'La cantidad debe ser al menos 1'),

        payments: yup
            .array()
            .of(
                yup.object().shape({
                    method: yup.string().required('El método de pago es obligatorio'),
                    amount: yup
                        .number()
                        .typeError('Debe ser un número')
                        .required('El monto es obligatorio')
                        .min(1, 'El monto debe ser mayor a 0'),
                })
            )
            .required('Debes agregar al menos un método de pago') // <- ESTA LÍNEA ES CLAVE
            .min(1, 'Debe haber al menos un método de pago')
            .max(3, 'No puedes agregar más de 3 métodos de pago')
            .test(
                'suma-valida',
                'La suma de los pagos no puede superar el total',
                function (payments) {
                    const quantity = this.parent.quantity;
                    const maxTotal = quantity * price_event;
                    const total = (payments || []).reduce((acc, p) => acc + (p.amount || 0), 0);
                    return total <= maxTotal;
                }
            )
            .test(
                'sin-duplicados',
                'No puedes repetir métodos de pago',
                (payments = []) => {
                    const methods = payments.map((p) => p.method);
                    return new Set(methods).size === methods.length;
                }
            ),

        eventId: yup
            .number()
            .typeError('Debe ser un número')
            .required('El ID del evento es obligatorio'),
    });
