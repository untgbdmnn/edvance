"use client"

import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import fetchData from '@/lib/fetchData'
import { useAlert } from '@/resources/hooks/useAlert'
import { SaveIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

interface TambahKelasProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
    classId: number
}

export default function EditKelas({ isOpen, onOpenChange, reload, ...props }: TambahKelasProps) {
    const { showAlert } = useAlert()
    const [form, setForm] = React.useState({
        nama_kelas: '',
        wali_kelas: '',
        kelas_level: 'X',
        kelas_major: '',
    })
    const [state, setState] = React.useState({
        loading: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async () => {
        setState(prev => ({ ...prev, loading: true }))

        if (form.nama_kelas == '' || form.kelas_level == '') {
            toast.error('Nama Kelas dan Level Kelas tidak boleh kosong')
            return
        }

        const requestBody = {
            name: form.nama_kelas,
            wali_kelas: form.wali_kelas,
            level: form.kelas_level,
            major: form.kelas_major
        }
        const response = await fetchData.POST('grade/add', requestBody)
        if (response.success) {
            showAlert({
                title: "Berhasil!",
                message: response.message,
                typealert: "success",
                autoClose: true,
                duration: 1000
            })
            onOpenChange(false)
        } else {
            showAlert({
                title: "Gagal!",
                message: response.message,
                typealert: "error",
                autoClose: true,
                duration: 1000
            })
        }
        setState(prev => ({ ...prev, loading: false }))
    }

    const loadDetail = async () => {
        setState(prev => ({ ...prev, loading: true }))
        const response = await fetchData.POST('grade/detail', { classId: props.classId })
        if (response.success) {
            setForm(prevForm => ({
                ...prevForm,
                nama_kelas: response.data.name,
                wali_kelas: '',
                kelas_level: response.data.level,
                kelas_major: '',
            }))
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    React.useEffect(() => {
        if (isOpen && props.classId) {
            loadDetail()
        }
    }, [isOpen, props.classId])

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Edit Kelas</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {state.loading ? (
                        <div>
                            <Spinner />
                        </div>
                    ) : (
                        <div>
                            <div className='grid grid-cols-2 gap-4'>
                                <div className='form-group'>
                                    <Label>Nama Kelas</Label>
                                    <Input name='nama_kelas' onChange={handleChange} value={form.nama_kelas} placeholder='Ketikan nama kelas disini' />
                                </div>
                                <div className='form-group'>
                                    <Label>Nama Wali Kelas</Label>
                                    <Input name='wali_kelas' onChange={handleChange} value={form.wali_kelas} placeholder='Ketikan wali kelas disini' />
                                </div>
                                <div className='form-group'>
                                    <Label>Jurusan</Label>
                                    <Select onValueChange={(e) => setForm(prev => ({ ...prev, kelas_major: e }))}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Pilih Jurusan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="IPA">IPA</SelectItem>
                                            <SelectItem value="IPS">IPS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='form-group'>
                                    <Label>Level Kelas</Label>
                                    <RadioGroup defaultValue={form.kelas_level} onValueChange={(e) => setForm(prev => ({ ...prev, kelas_level: e }))} className='flex items-center mt-2 justify-between'>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="X" id="X" />
                                            <Label htmlFor="X">Sepuluh</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="XI" id="XI" />
                                            <Label htmlFor="XI">Sebelas</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="XII" id="XII" />
                                            <Label htmlFor="XII">Dua Belas</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div >
                    )
                    }
                </DialogBody >
                <DialogFooter>
                    <Button variant="outline" className='cursor-pointer' onClick={() => {
                        onOpenChange(false)
                    }}>Batal</Button>
                    <Button className='cursor-pointer' onClick={handleSubmit}><SaveIcon />Simpan</Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >

    )
}
