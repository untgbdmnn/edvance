"use client"

import AppHeader from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import { PlusCircleIcon, RefreshCcwDot, SearchIcon } from 'lucide-react'
import * as React from 'react'
import TambahKelas from './tambahKelas'
import { Grade } from '@prisma/client'
import fetchData from '@/lib/fetchData'
import EmptyData from '@/components/empty-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/spinner'
import ActionButton from '@/components/action-button'
import Paginate from '@/components/paginate'
import EditKelas from './editKelas'

export default function GradeList() {
    const [data, setData] = React.useState<Grade[] | null>(null)
    const [state, setState] = React.useState({
        search: '',
        loading: true,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
        classId: 0,
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

    const refreshState = () => {
        setState(prevState => ({
            ...prevState,
            loading: true,
            currentPage: 0,
        }))
        setData(null)
    }

    const loadData = async () => {
        setState({ ...state, loading: true })
        setData(null)
        const bodyRequest = {
            filter_nama: state.search,
            page: state.currentPage + 1,
            paginate: 10,
        }
        const response = await fetchData.POST('grade/list', bodyRequest)
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
    }, [state.loading])

    const handlePageChange = (data: string) => { }
    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Kelas' parentPageTitle='Master Data'>
            <SetTitle pageTitle='Daftar Kelas' />
            <AppHeader title='Daftar Kelas' />

            <TambahKelas isOpen={state.modalAdd} onOpenChange={handleCloseModal} reload={refreshState} />
            <EditKelas isOpen={state.modalEdit} onOpenChange={handleCloseModal} reload={refreshState} classId={state.classId} />

            <div className='container'>
                <div className='p-3 w-full'>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='flex flex-row items-center gap-4 w-2/5'>
                            <div className='relative flex w-full items-center justify-start'>
                                <Input className='pl-9 w-full' placeholder='Cari kelas...' onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} value={state.search} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        loadData()
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
                    <div className='mt-5 w-full'>
                        {!state.loading && (data === null || data!.length === 0) ? (
                            <div>
                                <EmptyData />
                            </div>
                        ) : (
                            <div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead align='center' className='text-center'>Level/Jurusan</TableHead>
                                            <TableHead className='text-center'>Wali Kelas</TableHead>
                                            <TableHead className='text-end'>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {state.loading && (
                                            <TableRow>
                                                <TableCell colSpan={12}>
                                                    <Spinner className='my-7' label='Loading...' />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {data?.map((item, index) => {
                                            return (
                                                <TableRow key={index}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell align='center'>{item.level}/{item?.level}</TableCell>
                                                    <TableCell align='center'>-</TableCell>
                                                    <TableCell align="right">
                                                        <ActionButton side='left'>
                                                            <span className='cursor-pointer' onClick={() => setState(prev => ({ ...prev, modalEdit: true, classId: item.gradeId }))}>Edit</span>
                                                            <span className='cursor-pointer text-destructive'>Hapus</span>
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
