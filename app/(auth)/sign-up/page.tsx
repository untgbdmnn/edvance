"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [state, setState] = React.useState({
    username: '',
    email: '',
    password: '',
    loading: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    setState(prev => ({ ...prev, loading: true }))
    const { username, email, password } = state
    if (username === '' || email === '' || password === '') {
      toast.error("Gagal!", {
        description: "Semua field harus diisi",
      })
      setState(prev => ({ ...prev, loading: false }))
      return
    }

    const dataRq = {
      username,
      email,
      password
    }

    const response = await fetchData.POST('auth/register', dataRq)
    if (response.status === 200) {
      toast.success("Berhasil!", {
        description: "Akun berhasil dibuat, silahkan login",
      })
      router.push('/sign-in')
    } else {
      toast.error("Gagal!", {
        description: response.message,
      })
    }
    setState(prev => ({ ...prev, loading: false }))
  }

  return (
    <AuthLayout>
      <SetTitle pageTitle='Sign Up' />
      <div className='lg:w-1/2'>
        <div className='space-y-4'>
          <div className='form-group'>
            <Label htmlFor='username'>Username</Label>
            <Input type='text' value={state.username} name='username' id='username' placeholder='Ketikan username' autoComplete='off' onChange={handleChange} />
          </div>
          <div className='form-group'>
            <Label htmlFor='email'>Email</Label>
            <Input type='email' name='email' id='email' value={state.email} placeholder='Ketikan Email' autoComplete='off' onChange={handleChange} />
          </div>
          <div className='form-group'>
            <Label htmlFor='password'>Password</Label>
            <Input type='password' name='password' id='password' value={state.password} autoComplete='off' onChange={handleChange} onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit()
              }
            }} />
            <span className='text-xs'>Password minimum 8 karakter</span>
          </div>
          <div className='w-full flex items-center justify-center flex-col gap-2'>
            <Button type='button' onClick={handleSubmit} className='w-full cursor-pointer font-semibold' disabled={state.loading}>Register</Button>
            <span className='text-sm font-normal text-center'>Sudah punya akun? <Link href='/sign-in' className='text-sm font-bold text-blue-500'>Login disini!</Link></span>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
