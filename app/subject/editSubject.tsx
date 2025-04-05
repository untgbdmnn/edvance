"use client"

import { SelectSearch } from '@/components/selectSearch'
import Spinner from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import fetchData from '@/lib/fetchData'
import { useAlert } from '@/resources/hooks/useAlert'
import { SaveIcon } from 'lucide-react'
import * as React from 'react'

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
    subjectId: number
}

interface FormState {
    subject_name: string
    subject_code: string
    teacherId: string
}

export default function EditSubject({ isOpen, onOpenChange, reload, ...props }: Props) {
    const { showAlert } = useAlert()
    const [state, setState] = React.useState({
        loading: false,
        mounting: false,
    })
    const [form, setForm] = React.useState<FormState>({
        subject_name: '',
        subject_code: '',
        teacherId: '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    async function getDetail() {
        setState({ ...state, mounting: true })
        const response = await fetchData.POST('subject/get-detail', { subjectId: props.subjectId })
        if (response.success) {
            setForm(prev => ({
                ...prev,
                subject_name: response.data.subjectName,
                subject_code: response.data.subjectCode,
                teacherId: '',
            }))
            setState(prev => ({ ...prev, mounting: false }))
        } else {
            showAlert({
                title: "Gagal!",
                message: response.message,
                typealert: "error",
                autoClose: true,
                duration: 1000
            })
            onOpenChange(false)
        }
    }

    React.useEffect(() => {
        if (isOpen) {
            getDetail()
        }
    }, [isOpen])

    const handleSubmit = async () => {
        setState(prev => ({ ...prev, loading: true }))
        const reqBody = {
            nama_subject: form.subject_name,
            kode_subject: form.subject_code,
            teacher_id: form.teacherId,
            id: props.subjectId
        }
        const response = await fetchData.POST('subject/edit-subject', reqBody)
        if (response.success) {
            showAlert({
                title: "Berhasil!",
                message: response.message,
                typealert: "success",
                autoClose: true,
                duration: 1000
            })
            onOpenChange(false)
            reload()
            setForm(prev => ({
                ...prev,
                subject_name: '',
                subject_code: '',
                teacherId: '',
            }))
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

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Edit Mata Pelajaran</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {state.mounting ? (
                        <Spinner />
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>

                            <div className='form-group'>
                                <Label htmlFor='subject_name'>Nama Mata Pelajaran</Label>
                                <Input id='subject_name' name='subject_name' onChange={handleChange} value={form.subject_name} placeholder='Ketikan nama mata pelajaran disini' />
                            </div>

                            <div className='form-group'>
                                <Label htmlFor='subject_code'>Kode Mata Pelajaran</Label>
                                <Input id='subject_code' name='subject_code' onChange={handleChange} value={form.subject_code} placeholder='Ketikan kode mata pelajaran disini' />
                            </div>

                            <div className='form-group'>
                                <Label>Guru Pengampu</Label>
                                <SelectSearch
                                    options={[]}
                                    contentClassname='w-full'
                                    valueKey="teacherId"
                                    labelKey="teacherName"
                                    placeholder="Pilih guru pengampu"
                                    value={form.teacherId ?? undefined}
                                    displayLimit={2}
                                    onSelect={(value) => {
                                        setForm(prev => ({ ...prev, teacherId: String(value) }))
                                    }}
                                />
                            </div>
                        </div>
                    )
                    }
                </DialogBody >
                <DialogFooter>
                    <Button variant="outline" className='cursor-pointer' onClick={() => {
                        onOpenChange(false)
                        setForm(prev => ({
                            ...prev,
                            subject_name: '',
                            subject_code: '',
                            teacherId: '',
                        }))
                        setState(prev => ({ ...prev, loading: false }))
                    }}>Batal</Button>
                    <Button className='cursor-pointer' onClick={handleSubmit} disabled={state.loading}><SaveIcon />Simpan</Button>
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}
