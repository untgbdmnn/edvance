import * as React from 'react'
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    reload: () => void
    subjectId: number
}

export default function RiwayatSubject({ isOpen, onOpenChange, reload, ...props }: Props) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className='w-[1000px]' >
                <DialogHeader>
                    <DialogTitle>Riwayat Perubahan Mata Pelajaran </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <div>
                        asdas
                    </div>
                </DialogBody >
                < DialogFooter >
                </DialogFooter>
            </DialogContent >
        </Dialog >
    )
}
