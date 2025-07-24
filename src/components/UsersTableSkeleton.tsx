import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface UsersTableSkeletonProps {
    readonly rows?: number
}

export function UsersTableSkeleton({ rows = 8 }: UsersTableSkeletonProps) {
    return (
        <div className="space-y-4">
            {/* Search and filters skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
            </div>

            {/* Table skeleton */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, index) => (
                            <TableRow key={index}>
                                {/* Nombre con avatar */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                        <div className="space-y-1">
                                            <Skeleton className="h-4 w-[100px]" />
                                            <Skeleton className="h-3 w-[140px]" />
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Email */}
                                <TableCell>
                                    <Skeleton className="h-4 w-[160px]" />
                                </TableCell>

                                {/* Rol - Badge style */}
                                <TableCell>
                                    <Skeleton className="h-6 w-[80px] rounded-full" />
                                </TableCell>

                                {/* Estado - Badge style */}
                                <TableCell>
                                    <Skeleton className="h-6 w-[70px] rounded-full" />
                                </TableCell>

                                {/* Acciones */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination skeleton */}
            <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-4 w-[200px]" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-20" />
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    )
}
