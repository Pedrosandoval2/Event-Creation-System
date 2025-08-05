
import { Camera } from "lucide-react"
import {
    ThemeToggle,
    SidebarTrigger,
    Separator,
    Card,
    CardContent,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Badge
} from "@/components"
import { useAuthStore } from "@/store/authStore"
import { getFullName, getInitials } from "@/utils/formatName"
import { ProfileForm } from "@/components/profile/ProfileForm"

export default function ProfilePage() {

    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <div className="p-4">Loading...</div>
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">Profile</h1>
                <div className="ml-auto">
                    <ThemeToggle />
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid gap-6 mt-4">
                    {/* Profile Header */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative">
                                    <Avatar className="h-24 w-24">
                                        <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile" />
                                        <AvatarFallback>{getInitials(user)}</AvatarFallback>
                                    </Avatar>
                                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl font-bold">{getFullName(user)}</h2>
                                    <p className="text-muted-foreground">Usuario</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Badge variant="secondary">{user.role}</Badge>
                                        <Badge variant="outline">{user.isActive ? "Activo" : "Inactivo"}</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-6">
                        {/* Personal Information */}
                        <ProfileForm id={user.id} data={user} />
                    </div>
                </div>
            </div>
        </>
    )
}
