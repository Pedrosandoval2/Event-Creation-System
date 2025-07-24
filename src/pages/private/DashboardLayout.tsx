import { SidebarInset, SidebarProvider } from '@/components'
import { AppSidebar } from '@/components/app-sidebar'

import React from 'react'

const DashboardLayout = ({ children, isActive }: { readonly children: React.ReactNode; isActive: boolean }) => {
    return (
        <>
            {
                isActive ? (
                    <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset>{children}</SidebarInset>
                    </SidebarProvider >
                )
                    : <>{children}</>
            }
        </>
    )
}

export default DashboardLayout