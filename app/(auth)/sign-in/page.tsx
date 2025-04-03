"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'
import useAuthStore from '@/lib/authStore'
import fetchData from '@/lib/fetchData'
import { SetTitle } from '@/lib/setHelmet'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [state, setState] = React.useState({
    email: '',
    password: '',
    loading: false
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
    const { email, password } = state
    if (email === '' || password === '') {
      toast.warning('Gagal!', {
        description: 'Email dan password tidak boleh kosong!'
      })
      setState(prev => ({ ...prev, loading: false }))
      return
    }
    const body = {
      email,
      password
    }
    const response = await fetchData.POST('auth/login', body)
    if (response.status === 200) {
      const { token, data } = response;
      setAuth(token, data)
      toast.success('Berhasil!', {
        description: response.message
      })
      router.push('/dashboard')
    } else {
      toast.error('Gagal!', {
        description: response.message
      })
    }
    setState(prev => ({ ...prev, loading: false }))
  }

  return (
    <AuthLayout type='login'>
      <SetTitle pageTitle='Sign In' />
      <div className='w-1/2'>
        <div className='space-y-4'>
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
            <span className='text-xs text-muted-foreground'>Password minimum 8 karakter</span>
          </div>
          <div className='w-full flex items-center justify-center flex-col gap-2'>
            <Button type='button' onClick={handleSubmit} disabled={state.loading} className='w-full cursor-pointer font-semibold'>Login</Button>
            <span className='text-sm font-normal text-center'>Belum punya akun? <Link href='/sign-up' className='text-sm font-bold text-blue-500'>Register disini!</Link></span>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
