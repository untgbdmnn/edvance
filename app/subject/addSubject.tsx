"use client"

import { SelectSearch } from '@/components/selectSearch'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import fetchData from '@/lib/fetchData'
import { SaveIcon } from 'lucide-react'
import * as React from 'react'

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
}

interface FormState {
    subject_name: string
    subject_code: string
    teacherId: string
}

export default function AddSubject({ isOpen, onOpenChange, reload, ...props }: Props) {
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

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Mata Pelajaran</DialogTitle>
                </DialogHeader>
                <DialogBody>
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
                </DialogBody>
                <DialogFooter>
                    <Button variant="outline" className='cursor-pointer' onClick={() => {
                        onOpenChange(false)
                    }}>Batal</Button>
                    <Button className='cursor-pointer' ><SaveIcon />Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
