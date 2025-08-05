
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
    Button,
    Input,
    Label,
} from '@/components'
import type { CreateUserI, UserFormValuesI } from '@/pages/private/users/interfaces/user';

import { editUser } from '@/services/users/updateUser';
import { useAuthStore } from '@/store/authStore';
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify';

interface ProfileFormProps {
    id: string;
    data: UserFormValuesI['data'];
}

export const ProfileForm = ({ id, data }: ProfileFormProps) => {

    const updateSetUser = useAuthStore((state) => state.updateSetUser);

    const { register, handleSubmit } = useForm<CreateUserI>({
        defaultValues: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            isActive: data.isActive || false,
            role: data.role || 'user',
        }
    });

    const onSubmit = async (data: CreateUserI) => {
        try {
            const response = await editUser({ id, payload: data });
            if (response.status === 200) {
                updateSetUser({ firstName: data.firstName, lastName: data.lastName, email: data.email }); // Update the user in the store
                toast.success("Perfil actualizado correctamente.");
            } else {
                toast.error("Error al actualizar el perfil.");
            }

        } catch (error) {
            console.error("Error submitting profile form:", error);
            toast.error("Error al actualizar el perfil.");
            throw new Error("Failed to update profile");
        }
    }



    return (
        <Card>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" defaultValue="John" {...register('firstName')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" defaultValue="Doe" {...register('lastName')} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john@example.com" {...register('email')} />
                    </div>
                    <Button>Save Changes</Button>
                </CardContent>
            </form>
        </Card>
    )
}
