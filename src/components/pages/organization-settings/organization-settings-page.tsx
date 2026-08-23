'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'

import { FormLoadingSkeleton, MediaUploadField } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { mediaServices } from '@/features/shared/media/media.services'
import type { MediaItem } from '@/features/shared/media/media.types'
import {
  orgSettingsKeys,
  useOrgSettingsProfile,
  useUpdateOrgSettingsPassword,
  useUpdateOrgSettingsProfile,
} from '@/features/org/settings/org.settings.query'
import { useMediaUploadQueue } from '@/hooks/use-media-upload-queue'
import { normalizeApiError } from '@/lib/api-errors'
import { toast } from '@/lib/toast'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/providers/AuthProvider'

const EMPTY_PROFILE = {
  companyName: '', ownerName: '', organizationNumber: '', registrationNumber: '', bankAccountNumber: '',
  companyEmail: '', companyPhone: '', location: '', website: '',
}

export function OrganizationSettingsPage() {
  const { can } = useAuth()
  const canUpdate = can('org.settings.update')
  const queryClient = useQueryClient()
  const profileQuery = useOrgSettingsProfile()
  const updateProfile = useUpdateOrgSettingsProfile()
  const updatePassword = useUpdateOrgSettingsPassword()
  const logoQueue = useMediaUploadQueue(1)
  const [profileValues, setProfileValues] = React.useState(EMPTY_PROFILE)
  const [passwords, setPasswords] = React.useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordError, setPasswordError] = React.useState<string | null>(null)
  const [busyMediaIds, setBusyMediaIds] = React.useState<Set<string>>(new Set())

  const profile = profileQuery.data?.data
  React.useEffect(() => {
    if (!profile) return
    setProfileValues({
      companyName: profile.companyName ?? '', ownerName: profile.ownerName ?? '',
      organizationNumber: profile.organizationNumber ?? '', registrationNumber: profile.registrationNumber ?? '',
      bankAccountNumber: profile.bankAccountNumber ?? '', companyEmail: profile.companyEmail ?? '',
      companyPhone: profile.companyPhone ?? '', location: profile.location ?? '', website: profile.website ?? '',
    })
  }, [profile])

  const refreshProfile = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: orgSettingsKeys.profile })
  }, [queryClient])

  const target = profile ? { model: 'organization' as const, modelId: profile.id, prop: 'logo' as const } : null
  const existingLogo = profile?.logo ? [profile.logo] : []
  const mediaBusy = busyMediaIds.size > 0 || logoQueue.isUploading
  const formBusy = updateProfile.isPending || updatePassword.isPending || mediaBusy

  const changeProfile = (key: keyof typeof profileValues, value: string) => {
    setProfileValues((current) => ({ ...current, [key]: value }))
  }

  const replaceLogo = async (media: MediaItem, file: File) => {
    if (!target) return
    setBusyMediaIds((current) => new Set(current).add(media.id))
    try {
      await mediaServices.replace(target, media.id, file)
      await refreshProfile()
      toast.success('تم استبدال شعار المنظمة بنجاح.')
    } catch (error) {
      toast.error(normalizeApiError(error).message)
    } finally {
      setBusyMediaIds((current) => { const next = new Set(current); next.delete(media.id); return next })
    }
  }

  const deleteLogo = async (media: MediaItem) => {
    if (!target) return
    setBusyMediaIds((current) => new Set(current).add(media.id))
    try {
      await mediaServices.remove(target, media.id)
      await refreshProfile()
      toast.success('تم حذف شعار المنظمة.')
    } catch (error) {
      toast.error(normalizeApiError(error).message)
    } finally {
      setBusyMediaIds((current) => { const next = new Set(current); next.delete(media.id); return next })
    }
  }

  if (profileQuery.isLoading) {
    return <div className="rounded-xl border bg-card p-6"><FormLoadingSkeleton count={8} /></div>
  }

  if (!profile || profileQuery.isError) {
    return <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">تعذر تحميل إعدادات المنظمة.</div>
  }

  return (
    <section className="flex flex-1 flex-col gap-6">
      <div><h2 className="text-lg font-semibold">إعدادات المؤسسة</h2><p className="mt-1 text-sm text-muted-foreground">بيانات المؤسسة، الشعار، وكلمة المرور.</p></div>

      <form className="space-y-5 rounded-xl border bg-card p-6" onSubmit={(event) => {
        event.preventDefault()
        if (!canUpdate) return
        updateProfile.mutate({ ...profileValues, website: profileValues.website || null })
      }}>
        <h3 className="text-sm font-semibold">بيانات المنظمة</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="اسم المنظمة"><Input value={profileValues.companyName} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('companyName', e.target.value)} /></Field>
          <Field label="اسم المالك"><Input value={profileValues.ownerName} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('ownerName', e.target.value)} /></Field>
          <Field label="رقم المنظمة"><Input value={profileValues.organizationNumber} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('organizationNumber', e.target.value)} /></Field>
          <Field label="رقم السجل"><Input value={profileValues.registrationNumber} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('registrationNumber', e.target.value)} /></Field>
          <Field label="رقم الحساب البنكي"><Input dir="ltr" value={profileValues.bankAccountNumber} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('bankAccountNumber', e.target.value)} /></Field>
          <Field label="البريد الرسمي"><Input type="email" dir="ltr" value={profileValues.companyEmail} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('companyEmail', e.target.value)} /></Field>
          <Field label="الهاتف الرسمي"><Input type="tel" dir="ltr" value={profileValues.companyPhone} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('companyPhone', e.target.value)} /></Field>
          <Field label="الموقع"><Input value={profileValues.location} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('location', e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="الموقع الإلكتروني"><Input type="url" dir="ltr" value={profileValues.website} disabled={!canUpdate || formBusy} onChange={(e) => changeProfile('website', e.target.value)} /></Field></div>
        </div>
        {canUpdate ? <Button type="submit" disabled={formBusy}>{updateProfile.isPending ? <Loader2 className="size-4 animate-spin" /> : null}حفظ بيانات المنظمة</Button> : null}
      </form>

      <div className="space-y-4 rounded-xl border bg-card p-6">
        <h3 className="text-sm font-semibold">شعار المنظمة</h3>
        <MediaUploadField
          label="الشعار"
          items={logoQueue.items}
          existingMedia={existingLogo}
          busyMediaIds={busyMediaIds}
          maxItems={1}
          multiple={false}
          disabled={!canUpdate || formBusy}
          onFilesSelected={(files) => { logoQueue.reset(); logoQueue.addFiles(files.slice(0, 1)) }}
          onRemoveQueued={logoQueue.removeItem}
          onDeleteExisting={canUpdate ? deleteLogo : undefined}
          onReplaceExisting={canUpdate ? replaceLogo : undefined}
        />
        {canUpdate && target && !profile.logo && logoQueue.hasQueued ? (
          <Button type="button" disabled={formBusy} onClick={async () => {
            const result = await logoQueue.uploadAll(target)
            if (result.failed) toast.error(`تعذر رفع الشعار ${result.failedFileNames.join('، ')}`)
            else { logoQueue.reset(); await refreshProfile(); toast.success('تم رفع شعار المنظمة بنجاح.') }
          }}>{logoQueue.isUploading ? <Loader2 className="size-4 animate-spin" /> : null}رفع الشعار</Button>
        ) : null}
      </div>

      {canUpdate ? (
        <form className="space-y-4 rounded-xl border bg-card p-6" onSubmit={(event) => {
          event.preventDefault()
          setPasswordError(null)
          if (!passwords.currentPassword || passwords.newPassword.length < 8) {
            setPasswordError('أدخل كلمة المرور الحالية وكلمة مرور جديدة من 8 أحرف على الأقل.')
            return
          }
          if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordError('تأكيد كلمة المرور غير متطابق.')
            return
          }
          updatePassword.mutate({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
            newPassword_confirmation: passwords.confirmPassword,
          }, { onSuccess: () => setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }) })
        }}>
          <h3 className="text-sm font-semibold">تغيير كلمة المرور</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="كلمة المرور الحالية"><PasswordInput value={passwords.currentPassword} disabled={formBusy} onChange={(e) => setPasswords((v) => ({ ...v, currentPassword: e.target.value }))} /></Field>
            <Field label="كلمة المرور الجديدة"><PasswordInput value={passwords.newPassword} disabled={formBusy} onChange={(e) => setPasswords((v) => ({ ...v, newPassword: e.target.value }))} /></Field>
            <Field label="تأكيد كلمة المرور"><PasswordInput value={passwords.confirmPassword} disabled={formBusy} onChange={(e) => setPasswords((v) => ({ ...v, confirmPassword: e.target.value }))} /></Field>
          </div>
          {passwordError ? <p className="text-xs text-destructive">{passwordError}</p> : null}
          <Button type="submit" disabled={formBusy}>{updatePassword.isPending ? <Loader2 className="size-4 animate-spin" /> : null}تحديث كلمة المرور</Button>
        </form>
      ) : <p className="text-sm text-muted-foreground">لديك صلاحية عرض الإعدادات فقط.</p>}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>
}
