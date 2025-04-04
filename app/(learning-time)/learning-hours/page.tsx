import AppHeader from '@/components/app-header'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import React from 'react'

export default function page() {
    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Jam Belajar' parentPageTitle='Master Data'>
            <SetTitle pageTitle='Daftar Jam Belajar' />
            <AppHeader title='Daftar Jam Belajar' />
        </MainLayout>
    )
}
