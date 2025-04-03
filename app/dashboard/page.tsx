"use client"

import AppHeader from '@/components/app-header'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MainLayout from '@/layouts/main-layout'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function DashboardPage() {
  const [state, setState] = useState({
    loading: false,
    page_loading: false,
  })

  const [form, setForm] = useState({
    nama_sekolah: '',
    alamat_sekolah: '',
    no_telp: '',
    email: '',
    website: '',
    status_sekolah: '',
    type_sekolah: '',
    npsn: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, loading: true }))
    const response = await fetchData.POST('sekolah/create-new', form)
    if (response.success) {
      toast.success("Berhasil", {
        description: response.message
      })
    } else {
      toast.error("Gagal!", {
        description: response.message
      })
    }
    setState(prev => ({ ...prev, loading: false }))
  }

  const checkStatus = async () => {
    const response = await fetchData.GET('sekolah/check-status')
  }

  if (state.page_loading) {
    return (
      <MainLayout>
        <SetTitle pageTitle='Dashboard' />
        <div className='w-full h-full flex items-center justify-center'>
          <Spinner />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <SetTitle pageTitle='Dashboard' />
      <AppHeader title='Selamat Datang Kembali, Admin!' />
      <div className='space-y-3'>
        <div className='grid grid-cols-5 gap-4'>
          <div className='form-group col-span-2'>
            <Label htmlFor='nama_sekolah'>Nama Sekolah</Label>
            <Input name='nama_sekolah' id='nama_sekolah' type='text' value={form.nama_sekolah} onChange={handleChange} placeholder='Ketikan nama sekolah' />
          </div>

          <div className='form-group'>
            <Label htmlFor='npsn'>NPSN Sekolah</Label>
            <Input name='npsn' id='npsn' type='number' value={form.npsn} onChange={handleChange} placeholder='Ketikan NPSN sekolah' />
          </div>

          <div className='form-group'>
            <Label htmlFor='status_sekolah'>Status Sekolah</Label>
            <Select onValueChange={(value) => setForm({ ...form, status_sekolah: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status Sekolah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEGERI">Negeri</SelectItem>
                <SelectItem value="SWASTA">Swasta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='form-group'>
            <Label>Tipe Sekolah</Label>
            <Select onValueChange={(value) => setForm({ ...form, type_sekolah: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tipe Sekolah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="SMK">SMK</SelectItem>
                <SelectItem value="MA">MA</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
        <div className='grid grid-cols-3 gap-4'>
          <div className='form-group'>
            <Label htmlFor='email'>Email Sekolah</Label>
            <Input name='email' id='email' type='email' onChange={handleChange} value={form.email} placeholder='Ketikan email sekolah' />
          </div>
          <div className='form-group'>
            <Label htmlFor='website'>Website Sekolah</Label>
            <Input name='website' id='website' type="url" onChange={handleChange} value={form.website} placeholder='Ketikan website sekolah' />
          </div>
          <div className='form-group'>
            <Label htmlFor='no_telp'>Nomor Telephone Sekolah</Label>
            <Input name='no_telp' id='no_telp' type="tel" onChange={handleChange} value={form.no_telp} placeholder='Ketikan nomor telepone sekolah' />
          </div>
        </div>
        <div className='form-group'>
          <Label htmlFor='alamat_sekolah'>Alamat Sekolah</Label>
          <Input name='alamat_sekolah' type="text" placeholder='Ketikan alamat lengkap sekolah disini...' value={form.alamat_sekolah} onChange={handleChange} />
        </div>
        <div className='flex items-center justify-end'>
          <Button onClick={handleSubmit}>{state.loading ? "Menyimpan Data" : "Simpan Data"}</Button>
        </div>
      </div>
    </MainLayout>
  )
}
