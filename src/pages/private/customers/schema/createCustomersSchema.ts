import * as yup from 'yup';
import type { CreateCustomer } from '../interfaces/customers';

export const customerSchema: yup.ObjectSchema<CreateCustomer> = yup.object().shape({
    firstName: yup.string().min(2).max(100).required('El nombre es obligatorio'),
    lastName: yup.string().min(2).max(100).required('El apellido es obligatorio'),
    isActive: yup.boolean().required('El estado de actividad es obligatorio'),
    isMember: yup.boolean().required('El estado de membresía es obligatorio'),
    phone: yup.string().min(9).max(15).required('El teléfono es obligatorio'),
});
