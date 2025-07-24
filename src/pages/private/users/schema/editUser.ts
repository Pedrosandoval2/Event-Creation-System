import * as yup from 'yup';

export const editUserSchema = yup.object({
    firstName: yup.string().required('Requiere un nombre'),
    lastName: yup.string().required('Requiere un apellido'),
    email: yup.string().email('Invalid email format').required('Requiere un email'),
    role: yup.string().oneOf(['admin', 'user']).required('Requiere un rol'),
    isActive: yup.boolean().required('Requiere un estadop'),
})
