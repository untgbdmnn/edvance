"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import moment from "moment"

interface MainLayoutProps {
    children: React.ReactNode
    showBreadcrumb?: boolean
    pageTitle?: string
    parentPageTitle?: string
    parentPageUrl?: string
}

export default function MainLayout({ children, showBreadcrumb, pageTitle, parentPageTitle, parentPageUrl }: MainLayoutProps) {
    moment.locale('id')
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-sidebar">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-[orientation=vertical]:h-4"
                        />
                        {showBreadcrumb && (
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">
                                            Beranda
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {pageTitle && (<BreadcrumbSeparator className="hidden md:block" />)}
                                    {parentPageTitle && (
                                        <>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href={parentPageUrl}>
                                                    {parentPageTitle}
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            <BreadcrumbSeparator className="hidden md:block" />
                                        </>
                                    )}
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        )}
                    </div>
                </header>
                <div className="flex flex-1 flex-col p-4 pt-4 dark:bg-neutral-800 bg-gray-200">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
