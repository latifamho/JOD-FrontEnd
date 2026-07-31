'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useOrgSettingsProfile, useUpdateOrgSettingsProfile } from '@/features/org/settings/org.settings.query'

export function OrganizationProfilePage() {
  const profile = useOrgSettingsProfile()
  const updateProfile = useUpdateOrgSettingsProfile()
  const [values, setValues] = React.useState({ name: '', email: '', phone: '' })

  React.useEffect(() => {
    if (!profile.data) return
    setValues({ name: profile.data.data.name ?? '', email: profile.data.data.email ?? '', phone: profile.data.data.phone ?? '' })
  }, [profile.data])

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div><h2 className="text-lg font-semibold">الملف التعريفي للمؤسسة</h2><p className="mt-1 text-sm text-muted-foreground">تعديل البيانات الأساسية الظاهرة باسم المؤسسة.</p></div>
      <div className="grid gap-4 rounded-xl border bg-card p-6 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="org-name">اسم المؤسسة</Label><Input id="org-name" value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="org-email">البريد الإلكتروني</Label><Input id="org-email" type="email" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} /></div>
        <div className="space-y-2"><Label htmlFor="org-phone">رقم الهاتف</Label><Input id="org-phone" value={values.phone} onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} /></div>
        <div className="flex items-end"><Button disabled={!values.name.trim() || !values.email.trim() || updateProfile.isPending} onClick={() => updateProfile.mutate(values)}>حفظ الملف التعريفي</Button></div>
      </div>
    </section>
  )
}
