import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { BiMenu } from "react-icons/bi";
import { Button } from './ui/button'

interface MoreButtonAction {
    children: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    className?: string
    offset?: number
}

export default function MoreButtonAction({ children, side = "bottom", align = "center", className, offset = 10 }: MoreButtonAction) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" className='cursor-pointer'><BiMenu /></Button>
            </PopoverTrigger>
            <PopoverContent side={side} align={align} className={cn('w-fit p-0 px-3 py-1', className)} sideOffset={offset}>
                <div className='flex flex-col items-center justify-center space-y-1 text-sm text-center w-full'>{children}</div>
            </PopoverContent>
        </Popover>
    )
}
