"use client"

import AppHeader from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import MainLayout from '@/layouts/main-layout'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import { redirect, useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

export default function NewStudentPage() {
    const router = useRouter()
    const [form, setForm] = React.useState({
        nama_siswa: '',
        nisn_siswa: '',
        nis_siswa: "",
        siswa_email: '',
        siswa_phone: '',
        jenis_kelamin: 'LAKI_LAKI',
        alamat: '',
    })

    const [state, setState] = React.useState({
        loading: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const onSubmitData = async () => {
        setState(prev => ({ ...prev, loading: true }))
        const response = await fetchData.POST('student/add-new', form)
        if (response.success) {
            toast.success("Berhasil!", {
                description: response.message
            })
            setForm(prev => ({
                ...prev,
                nama_siswa: '',
                nisn_siswa: '',
                nis_siswa: "",
                siswa_email: '',
                siswa_phone: '',
                jenis_kelamin: 'LAKI_LAKI',
                alamat: '',
            }))
            redirect('/students-list')
        } else {
            toast.error("Gagal!", {
                description: response.message
            })
        }
        setState(prev => ({ ...prev, loading: false }))
    }

    return (
        <MainLayout showBreadcrumb pageTitle='Tambah Siswa' parentPageTitle='Daftar Siswa' parentPageUrl='/students-list'>
            <SetTitle pageTitle='Tambah Siswa' />
            <AppHeader title='Tambah Siswa' className='' />

            <div className='container'>
                <div className='p-3 w-full'>
                    <div className='space-y-3 space-x-3 grid grid-cols-4'>
                        <div className='form-group col-span-2'>
                            <Label htmlFor='nama_siswa'>Nama Siswa</Label>
                            <Input name='nama_siswa' id='nama_siswa' placeholder='Ketikan nama siswa' value={form.nama_siswa} onChange={handleChange} />
                        </div>
                        <div className='form-group'>
                            <Label htmlFor='nisn_siswa'>NISN Siswa</Label>
                            <Input name='nisn_siswa' id='nisn_siswa' type='number' placeholder='Ketikan NISN siswa' value={form.nisn_siswa} onChange={handleChange} />
                        </div>
                        <div className='form-group'>
                            <Label htmlFor='nis_siswa'>NIS Siswa</Label>
                            <Input name='nis_siswa' id='nis_siswa' type='number' placeholder='Ketikan NIS siswa' onChange={handleChange} value={form.nis_siswa} />
                        </div>
                    </div>
                    <div className='space-y-3 space-x-3 grid grid-cols-4'>
                        <div className='form-group'>
                            <Label htmlFor='siswa_email'>Email Siswa</Label>
                            <Input name='siswa_email' type='email' id='siswa_email' placeholder='Ketikan email siswa' onChange={handleChange} value={form.siswa_email} />
                        </div>
                        <div className='form-group'>
                            <Label htmlFor='siswa_phone'>Nomor Handphone Siswa</Label>
                            <Input name='siswa_phone' id='siswa_phone' type='number' placeholder='Ketikan no hp siswa' onChange={handleChange} value={form.siswa_phone} />
                        </div>
                        <div className='form-group'>
                            <Label >Jenis Kelamin</Label>
                            <RadioGroup defaultValue={form.jenis_kelamin} onValueChange={(e) => setForm(prev => ({ ...prev, jenis_kelamin: e }))} className='flex items-center mt-2'>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="LAKI_LAKI" id="LAKI_LAKI" />
                                    <Label htmlFor="LAKI_LAKI">Laki-laki</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="PEREMPUAN" id="PEREMPUAN" />
                                    <Label htmlFor="PEREMPUAN">Perempuan</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className='form-group col-span-4'>
                            <Label htmlFor='alamat'>Alamat Siswa</Label>
                            <Input name='alamat' id='alamat' type='text' placeholder='Ketikan alamat lengkap siswa' onChange={handleChange} value={form.alamat} />
                        </div>
                    </div>

                    <div className='flex items-center justify-end gap-3 mt-5'>
                        <Button variant="destructive" className='cursor-pointer' onClick={() => router.push('/students-list')}>Batal</Button>
                        <Button className='cursor-pointer' onClick={onSubmitData} disabled={state.loading}>Simpan Data</Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
