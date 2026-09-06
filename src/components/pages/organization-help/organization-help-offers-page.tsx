'use client'

import * as React from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState, ListLoadingSkeleton } from '@/components/shared'
import { useOrgHelpOfferAction, useOrgHelpOffers } from '@/features/org/help/org.help.query'
import type { HelpOfferStatus } from '@/features/org/help/org.help.types'
import { toast } from '@/lib/toast'

const labels: Record<string,string> = { pending:'بانتظار المراجعة', accepted:'مقبول', contacting:'تم التواصل', agreed:'تم الاتفاق', completed:'مكتمل', rejected:'مرفوض' }
export function OrganizationHelpOffersPage() {
  const [status,setStatus]=React.useState('all')
  const query=useOrgHelpOffers({perPage:100,status:status==='all'?undefined:status as HelpOfferStatus})
  const action=useOrgHelpOfferAction()
  const run=async(id:string,name:'accept'|'reject'|'contact'|'agree'|'confirm-received')=>{try{await action.mutateAsync({id,action:name});toast.success('تم تحديث العرض.')}catch{toast.error('تعذر تنفيذ الإجراء.')}}
  const rows=query.data?.data??[]
  return <section className="space-y-4"><div><h2 className="text-lg font-semibold">عروض المساعدة الواردة</h2><p className="text-sm text-muted-foreground">راجع العروض المرتبطة بطلبات منظمتك ونفّذ الإجراءات المتاحة حسب الحالة.</p></div><div className="w-72"><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">كل الحالات</SelectItem>{Object.entries(labels).map(([value,label])=><SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select></div>{query.isLoading?<ListLoadingSkeleton/>:rows.length===0?<EmptyState icon="donors" title="لم تصل أي عروض مساعدة حتى الآن" description="ستظهر عروض المساعدة الواردة هنا."/>:<div className="overflow-x-auto rounded-xl border bg-card"><Table><TableHeader><TableRow><TableHead className="w-12">#</TableHead><TableHead>الطلب</TableHead><TableHead>المساعد</TableHead><TableHead>نوع العرض</TableHead><TableHead>الحالة</TableHead><TableHead>التاريخ</TableHead><TableHead>الإجراءات</TableHead></TableRow></TableHeader><TableBody>{rows.map((offer,index)=><TableRow key={offer.id}><TableCell className="text-muted-foreground">{index+1}</TableCell><TableCell>{offer.request?.title??'-'}</TableCell><TableCell>{offer.helper.name??'-'}</TableCell><TableCell>{offer.type??'-'}</TableCell><TableCell><Badge variant="outline">{labels[offer.status]??offer.status}</Badge></TableCell><TableCell>{offer.createdAt?new Date(offer.createdAt).toLocaleDateString('ar-SY'):'-'}</TableCell><TableCell><div className="flex flex-wrap gap-1">{offer.can.accept?<Button size="sm" onClick={()=>run(offer.id,'accept')}>قبول</Button>:null}{offer.can.reject?<Button size="sm" variant="destructive" onClick={()=>run(offer.id,'reject')}>رفض</Button>:null}{offer.can.contact?<Button size="sm" variant="outline" onClick={()=>run(offer.id,'contact')}>تواصل</Button>:null}{offer.status==='contacting'?<Button size="sm" variant="outline" onClick={()=>run(offer.id,'agree')}>اتفاق</Button>:null}{offer.can.confirmReceived?<Button size="sm" onClick={()=>run(offer.id,'confirm-received')}>تأكيد الإتمام</Button>:null}</div></TableCell></TableRow>)}</TableBody></Table></div>}</section>
}
