"use client"

import AppHeader from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import { PlusCircleIcon, RefreshCcwDot, SearchIcon } from 'lucide-react'
import * as React from 'react'
import AddSubject from './addSubject'

export default function SubjectList() {
    const [state, setState] = React.useState({
        search: '',
        modalAdd: false,
        modalEdit: false,
    })

    const handleCloseModal = () => {
        setState(prev => ({
            ...prev,
            modalAdd: false,
            modalEdit: false,
        }))
    }

    const resetState = () => {
        setState(prev => ({
            ...prev,
            search: '',
        }))
    }

    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Mata Pelajaran' parentPageTitle='Master Data'>
            <SetTitle pageTitle='Mata Pelajaran' />
            <AppHeader title='Daftar Mata Pelajaran' />

            <AddSubject isOpen={state.modalAdd} onOpenChange={handleCloseModal} reload={resetState} />

            <div className='container'>
                <div className='p-3 w-full'>
                    <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-row items-center gap-4 w-2/5'>
                            <div className='relative flex w-full items-center justify-start'>
                                <Input className='pl-9 w-full' placeholder='Cari Mata Pelajaran...' onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} value={state.search} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        // loadData()
                                    }
                                }} />
                                <SearchIcon className='absolute left-1.5' />
                            </div>
                            <Button className='cursor-pointer'><RefreshCcwDot /></Button>
                        </div>
                        <div>
                            <Button className='cursor-pointer' onClick={() => setState(prev => ({ ...prev, modalAdd: true }))}><PlusCircleIcon />Tambah</Button>
                        </div>
                    </div>
                    <div></div>
                </div>
            </div>
        </MainLayout>
    )
}
