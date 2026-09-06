'use client'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAdminCapabilities, useCreateCapability, useUpdateCapability } from '@/features/admin/capabilities/admin.capabilities.query'
import type { AdminCapabilityItem, CapabilityStatus } from '@/features/admin/capabilities/admin.capabilities.types'

const emptyForm = { name: '', slug: '', status: 'active' as CapabilityStatus, sortOrder: 0 }
export function CapabilitiesManagementPage() {
  const [search, setSearch] = React.useState('')
  const [status, setStatus] = React.useState<'all' | CapabilityStatus>('all')
  const [editing, setEditing] = React.useState<AdminCapabilityItem | null>(null)
  const [form, setForm] = React.useState(emptyForm)
  const query = useAdminCapabilities({ perPage: 100, filter: { search: search || undefined, status: status === 'all' ? undefined : status } })
  const create = useCreateCapability(); const update = useUpdateCapability()
  const submitting = create.isPending || update.isPending
  const save = () => {
    if (!form.name.trim()) return
    const body = { name: form.name.trim(), slug: form.slug.trim() || undefined, status: form.status, sortOrder: Number(form.sortOrder) || 0 }
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: () => { setEditing(null); setForm(emptyForm) } })
    else create.mutate(body, { onSuccess: () => setForm(emptyForm) })
  }
  return <section className="space-y-4">
    <div><h2 className="text-lg font-semibold">طرق المساعدة</h2><p className="text-sm text-muted-foreground">إدارة الإمكانيات التي يختارها المستخدم ضمن التخصيص.</p></div>
    <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-5">
      <input className="h-9 rounded-md border bg-background px-3 text-sm md:col-span-2" placeholder="الاسم" value={form.name} onChange={e=>setForm(v=>({...v,name:e.target.value}))}/>
      <input className="h-9 rounded-md border bg-background px-3 text-sm" placeholder="المعرف (اختياري)" value={form.slug} onChange={e=>setForm(v=>({...v,slug:e.target.value}))}/>
      <input className="h-9 rounded-md border bg-background px-3 text-sm" type="number" min={0} placeholder="الترتيب" value={form.sortOrder} onChange={e=>setForm(v=>({...v,sortOrder:Number(e.target.value)}))}/>
      <div className="flex gap-2"><select className="h-9 flex-1 rounded-md border bg-background px-2 text-sm" value={form.status} onChange={e=>setForm(v=>({...v,status:e.target.value as CapabilityStatus}))}><option value="active">نشط</option><option value="inactive">غير نشط</option></select><Button size="sm" disabled={submitting||!form.name.trim()} onClick={save}>{editing?'حفظ':'إضافة'}</Button>{editing?<Button size="sm" variant="outline" onClick={()=>{setEditing(null);setForm(emptyForm)}}>إلغاء</Button>:null}</div>
    </div>
    <div className="flex gap-2"><input className="h-9 flex-1 rounded-md border bg-background px-3 text-sm" placeholder="بحث بالاسم أو المعرف" value={search} onChange={e=>setSearch(e.target.value)}/><select className="h-9 rounded-md border bg-background px-2 text-sm" value={status} onChange={e=>setStatus(e.target.value as 'all'|CapabilityStatus)}><option value="all">كل الحالات</option><option value="active">نشط</option><option value="inactive">غير نشط</option></select></div>
    <div className="overflow-auto rounded-xl border"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>الاسم</TableHead><TableHead>المعرف</TableHead><TableHead>الحالة</TableHead><TableHead>عدد المستخدمين</TableHead><TableHead>الترتيب</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{query.isLoading?Array.from({length:5}).map((_,i)=><TableRow key={i}>{Array.from({length:7}).map((__,j)=><TableCell key={j}><div className="h-4 animate-pulse rounded bg-muted"/></TableCell>)}</TableRow>):query.data?.data.length?query.data.data.map((row,index)=><TableRow key={row.id}><TableCell className="text-muted-foreground">{index+1}</TableCell><TableCell className="font-medium">{row.name}</TableCell><TableCell>{row.slug}</TableCell><TableCell><Badge variant="outline">{row.status==='active'?'نشط':'غير نشط'}</Badge></TableCell><TableCell>{row.usersCount}</TableCell><TableCell>{row.sortOrder}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={()=>{setEditing(row);setForm({name:row.name,slug:row.slug,status:row.status,sortOrder:row.sortOrder})}}>تعديل</Button><Button size="sm" variant="outline" disabled={update.isPending} onClick={()=>update.mutate({id:row.id,body:{status:row.status==='active'?'inactive':'active'}})}>{row.status==='active'?'تعطيل':'تفعيل'}</Button></div></TableCell></TableRow>):<TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">لا توجد طرق مساعدة بعد.</TableCell></TableRow>}</TableBody></Table></div>
    {query.isError?<div className="rounded-md border border-destructive/30 p-3 text-sm text-destructive">تعذر تحميل طرق المساعدة. <button className="underline" onClick={()=>query.refetch()}>إعادة المحاولة</button></div>:null}
  </section>
}
