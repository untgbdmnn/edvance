"use client"

import React from 'react'
import { TbCircleLetterE } from 'react-icons/tb'

interface AuthLayoutProps {
  children: React.ReactNode
  type?: 'login' | 'register'
}
export default function AuthLayout({ children, type }: AuthLayoutProps) {
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center'>
      <div className='flex flex-col gap-2 items-center justify-center text-center my-5'>
        <div className='size-10 bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square items-center justify-center rounded-sm'>
          <TbCircleLetterE className='size-8' />
        </div>
        <div className='flex flex-col items-center justify-center text-center'>
          <h1 className='text-center font-bold text-xl'>Edvance</h1>
          <h1 className='text-sm font-normal'>School Management App</h1>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center w-full max-w-3xl'>
        <div className='flex flex-col items-center justify-center text-center my-2'>
          <h1 className='text-2xl font-bold'>{type === 'login' ? 'Login' : 'Register'}</h1>
          {type === 'login' ? (
            <p className='text-sm font-normal'>Silahkan login untuk melanjutkan!</p>
          ) : (
            <p className='text-sm font-normal'>Silahkan isi data diri anda!</p>
          )}
        </div>
        <div className='my-4 w-full flex items-center flex-col'>{children}</div>
      </div>
    </div>
  )
}
