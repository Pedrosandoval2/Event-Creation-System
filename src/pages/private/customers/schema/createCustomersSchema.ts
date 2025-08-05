import * as yup from 'yup';
import type { CreateCustomer } from '../interfaces/customers';

export const customerSchema: yup.ObjectSchema<CreateCustomer> = yup.object().shape({
    firstName: yup.string().min(2, 'El minimo es 2 caracteres').max(100).required('El nombre es obligatorio'),
    lastName: yup.string().min(2, 'El minimo es 2 caracteres').max(100).required('El apellido es obligatorio'),
    isActive: yup.boolean().required('El estado de actividad es obligatorio'),
    isMember: yup.boolean().required('El estado de membresía es obligatorio'),
    phone: yup.number()
        .typeError('El número de teléfono debe ser numérico')
        .transform((value, originalValue) => {
            if (originalValue === '' || originalValue === undefined) return undefined;
            return Number(originalValue);
        })
        .test('len', 'El número debe tener exactamente 9 dígitos', value => value === undefined || /^\d{9}$/.test(String(value)))
        .optional(),
});
