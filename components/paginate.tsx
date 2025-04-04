import { ChevronsLeft, ChevronsRight } from 'lucide-react'
import React from 'react'
import ReactPaginate from 'react-paginate'

interface PaginteProps {
    pageCount: number
    onPageChange: (event: any) => void
    onPage: number
    totalData: number
}

export default function Paginate({ pageCount, onPageChange, onPage, totalData }: PaginteProps) {
    return (
        <div className='w-full flex items-center justify-between'>
            <div className='text-sm font-bold'>Menampilkan {onPage} dari {totalData} data.</div>
            <ReactPaginate
                previousLabel={<ChevronsLeft className='border border-foreground size-8 rounded-sm hover:bg-foreground hover:text-background transition-colors duration-200 cursor-pointer p-0.5' />}
                nextLabel={<ChevronsRight className='border border-foreground size-8 rounded-sm hover:bg-foreground hover:text-background transition-colors duration-200 cursor-pointer p-0.5' />}
                containerClassName='flex items-center p-0.5 space-x-1'
                pageClassName='py-0.5 px-3 text-lg rounded-sm border border-foreground cursor-pointer hover:bg-foreground hover:text-background transition-colors duration-200'
                activeClassName='bg-sidebar-primary text-white'
                pageCount={pageCount} onPageChange={onPageChange} />
        </div>
    )
}
