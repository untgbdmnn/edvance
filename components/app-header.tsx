import { cn } from "@/lib/utils"

interface AppHeaderProps {
    title: string
    subtitle?: string
    className?: string
}

export default function AppHeader({title, subtitle, className}: AppHeaderProps) {
    return (
        <div className="flex flex-col">
            <h1 className='text-xs'>Edvance App Management</h1>
            <h1 className={cn('text-2xl font-bold', className)}>{title}</h1>
            {subtitle && (
                <h2 className='text-sm text-muted-foreground'>{subtitle}</h2>)}
        </div>
    )
}
