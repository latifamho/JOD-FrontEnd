'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import type { OrgPermissionCatalogItem } from '@/features/org/staff/org.staff.types'

export type StaffRoleFormValues = { name: string; description: string; permissions: string[]; isActive: boolean }
export const EMPTY_STAFF_ROLE_FORM_VALUES: StaffRoleFormValues = { name: '', description: '', permissions: [], isActive: true }

type Props = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: StaffRoleFormValues
  permissionOptions: OrgPermissionCatalogItem[]
  onOpenChange: (open: boolean) => void
  onSubmit: (values: StaffRoleFormValues) => void
}

export function StaffRoleFormSheet({ open, mode, initialValues, permissionOptions, onOpenChange, onSubmit }: Props) {
  const [values, setValues] = React.useState(initialValues)
  React.useEffect(() => { if (open) setValues(initialValues) }, [initialValues, open])
  const toggle = (id: string, checked: boolean) => setValues((current) => ({ ...current, permissions: checked ? Array.from(new Set([...current.permissions, id])) : current.permissions.filter((permission) => permission !== id) }))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" dir="rtl" className="w-[95vw] border-border p-0 sm:max-w-2xl">
        <form className="flex h-full flex-col" onSubmit={(event) => { event.preventDefault(); onSubmit({ ...values, name: values.name.trim(), description: values.description.trim() }) }}>
          <SheetHeader className="border-b border-border pe-12 text-right"><SheetTitle>{mode === 'create' ? '????? ???' : '????? ?????'}</SheetTitle></SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="space-y-2"><Label htmlFor="role-name">??? ?????</Label><Input id="role-name" required disabled={mode === 'edit'} value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} /></div>
            <div className="space-y-2"><Label>??????</Label><Select value={values.isActive ? 'active' : 'inactive'} onValueChange={(value) => setValues((v) => ({ ...v, isActive: value === 'active' }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="active">?????</SelectItem><SelectItem value="inactive">?????</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="role-description">?????</Label><Textarea id="role-description" value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} /></div>
            <div className="rounded-md border"><Table><TableHeader><TableRow><TableHead className="w-16">??????</TableHead><TableHead>????????</TableHead><TableHead>?????</TableHead></TableRow></TableHeader><TableBody>{permissionOptions.map((option) => <TableRow key={option.id}><TableCell><Checkbox checked={values.permissions.includes(option.id)} onCheckedChange={(checked) => toggle(option.id, checked === true)} /></TableCell><TableCell>{option.label}</TableCell><TableCell className="text-xs text-muted-foreground">{option.description}</TableCell></TableRow>)}</TableBody></Table></div>
          </div>
          <SheetFooter className="border-t border-border pt-4 sm:flex-row sm:justify-start"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>?????</Button><Button type="submit">???</Button></SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}