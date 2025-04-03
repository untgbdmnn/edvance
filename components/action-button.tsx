import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { TbDotsVertical } from 'react-icons/tb'

interface ActionButtonProps {
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    className?: string
    offset?: number
}

export default function ActionButton({ children, side = "bottom", align = "center", className, offset = 10 }: ActionButtonProps) {
    return (
        <Popover>
            <PopoverTrigger><TbDotsVertical className='size-5 cursor-pointer'/></PopoverTrigger>
            <PopoverContent side={side} align={align} className={cn('w-fit p-0 px-3 py-1', className)} sideOffset={offset}>
                <div className='flex flex-col items-center justify-center space-y-1 text-sm'>{children}</div>
            </PopoverContent>
        </Popover>

    )
}
