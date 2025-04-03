"use client"

import ActionButton from '@/components/action-button'
import AppHeader from '@/components/app-header'
import EmptyData from '@/components/empty-data'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MainLayout from '@/layouts/main-layout'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import { cn } from '@/lib/utils'
import { Student } from '@prisma/client'
import { PlusCircleIcon, RefreshCcw, SearchIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

export default function StudentList() {
    const [data, setData] = React.useState<Student[] | null>(null)
    const [state, setState] = React.useState({
        search: '',
        loading: true,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
        studentId: 0,
    })

    const loadSiswa = async () => {
        setState({ ...state, loading: true })
        setData(null)
        const bodyRequest = {
            filter_nama: state.search,
            page: state.currentPage + 1,
            paginate: 10,
        }
        const response = await fetchData.POST('student/list', bodyRequest)
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

    const changeStatus = async (studentId: number) => {
        const response = await fetchData.PATCH('student/change-status', { studentId: studentId })
        if (response.success) {
            toast.success("Berhasil!", {
                description: response.message,
            })
            setState(prev => ({ ...prev, loading: true }))
        } else {
            toast.error("Gagal!", {
                description: response.message,
            })
        }
    }

    React.useEffect(() => {
        if (state.loading) {
            loadSiswa()
        }
    }, [state.loading])

    return (
        <MainLayout showBreadcrumb pageTitle='Daftar Siswa' parentPageTitle='Siswa'>
            <SetTitle pageTitle='Daftar Siswa' />
            <AppHeader title='Daftar Siswa' className='' />

            <div className='container'>
                <div className='p-3 flex flex-row items-center justify-between w-full'>
                    <div className='flex flex-row items-center gap-4 w-2/5'>
                        <div className='relative flex w-full items-center justify-start'>
                            <Input className='pl-9 w-full' placeholder='Cari nama siswa...' onChange={(e) => setState(prev => ({ ...prev, search: e.target.value }))} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // do something
                                }
                            }} />
                            <SearchIcon className='absolute left-1.5' />
                        </div>
                        <Button><RefreshCcw /></Button>
                    </div>
                    <div className=''>
                        <Button className='cursor-pointer' onClick={() => redirect('students-list/new-student')}><PlusCircleIcon />Tambah</Button>
                    </div>
                </div>

                <div className='p-3'>
                    {!state.loading && data === null ? (
                        <EmptyData />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>NISN</TableHead>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>Nama Siswa</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead align='center' className='text-center'>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {state.loading && (
                                    <TableRow>
                                        <TableCell colSpan={12}>
                                            <Spinner color='auto' className='my-5 py-2' />
                                        </TableCell>
                                    </TableRow>
                                )}
                                {data && data.map((student, index) => {
                                    const studentNew = student.siswa_status !== 'ACTIVE';
                                    return (
                                        <TableRow key={index} className={cn(studentNew ? 'bg-destructive/70 hover:bg-destructive/50 text-white' : "")}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                <div>
                                                    {student.siswa_status !== 'ACTIVE' && (
                                                        <span className='text-xs rounded-sm bg-red-600 px-2'>{student.siswa_status}</span>
                                                    )}
                                                    <h1>{student.siswa_nama}</h1>
                                                </div>
                                            </TableCell>
                                            <TableCell>{student.siswa_nis}</TableCell>
                                            <TableCell>{student.siswa_nisn}</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell align='center'>
                                                <ActionButton side='top' offset={3}>
                                                    {student.siswa_status !== 'ACTIVE' && (
                                                        <span className='cursor-pointer' onClick={() => changeStatus(student.studentId)}>Aktifkan</span>
                                                    )}
                                                    <span className='cursor-pointer text-destructive'>Hapus</span>
                                                </ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
