
interface User {
    firstName: string;
    lastName: string;
}

export const getFullName = (user: User) => {
    if (!user) return "";
    return `${user.firstName} ${user.lastName}`.trim()
}

export const getInitials = (user: User) => {
    if (!user) return "";
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
}