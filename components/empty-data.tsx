"use client"

import Empty from '@/resources/icons/empty-inbox.png'
import Image from 'next/image'

interface Props {
    label?: string
}

export default function EmptyData({ label = "Data kosong" }: Props) {
    return (
        <div className='flex flex-col items-center justify-center py-2 select-none'>
            <Image src={Empty} alt='' className='size-18'/>
            <h1 className='text-sm capitalize'>{label}</h1>
        </div>
    )
}
