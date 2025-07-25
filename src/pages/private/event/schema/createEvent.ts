import * as yup from 'yup';

export const createEventSchema = yup.object({
    name_event: yup.string().required('Requiere un nombre'),
    description: yup.string().required('Requiere una descripción'),
    price_unit: yup.string().required('Requiere un precio unitario'),
    start_date: yup.date().required('Requiere una fecha de inicio'),
    end_date: yup.date().required('Requiere una fecha de fin'),
});