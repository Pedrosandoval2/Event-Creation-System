import * as yup from 'yup';
import type { CreateEventFormData } from '../interfaces/event';


export const createEventSchema: yup.ObjectSchema<CreateEventFormData> = yup.object({
    name_event: yup.string().required('Requiere un nombre'),
    description: yup.string().optional(),
    price_unit: yup.number().required('Requiere un precio unitario'),

    start_date: yup
        .string()
        .required('Requiere una fecha de inicio')
        .test('no-past', 'La fecha no puede ser menor', (value) => {
            if (!value) return false;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const input = new Date(value);
            input.setHours(0, 0, 0, 0);
            return input >= today;
        }),

    end_date: yup
        .string()
        .required('Requiere una fecha de fin')
        .when('start_date', ([start], schema) =>  // ← OJO aquí
            schema.test(
                'end-after-start',
                'Debe ser posterior o igual a la fecha de inicio',
                (end) => {
                    if (!start || !end) return false;
                    return new Date(end) >= new Date(start);
                }
            )
        ),
});

export type CreateEventSchemaType = yup.InferType<typeof createEventSchema>;