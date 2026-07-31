'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export type StaffRoleOption = { id: string; name: string }
export type StaffMemberFormValues = { name: string; email: string; organizationRoleId: string }
export const EMPTY_STAFF_MEMBER_FORM_VALUES: StaffMemberFormValues = { name: '', email: '', organizationRoleId: '' }

type Props = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: StaffMemberFormValues
  roleOptions: StaffRoleOption[]
  onOpenChange: (open: boolean) => void
  onSubmit: (values: StaffMemberFormValues) => void
}

export function StaffMemberFormSheet({ open, mode, initialValues, roleOptions, onOpenChange, onSubmit }: Props) {
  const [values, setValues] = React.useState(initialValues)
  React.useEffect(() => { if (open) setValues(initialValues) }, [initialValues, open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-lg">
        <form className="flex h-full flex-col" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...values, name: values.name.trim(), email: values.email.trim() }) }}>
          <SheetHeader className="border-b border-border pe-12 text-right">
            <SheetTitle>{mode === 'create' ? '????? ????' : '????? ??????'}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2"><Label htmlFor="staff-name">?????</Label><Input id="staff-name" required disabled={mode === 'edit'} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label htmlFor="staff-email">?????? ??????????</Label><Input id="staff-email" type="email" required disabled={mode === 'edit'} value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>?????</Label>
              <Select dir="rtl" required value={values.organizationRoleId} onValueChange={(value) => setValues((v) => ({ ...v, organizationRoleId: value }))}>
                <SelectTrigger className="w-full text-right"><SelectValue placeholder="???? ?????" /></SelectTrigger>
                <SelectContent>{roleOptions.map((role) => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>?????</Button>
            <Button type="submit" disabled={!values.organizationRoleId}>{mode === 'create' ? '?????' : '???'}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}