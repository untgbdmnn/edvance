import * as React from 'react'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import fetchData from '@/lib/fetchData'
import EmptyData from '@/components/empty-data'
import moment from 'moment'
import { Badge } from '@/components/ui/badge'
import { IoMdArrowDropright } from "react-icons/io";
import Paginate from '@/components/paginate'
import Spinner from '@/components/spinner'
import { useAlert } from '@/resources/hooks/useAlert'
import { HistoryTeacher } from '@prisma/client'
import { cn } from '@/lib/utils'

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
    teacherId?: number
}

export default function RiwayatGuru({ isOpen, onOpenChange, reload, ...props }: Props) {
    const { showAlert } = useAlert()
    const [data, setData] = React.useState<(HistoryTeacher & { history: any } & { user?: { role: string } })[] | null>([])
    const [latest, setLatest] = React.useState<{ historyId: number, history: any } | null>(null)
    const [state, setState] = React.useState({
        loading: true,
        currentPage: 0,
        perPage: 0,
        totalData: 0,
        lastPage: 0,
    })

    async function loadHistory() {
        setState({ ...state, loading: true })
        setData([])
        const response = await fetchData.POST('teacher/get-history', {
            id: props.teacherId,
            page: state.currentPage + 1,
            paginate: 3
        })
        if (response.success) {
            setData(response.data.data)
            setLatest(response.data.latest)
            setState(prev => ({
                ...prev,
                perPage: response.data.per_page,
                totalData: response.data.total,
                lastPage: response.data.lastPage,
                loading: false,
            }))
        }
        setState(prev => ({ ...prev, loading: false }))
    }
    React.useEffect(() => {
        if (isOpen) {
            loadHistory()
        }
    }, [isOpen, state.currentPage])

    const handlePageChange = (data: any) => {
        setState(prev => ({
            ...prev,
            currentPage: data.selected, loading: true,
        }))
    }

    const handleRevert = async (historyId: number, teacherId: number | null) => {
        const confirmed = await showAlert({
            title: "Peringatan!",
            message: `Data ini akan dikembalikan ke data sebelumnya, lanjutkan bila anda yakin?`,
            typealert: "warning",
            showButton: true,
            confirmText: "Lanjutkan",
            closeText: "Batal"
        })
        if (confirmed) {
            const response = await fetchData.POST('teacher/revert-history', {
                historyId: historyId, teacherId: teacherId
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
            } else {
                showAlert({
                    title: "Gagal!",
                    message: response.message,
                    typealert: "error",
                    autoClose: true,
                    duration: 1200
                })
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className='w-[1000px]' >
                <DialogHeader>
                    <DialogTitle>Riwayat Guru</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        {!state.loading && data?.length === 0 ? (
                            <div>
                                <EmptyData />
                            </div>
                        ) : (
                            <div className='w-full'>
                                <div className='grid grid-cols-2 mb-2 font-bold text-base'>
                                    <div>User</div>
                                    <div>Aktifitas</div>
                                </div>
                                {state.loading && (
                                    <div className='my-6'>
                                        <Spinner />
                                    </div>
                                )}
                                {data?.map((item, index) => {
                                    return (
                                        <div key={index} className='grid grid-cols-2'>
                                            <div className='w-full grid grid-cols-7 gap-2 my-3'>
                                                <div className='w-full h-fit flex items-center justify-start'>
                                                    <div className='h-full w-full max-h-15 rounded-sm max-w-15 aspect-square bg-foreground text-background text-xs flex items-center justify-center'>image</div>
                                                </div>
                                                <div className='w-full col-span-6 '>
                                                    <div className='w-full flex flex-col'>
                                                        <h1 className='text-base font-bold'>{item.historyBy} | {item.user?.role || 'Unknown Role'}</h1>
                                                        <span className='text-xs'>{moment(item.createdAt).format('LLL')}</span>
                                                    </div>
                                                    <div className='mt-1 flex items-center gap-1.5'>
                                                        <Badge variant="outline" className={cn('cursor-pointer', item.historyStatus === "DELETED" && "bg-destructive", item.historyStatus === "RESTORED" && "bg-green-500")}>{item.historyStatus}</Badge>
                                                        {(latest?.historyId !== item.historyId) &&
                                                            !["REVERTED", "RESTORED", "DELETED"].includes(item.historyStatus!) && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className='cursor-pointer uppercase hover:bg-accent duration-150 transition-colors select-none'
                                                                    onClick={() => handleRevert(item.historyId, item.teacherId)}
                                                                >
                                                                    revert
                                                                </Badge>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='h-full w-full pt-1.5'>
                                                {item.historyStatus !== 'CREATED' && (
                                                    <div className=''>
                                                        {item.name !== item.history.name && (
                                                            <div className='text-sm flex gap-1 whitespace-nowrap flex-wrap'>
                                                                <h1 className='font-normal'>Nama</h1>
                                                                <h1 className='font-normal flex items-center gap-1.5'>Dari <span className='font-bold'>{item.history.name}</span> <IoMdArrowDropright /> <span className='font-bold'>{item.name}</span></h1>
                                                            </div>
                                                        )}
                                                        {item.email !== item.history.email && (
                                                            <div className='text-sm flex gap-1 whitespace-nowrap flex-wrap'>
                                                                <h1 className='font-normal'>Email</h1>
                                                                <h1 className='font-normal flex items-center gap-1.5'>Dari <span className='font-bold'>{item.history.email}</span> <IoMdArrowDropright /> <span className='font-bold'>{item.email}</span></h1>
                                                            </div>
                                                        )}
                                                        {item.phone !== item.history.phone && (
                                                            <div className='text-sm flex gap-1 whitespace-nowrap flex-wrap'>
                                                                <h1 className='font-normal'>Nomor</h1>
                                                                <h1 className='font-normal flex items-center gap-1.5'>Dari <span className='font-bold'>{item.history.phone}</span> <IoMdArrowDropright /> <span className='font-bold'>{item.phone}</span></h1>
                                                            </div>
                                                        )}
                                                        {item.address !== item.history.address && (
                                                            <div className='text-sm flex gap-1 whitespace-nowrap flex-wrap'>
                                                                <h1 className='font-normal'>Alamat</h1>
                                                                <h1 className='font-normal flex items-center gap-1.5'>Dari <span className='font-bold'>{item.history.address}</span> <IoMdArrowDropright /> <span className='font-bold'>{item.address}</span></h1>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </DialogBody >
                < DialogFooter >
                    <Paginate pageCount={state.lastPage} onPageChange={handlePageChange} onPage={data ? data.length : 0} totalData={state.totalData} />
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}
