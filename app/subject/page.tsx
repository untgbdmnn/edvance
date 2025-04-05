"use client"

import AppHeader from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import MainLayout from '@/layouts/main-layout'
import { SetTitle } from '@/lib/setHelmet'
import { PlusCircleIcon, RefreshCcwDot, SearchIcon } from 'lucide-react'
import * as React from 'react'
import AddSubject from './addSubject'
import EditSubject from './editSubject'
import { Subject } from '@prisma/client'
import fetchData from '@/lib/fetchData'
import EmptyData from '@/components/empty-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Spinner from '@/components/spinner'
import ActionButton from '@/components/action-button'
import Paginate from '@/components/paginate'
import RiwayatSubject from './historySubject'

export default function SubjectList() {
    const [data, setData] = React.useState<Subject[] | null>([])
    const [state, setState] = React.useState({
        search: '',
        modalAdd: false,
        modalEdit: false,
        modalHistory: false,
        loading: true,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
        subjectId: 0,
    })

    const handleCloseModal = () => {
        setState(prev => ({
            ...prev,
            modalAdd: false,
            modalEdit: false,
            modalHistory: false,
        }))
    }

    const resetState = () => {
        setData([])
        setState(prev => ({
            ...prev,
            search: '',
            loading: true,
            currentPage: 0
        }))
    }

    async function loadData() {
        setState(prev => ({ ...prev, loading: true }))
        setData(null)
        const bodyRequest = {
            filter_nama: state.search,
            page: state.currentPage + 1,
            paginate: 10,
        }
        const response = await fetchData.POST('subject/list', bodyRequest)
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

    const handlePageChange = (data: any) => {
        setState(prevState => ({
            ...prevState, currentPage: data.selected, loading: true
        }))
    }

    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Mata Pelajaran' parentPageTitle='Master Data'>
            <SetTitle pageTitle='Mata Pelajaran' />
            <AppHeader title='Daftar Mata Pelajaran' />

            <AddSubject isOpen={state.modalAdd} onOpenChange={handleCloseModal} reload={resetState} />
            <EditSubject isOpen={state.modalEdit} onOpenChange={handleCloseModal} reload={resetState} subjectId={state.subjectId} />
            <RiwayatSubject isOpen={state.modalHistory} onOpenChange={handleCloseModal} reload={resetState} subjectId={state.subjectId} />

            <div className='container'>
                <div className='p-3 w-full'>
                    <div className='flex w-full items-center justify-between'>
                        <div className='flex flex-row items-center gap-4 w-2/5'>
                            <div className='relative flex w-full items-center justify-start'>
                                <Input className='pl-9 w-full' placeholder='Cari Mata Pelajaran...' onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} value={state.search} onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        loadData()
                                    }
                                }} />
                                <SearchIcon className='absolute left-1.5' />
                            </div>
                            <Button className='cursor-pointer' onClick={resetState}><RefreshCcwDot /></Button>
                        </div>
                        <div>
                            <Button className='cursor-pointer' onClick={() => setState(prev => ({ ...prev, modalAdd: true }))}><PlusCircleIcon />Tambah</Button>
                        </div>
                    </div>
                    <div className='mt-5'>

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
                                            <TableHead>Kode</TableHead>
                                            <TableHead>Nama Mata Pelajaran</TableHead>
                                            <TableHead>Nama Guru Pengampu</TableHead>
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
                                                    <TableCell>{item.subjectCode}</TableCell>
                                                    <TableCell>{item.subjectName}</TableCell>
                                                    <TableCell>{item.teacherId ?? "Kosong"}</TableCell>
                                                    <TableCell align='right'>
                                                        <ActionButton side='left' offset={10} align='start'>
                                                            <span className='cursor-pointer' onClick={() => setState({
                                                                ...state, modalEdit: true, subjectId: item.subjectId
                                                            })}>Edit</span>
                                                            <span className='cursor-pointer' onClick={() => setState({
                                                                ...state, modalHistory: true, subjectId: item.subjectId
                                                            })}>Riwayat</span>
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
