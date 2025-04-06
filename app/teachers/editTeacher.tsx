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
    teacherId?: number
}

interface FormState {
    teacher_name: string
    email: string
    phone: number
    address: string
    teacherId?: number
}

export default function EditTeacher({ isOpen, onOpenChange, reload, ...props }: Props) {
    const { showAlert } = useAlert()
    const [state, setState] = React.useState({
        loading: false,
        mounting: false,
    })
    const [form, setForm] = React.useState<FormState>({
        teacher_name: '',
        email: '',
        phone: 0,
        address: '',
        teacherId: 0,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const dataDetail = async () => {
        setState({ ...state, mounting: true })
        const response = await fetchData.POST('teacher/detail', { teacherId: props.teacherId })
        if (response.success) {
            setForm(prev => ({
                ...prev,
                teacher_name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
                address: response.data.address,
                teacherId: response.data.teacherId
            }))
        }
        setState({ ...state, mounting: false })
    }

    React.useEffect(() => {
        if (isOpen) {
            dataDetail()
        }
    }, [isOpen])

    const handleSubmit = async () => {
        setState({ ...state, loading: true })
        const response = await fetchData.PATCH('teacher/edit', form)
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
                teacher_name: '',
                email: '',
                phone: 0,
                address: ''
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
        setState({ ...state, loading: false })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className='w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Edit Guru</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {state.mounting ? (
                        <div>
                            <Spinner />
                        </div>
                    ) : (
                        <div className='grid grid-cols-3 gap-4'>

                            <div className='form-group'>
                                <Label htmlFor='teacher_name'>Nama Guru</Label>
                                <Input id='teacher_name' name='teacher_name' onChange={handleChange} value={form.teacher_name} placeholder='Ketikan nama guru disini' />
                            </div>

                            <div className='form-group'>
                                <Label htmlFor='email'>Email Guru</Label>
                                <Input id='email' name='email' type='email' onChange={handleChange} value={form.email} placeholder='Ketikan email guru' />
                            </div>

                            <div className='form-group'>
                                <Label htmlFor='phone'>Nomor Guru</Label>
                                <Input id='phone' name='phone' type="tel" onChange={handleChange} value={form.phone} placeholder='Ketikan kode mata pelajaran disini' />
                            </div>

                            <div className='form-group col-span-3'>
                                <Label htmlFor='address'>Alamat Guru</Label>
                                <Input id='address' name='address' type="text" onChange={handleChange} value={form.address} placeholder='Ketikan alamat guru' />
                            </div>

                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="outline" className='cursor-pointer' onClick={() => {
                        onOpenChange(false)
                        setForm(prev => ({
                            ...prev,
                            teacher_name: '',
                            email: '',
                            phone: 0,
                            address: ''
                        }))
                        setState(prev => ({ ...prev, loading: false }))
                    }}>Batal</Button>
                    <Button className='cursor-pointer' onClick={handleSubmit} disabled={state.loading}><SaveIcon />Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
