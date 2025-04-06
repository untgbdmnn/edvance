import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Spinner from '@/components/spinner'
import fetchData from '@/lib/fetchData'
import { HistoryTeacher } from '@prisma/client'
import EmptyData from '@/components/empty-data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import Paginate from '@/components/paginate'
import { useAlert } from '@/resources/hooks/useAlert'

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
}

export default function TrashTeacher({ isOpen, onOpenChange, reload, ...props }: Props) {
    const { showAlert } = useAlert()
    const [data, setData] = React.useState<HistoryTeacher[] | null>([])
    const [state, setState] = React.useState<{
        mounting: boolean;
        loading: boolean;
        currentPage: number;
        perPage: number;
        totalData: number;
        lastPage: number;
        checked: (number | null)[];
        checked_all: boolean;
    }>({
        mounting: false,
        loading: false,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
        checked: [],
        checked_all: false,
    })

    const loadTrash = async () => {
        setState({ ...state, loading: true, mounting: true })
        const bodyRequest = {
            page: state.currentPage + 1,
            paginate: 5,
        }
        const response = await fetchData.POST('teacher/get-trash', bodyRequest)
        if (response.success) {
            setData(response.data.data)
            setState(prev => ({
                ...prev,
                perPage: response.data.perPage,
                totalData: response.data.total,
                lastPage: response.data.lastPage,
                loading: false,
                mounting: false
            }))
        }
    }

    React.useEffect(() => {
        if (isOpen) {
            loadTrash()
        }
    }, [isOpen, state.currentPage])

    const handlePageChange = (data: any) => {
        setState(prev => ({
            ...prev,
            loading: true,
            mounting: true,
            currentPage: data.selected
        }))
    }

    const handleCheckAll = (checked: [] | any) => {
        if (checked) {
            const allChecked = data?.map((item) => item.teacherId);
            setState((prevState) => ({
                ...prevState,
                checked: allChecked || [],
                checked_all: true,
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                checked: [],
                checked_all: false,
            }));
        }
    };

    const handleCheck = (id: number) => {
        setState((prevState) => {
            const isChecked = prevState.checked.includes(id);
            const newChecked = isChecked
                ? prevState.checked.filter((currId) => currId !== id)
                : [...prevState.checked, id];

            return {
                ...prevState,
                checked: newChecked,
                checked_all: newChecked.length === data?.length,
            };
        });
    };

    const pulihkanSubject = async () => {
        const confirmed = await showAlert({
            title: "Peringatan!",
            message: state.checked.length + " data akan dipulihkan. Apakah Anda yakin?",
            typealert: "warning",
            showButton: true,
            confirmText: "Lanjutkan",
            closeText: "Batal"
        })
        if (confirmed) {
            const response = await fetchData.POST('teacher/pulihkan', {
                teacherId: state.checked
            })
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
                setState({ ...state, currentPage: 0, checked: [], checked_all: false })
            } else {
                showAlert({
                    title: "Gagal!",
                    message: response.message,
                    typealert: "error",
                    autoClose: true,
                    duration: 1000
                })
            }
        }
    }

    const hapusPermanenSubject = async () => {
        const confirmed = await showAlert({
            title: "Peringatan!",
            message: state.checked.length + " data akan dihapus permanen. Apakah Anda yakin?",
            typealert: "warning",
            showButton: true,
            confirmText: "Lanjutkan",
            closeText: "Batal"
        })
        if (confirmed) {
            const response = await fetchData.POST('teacher/delete-permanent', {
                teacherId: state.checked
            })
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
                setState({ ...state, currentPage: 0, checked: [], checked_all: false })
            } else {
                showAlert({
                    title: "Gagal!",
                    message: response.message,
                    typealert: "error",
                    autoClose: true,
                    duration: 1000
                })
            }
        }
    }
    console.log(state.checked)

    return (
        <Dialog open={isOpen} onOpenChange={() => {
            setState(prev => ({
                ...prev,
                checked: [], checked_all: false
            }))
            onOpenChange(false)
        }}>
            <DialogContent className='w-[1000px]'>
                <DialogHeader>
                    <DialogTitle>Trash Guru</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {state.mounting ? (
                        <Spinner className='my-7' />
                    ) : (
                        <div className='w-full'>
                            <div className='flex items-center gap-3'>
                                <Button className='cursor-pointer font-bold' onClick={pulihkanSubject} disabled={state.checked.length === 0}>Pulihkan</Button>
                                <Button className='cursor-pointer font-bold' onClick={hapusPermanenSubject} disabled={state.checked.length === 0} variant="destructive">Hapus Permanen</Button>
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
                                                    <TableHead>
                                                        <Checkbox checked={state.checked_all} onCheckedChange={handleCheckAll} />
                                                    </TableHead>
                                                    <TableHead>No</TableHead>
                                                    <TableHead>Nama Guru</TableHead>
                                                    <TableHead>Email Guru</TableHead>
                                                    <TableHead>Nomor Guru</TableHead>
                                                    <TableHead>Alamat</TableHead>
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
                                                            <TableCell>
                                                                <Checkbox id={item?.teacherId!.toString()} onCheckedChange={() => item.teacherId !== null && handleCheck(item.teacherId)}
                                                                    checked={state.checked.includes(item.teacherId)}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Label htmlFor={item.teacherId!.toString()}>{index + 1}</Label>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Label htmlFor={item.teacherId!.toString()}>{item.name}</Label></TableCell>
                                                            <TableCell>
                                                                <Label htmlFor={item.teacherId!.toString()}>{item.email}</Label></TableCell>
                                                            <TableCell>
                                                                <Label htmlFor={item.teacherId!.toString()}>{item.phone}</Label></TableCell>
                                                            <TableCell>
                                                                <Label htmlFor={item.teacherId!.toString()}>{item.address}</Label></TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                    }
                </DialogBody >
                <DialogFooter>
                    <Paginate pageCount={state.lastPage} onPageChange={handlePageChange} onPage={data ? data.length : 0} totalData={state.totalData} />
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}
