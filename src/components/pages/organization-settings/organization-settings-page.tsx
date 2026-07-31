'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrgBankAccount, useOrgSettingsProfile, useUpdateOrgBankAccount, useUpdateOrgSettingsProfile } from '@/features/org/settings/org.settings.query'
import { useAuth } from '@/providers/AuthProvider'

export function OrganizationSettingsPage() {
  const { can } = useAuth()
  const canUpdate = can('org.settings.update')
  const profile = useOrgSettingsProfile()
  const bank = useOrgBankAccount()
  const updateProfile = useUpdateOrgSettingsProfile()
  const updateBank = useUpdateOrgBankAccount()
  const [values, setValues] = React.useState({ name: '', email: '', phone: '', bankName: '', iban: '' })

  React.useEffect(() => {
    setValues((current) => ({
      ...current,
      name: profile.data?.data.name ?? '',
      email: profile.data?.data.email ?? '',
      phone: profile.data?.data.phone ?? '',
    }))
  }, [profile.data])
  React.useEffect(() => {
    setValues((current) => ({ ...current, bankName: bank.data?.data.bankName ?? '', iban: bank.data?.data.iban ?? '' }))
  }, [bank.data])

  const field = (key: keyof typeof values, label: string) => <div className="space-y-2"><Label htmlFor={key}>{label}</Label><Input id={key} disabled={!canUpdate} value={values[key]} onChange={(event) => setValues((current) => ({ ...current, [key]: event.target.value }))} /></div>

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div><h2 className="text-lg font-semibold">إعدادات المؤسسة</h2><p className="mt-1 text-sm text-muted-foreground">بيانات المؤسسة والحساب البنكي المرتبط بها.</p></div>
      <div className="space-y-6 rounded-xl border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">{field('name', 'اسم المؤسسة')}{field('email', 'البريد الإلكتروني')}{field('phone', 'رقم الهاتف')}</div>
        <div className="grid gap-4 border-t pt-6 sm:grid-cols-2">{field('bankName', 'اسم البنك')}{field('iban', 'رقم الآيبان')}</div>
        {canUpdate ? <div className="flex gap-2"><Button onClick={() => updateProfile.mutate({ name: values.name, email: values.email, phone: values.phone })}>حفظ بيانات المؤسسة</Button><Button variant="outline" onClick={() => updateBank.mutate({ bankName: values.bankName || null, iban: values.iban || null })}>حفظ الحساب البنكي</Button></div> : <p className="text-sm text-muted-foreground">لديك صلاحية عرض الإعدادات فقط.</p>}
      </div>
    </section>
  )
}
