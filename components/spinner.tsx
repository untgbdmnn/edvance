import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { SyncLoader } from 'react-spinners'

interface Props {
    size?: "large" | "medium" | "small" | "extraSmall" | "extraLarge"
    color?: "white" | "black" | "auto" | "background"
    label?: string
    className?: string
}

export default function Spinner({ size = "medium", color = "auto", label, className }: Props) {
    const { theme } = useTheme()

    const colorVariants = {
        white: "#ffffff",
        black: "#000000",
        auto: theme === "dark" ? "#ffffff" : "#000000",
        background: theme !== "dark" ?  "#ffffff" : "#000000",
    }

    const sizeVariants = {
        extraSmall: 5,
        small: 8,
        medium: 10,
        large: 12,
        extraLarge: 15
    }

    return (
        <div className={cn('flex items-center justify-center flex-col gap-4', className)}>
            <SyncLoader
                color={colorVariants[color]}
                size={sizeVariants[size]}
                speedMultiplier={0.75}
            />
            <h1>{label}</h1>
        </div>
    )
}