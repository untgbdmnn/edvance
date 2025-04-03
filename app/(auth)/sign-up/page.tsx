"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'
import { SetTitle } from '@/lib/setHelmet'
import Link from 'next/link'
import * as React from 'react'

export default function RegisterPage() {
  const [state, setState] = React.useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    console.log(state)
  }

  return (
    <AuthLayout>
      <SetTitle pageTitle='Sign Up' />
      <div className='w-1/2'>
        <div className='space-y-4'>
          <div className='form-group'>
            <Label htmlFor='username'>Username</Label>
            <Input type='text' value={state.username} name='username' id='username' placeholder='Ketikan username' autoComplete='off' onChange={handleChange}/>
          </div>
          <div className='form-group'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' name='email' id='email' value={state.email} placeholder='Ketikan Email' autoComplete='off' onChange={handleChange}/>
          </div>
          <div className='form-group'>
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' id='password' value={state.password} autoComplete='off' onChange={handleChange}/>
            <span className='text-xs'>Password minimum 8 karakter</span>
          </div>
          <div className='w-full flex items-center justify-center flex-col gap-2'>
            <Button type='button' onClick={handleSubmit} className='w-full cursor-pointer font-semibold'>Register</Button>
            <span className='text-sm font-normal text-center'>Sudah punya akun? <Link href='/sign-in' className='text-sm font-bold text-blue-500'>Login disini!</Link></span>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
