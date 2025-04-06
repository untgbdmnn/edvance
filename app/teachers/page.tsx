"use client"

import ActionButton from '@/components/action-button'
import AppHeader from '@/components/app-header'
import EmptyData from '@/components/empty-data'
import MoreButtonAction from '@/components/more-option'
import Paginate from '@/components/paginate'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import { Teacher } from '@prisma/client'
import { PlusCircleIcon, RefreshCcwDot, SearchIcon } from 'lucide-react'
import * as React from 'react'
import AddTeacher from './addTeacher'
import fetchData from '@/lib/fetchData'

export default function DaftarGuru() {
    const [data, setData] = React.useState<Teacher[]>([])
    const [state, setState] = React.useState({
        search: '',
        modalAdd: false,
        modalEdit: false,
        modalHistory: false,
        modalTrash: false,
        loading: true,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
        teacherId: 0,
    })

    const handleCloseModal = () => {
        setState(prev => ({
            ...prev,
            modalAdd: false,
            modalEdit: false,
            modalHistory: false,
            modalTrash: false,
        }))
    }

    const loadData = async () => {
        setState(prev => ({ ...prev, loading: true }))
        setData([])
        const bodyRequest = {
            filter_nama: state.search,
            page: state.currentPage + 1,
            paginate: 10,
        }
        const response = await fetchData.POST('teacher/list', bodyRequest)
        if (response.success) {
            setData(response.data.data)
            setState(prev => ({
                ...prev,
                perPage: response.data.per_page,
                totalData: response.data.total,
                lastPage: response.data.lastPage,
                loading: false,
            }))
        }
    }

    React.useEffect(() => {
        if (state.loading) {
            loadData()
        }
    }, [state.loading, state.currentPage])

    const resetState = () => {
        setState(prev => ({
            ...prev,
            loading: true,
            currentPage: 0,
            search: '',
        }))
        setData([])
    }

    const handleDelete = async (id: number) => {

    }

    const handlePageChange = (page: any) => {
        setState(prev => ({
            ...prev, loading: true, currentPage: page.selected
        }))
    }
    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Guru' parentPageTitle='Guru'>
            <SetTitle pageTitle='Daftar Guru' />
            <AppHeader title='Daftar Guru' />

            <AddTeacher isOpen={state.modalAdd} onOpenChange={handleCloseModal} reload={resetState} />

            <div className="container">
                <div className='p-3 w-full'>

                    <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-row items-center gap-4 w-2/5'>
                            <div className='relative flex w-full items-center justify-start'>
                                <Input className='pl-9 w-full' placeholder='Cari Nama Guru...' onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} value={state.search} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        loadData()
                                    }
                                }} />
                                <SearchIcon className='absolute left-1.5' />
                            </div>
                            <Button className='cursor-pointer' onClick={resetState}><RefreshCcwDot /></Button>
                        </div>
                        <div className='flex items-center gap-3'>
                            <Button className='cursor-pointer' onClick={() => setState(prev => ({ ...prev, modalAdd: true }))}><PlusCircleIcon />Tambah</Button>
                            <MoreButtonAction align='end'>
                                <span className='cursor-pointer' onClick={() => setState(prev => ({
                                    ...prev, modalTrash: true
                                }))}>Trash Guru</span>
                            </MoreButtonAction>
                        </div>
                    </div>

                    <div>
                        {!state.loading && data?.length === 0 ? (
                            <div>
                                <EmptyData />
                            </div>
                        ) : (
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Nama Guru</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Nomor Telepon</TableHead>
                                            <TableHead>Alamat</TableHead>
                                            <TableHead className='text-end'>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {state.loading && (
                                            <TableRow>
                                                <TableCell colSpan={12}>
                                                    <Spinner className='my-6' />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {data && data.map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.email}</TableCell>
                                                    <TableCell>{item.phone}</TableCell>
                                                    <TableCell>{item.address}</TableCell>
                                                    <TableCell align='right'>
                                                        <ActionButton side='left' offset={10} align='start'>
                                                            <span className='cursor-pointer' onClick={() => setState({
                                                                ...state, modalEdit: true, teacherId: item.teacherId
                                                            })}>Edit</span>
                                                            <span className='cursor-pointer' onClick={() => setState({
                                                                ...state, modalHistory: true, teacherId: item.teacherId
                                                            })}>Riwayat</span>
                                                            <span className='cursor-pointer text-destructive' onClick={() => handleDelete(item.teacherId)}>Hapus</span>
                                                        </ActionButton>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        <div className='mt-5'>
                            <Paginate pageCount={state.lastPage} onPageChange={handlePageChange} onPage={data ? data.length : 0} totalData={state.totalData} />
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}
