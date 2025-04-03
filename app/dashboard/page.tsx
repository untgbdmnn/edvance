"use client"

import AppHeader from '@/components/app-header'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import React from 'react'

export default function DashboardPage() {
  return (
    <MainLayout>
      <SetTitle pageTitle='Dashboard' />
      <AppHeader title='Selamat Datang Kembali, Admin!'/>
      <div></div>
    </MainLayout>
  )
}
