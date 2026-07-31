'use client'

import * as React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authServices } from '@/features/shared/auth.services/auth.service'
import { setUser } from '@/lib/cookies'
import { useAuth } from '@/providers/AuthProvider'

export function StaffProfilePage() {
  const { user, updateUser } = useAuth()
  const [values, setValues] = React.useState({ name: '', email: '', phone: '' })
  React.useEffect(() => {
    if (user) setValues({ name: user.name ?? '', email: user.email ?? '', phone: user.phone ?? '' })
  }, [user])
  const mutation = useMutation({
    mutationFn: () => authServices.updateProfile(values),
    onSuccess: (response) => { setUser(response.data); updateUser(response.data) },
  })

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div><h2 className="text-lg font-semibold">ملفي الشخصي</h2><p className="mt-1 text-sm text-muted-foreground">تعديل بيانات حساب الموظف فقط.</p></div>
      <div className="grid gap-4 rounded-xl border bg-card p-6 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="staff-name">الاسم</Label><Input id="staff-name" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="staff-email">البريد الإلكتروني</Label><Input id="staff-email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="staff-phone">رقم الهاتف</Label><Input id="staff-phone" value={values.phone} onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} /></div>
        <div className="flex items-end"><Button disabled={!values.name.trim() || !values.email.trim() || !values.phone.trim() || mutation.isPending} onClick={() => mutation.mutate()}>حفظ بياناتي</Button></div>
      </div>
    </section>
  )
}
