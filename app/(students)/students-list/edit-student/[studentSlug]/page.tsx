"use client"

import AppHeader from '@/components/app-header'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainLayout from '@/layouts/main-layout'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { toast } from 'sonner'

export default function EditStudent() {
  const router = useRouter()
  const { studentSlug } = useParams() as { studentSlug: string }
  const [state, setState] = useState({
    page_loading: true,
    loading: false,
    show_password: false,
    show_confirm_pass: false,
  })

  const [data, setData] = useState({
    nama_siswa: '',
    nisn_siswa: '',
    nis_siswa: "",
    siswa_email: '',
    siswa_phone: '',
    jenis_kelamin: 'LAKI_LAKI',
    alamat: '',
    status: '',

    studentId: 0,

    password_baru: '',
    confirm_password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const loadDetail = async () => {
    setState({ ...state, page_loading: true })
    const response = await fetchData.POST('student/load-detail', { slug: studentSlug })
    const data = response.data;
    setData(prev => ({
      ...prev,
      nama_siswa: data?.siswa_nama,
      nisn_siswa: data?.siswa_nisn,
      nis_siswa: data?.siswa_nis,
      siswa_email: data?.siswa_email,
      siswa_phone: data?.siswa_telp,
      jenis_kelamin: data?.jenis_kelamin,
      alamat: data?.siswa_alamat,
      status: data.siswa_status,

      studentId: data.studentId,
    }))
    setState({ ...state, page_loading: false })
  }

  useEffect(() => {
    if (state.page_loading) {
      loadDetail()
    }
  }, [state.page_loading])

  const onSubmitData = async () => {
    setState(prev => ({ ...prev, loading: true }))
    const requestBody = {
      studentId: data.studentId,
      siswa_nama: data.nama_siswa,
      siswa_nisn: data.nisn_siswa,
      siswa_nis: data.nis_siswa,
      siswa_email: data.siswa_email,
      siswa_telp: data.siswa_phone,
      jenis_kelamin: data.jenis_kelamin,
      siswa_alamat: data.alamat,
    }
    const response = await fetchData.PATCH('student/edit-data', requestBody)
    if (response.success) {
      toast.success("Berhasil!", {
        description: response.message
      })
      router.push('/students-list')
    } else
      toast.error("Gagal!", {
        description: response.message
      })
    setState(prev => ({ ...prev, loading: false }))
  }

  const nonActiveStudent = async (status: string) => {
    const response = await fetchData.PATCH('/student/nonactive-student', {
      studentId: data.studentId, new_status: status
    })
    if (response.success) {
      toast.success("Berhasil!", {
        description: response.message
      })
    }
  }

  const updatePassword = async () => {
    if (data.password_baru !== data.confirm_password) {
      toast.error("Gagal!", {
        description: "Password tidak sama!"
      })
      return
    }
    setState(prev => ({ ...prev, loading: true }))
    const response = await fetchData.PATCH('student/update-password', {
      studentId: data.studentId,
      password_baru: data.password_baru,
    })
    if (response.success) {
      toast.success("Berhasil!", {
        description: response.message
      })
      router.push('/students-list')
    } else
      toast.error("Gagal!", {
        description: response.message
      })
    setState(prev => ({ ...prev, loading: false }))
  }


  if (state.page_loading) {
    return (
      <MainLayout showBreadcrumb pageTitle='Edit Siswa' parentPageTitle='Daftar Siswa' parentPageUrl='/students-list'>
        <SetTitle pageTitle='Edit Siswa' />
        <div className='w-full h-full flex items-center justify-center'>
          <Spinner label='Memuat...' />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout showBreadcrumb pageTitle='Edit Siswa' parentPageTitle='Daftar Siswa' parentPageUrl='/students-list'>
      <SetTitle pageTitle='Edit Siswa' />
      <AppHeader title='Edit Siswa' />

      <div className='container p-6'>

        <Tabs defaultValue="data-siswa" className="w-full">
          <TabsList>
            <TabsTrigger value="data-siswa">Data Siswa</TabsTrigger>
            <TabsTrigger value="password">Ganti Password</TabsTrigger>
          </TabsList>
          <TabsContent value="data-siswa" className='w-full mt-5'>
            <div className='w-full'>
              <div className='space-y-3 space-x-3 grid grid-cols-4'>
                <div className='form-group col-span-2'>
                  <Label htmlFor='nama_siswa'>Nama Siswa</Label>
                  <Input name='nama_siswa' id='nama_siswa' placeholder='Ketikan nama siswa' value={data.nama_siswa} onChange={handleChange} />
                </div>
                <div className='form-group'>
                  <Label htmlFor='nisn_siswa'>NISN Siswa</Label>
                  <Input name='nisn_siswa' id='nisn_siswa' type='number' placeholder='Ketikan NISN siswa' value={data.nisn_siswa} onChange={handleChange} />
                </div>
                <div className='form-group'>
                  <Label htmlFor='nis_siswa'>NIS Siswa</Label>
                  <Input name='nis_siswa' id='nis_siswa' type='number' placeholder='Ketikan NIS siswa' onChange={handleChange} value={data.nis_siswa} />
                </div>
              </div>
              <div className='space-y-3 space-x-3 grid grid-cols-4'>
                <div className='form-group'>
                  <Label htmlFor='siswa_email'>Email Siswa</Label>
                  <Input name='siswa_email' type='email' id='siswa_email' placeholder='Ketikan email siswa' onChange={handleChange} value={data.siswa_email} />
                </div>
                <div className='form-group'>
                  <Label htmlFor='siswa_phone'>Nomor Handphone Siswa</Label>
                  <Input name='siswa_phone' id='siswa_phone' type='number' placeholder='Ketikan no hp siswa' onChange={handleChange} value={data.siswa_phone} />
                </div>
                <div className='form-group'>
                  <Label >Jenis Kelamin</Label>
                  <RadioGroup defaultValue={data.jenis_kelamin} onValueChange={(e) => setData(prev => ({ ...prev, jenis_kelamin: e }))} className='flex items-center mt-2'>
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
                <div className='form-group'>
                  <Label >Status Siswa</Label>
                  <RadioGroup defaultValue={data.status} onValueChange={(e) => nonActiveStudent(e)} className='flex items-center mt-2'>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ACTIVE" id="ACTIVE" />
                      <Label htmlFor="ACTIVE">Aktif</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="INACTIVE" id="INACTIVE" />
                      <Label htmlFor="INACTIVE">Non Aktif</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className='form-group col-span-4'>
                  <Label htmlFor='alamat'>Alamat Siswa</Label>
                  <Input name='alamat' id='alamat' type='text' placeholder='Ketikan alamat lengkap siswa' onChange={handleChange} value={data.alamat} />
                </div>
              </div>

              <div className='flex items-center justify-end gap-3 mt-5'>
                <Button variant="destructive" className='cursor-pointer' onClick={() => router.push('/students-list')}>Batal</Button>
                <Button className='cursor-pointer' onClick={onSubmitData} disabled={state.loading}>Simpan Data</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="password" className='w-full mt-5'>
            <div className='space-y-4'>

              <div className='form-group'>
                <Label htmlFor='password_baru'>Password Baru</Label>
                <div className='relative flex items-center justify-end'>
                  <Input id='password_baru' type={state.show_password ? "text" : "password"} name='password_baru' onChange={handleChange} placeholder='Masukan password siswa baru' />
                  {state.show_password ? <BsEyeFill className='absolute right-4 size-5 cursor-pointer' onClick={() => setState(prev => ({ ...prev, show_password: !state.show_password }))} /> : <BsEyeSlashFill className='absolute right-4 size-5 cursor-pointer' onClick={() => setState(prev => ({ ...prev, show_password: !state.show_password }))} />}
                </div>
              </div>

              <div className='form-group'>
                <Label htmlFor='confirm_password'>Password Baru</Label>
                <div className='relative flex items-center justify-end'>
                  <Input id='confirm_password' type={state.show_confirm_pass ? "text" : "password"} name='confirm_password' onChange={handleChange} placeholder='Masukan password siswa baru' />
                  {state.show_confirm_pass ? <BsEyeFill className='absolute right-4 size-5 cursor-pointer' onClick={() => setState(prev => ({ ...prev, show_confirm_pass: !state.show_confirm_pass }))} /> : <BsEyeSlashFill className='absolute right-4 size-5 cursor-pointer' onClick={() => setState(prev => ({ ...prev, show_confirm_pass: !state.show_confirm_pass }))} />}
                </div>
              </div>

              <div className='flex items-center justify-end'>
                <Button className='cursor-pointer' onClick={updatePassword}>Simpan Password Baru</Button>
              </div>

            </div>
          </TabsContent>
        </Tabs>

      </div>
    </MainLayout>
  )
}
