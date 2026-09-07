"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props = { open: boolean; name: string; usersCount: number; isDeleting: boolean; onOpenChange: (open: boolean) => void; onConfirm: () => void };

export function CapabilityDeleteDialog({ open, name, usersCount, isDeleting, onOpenChange, onConfirm }: Props) {
  const isUsed = usersCount > 0;
  return <Dialog open={open} onOpenChange={(next) => !isDeleting && onOpenChange(next)}><DialogContent dir="rtl" className="sm:max-w-md"><DialogHeader className="pe-12 text-right sm:text-right"><DialogTitle>{isUsed ? "تعطيل طريقة المساعدة؟" : "حذف طريقة المساعدة؟"}</DialogTitle><DialogDescription className="leading-6">{isUsed ? `طريقة «${name}» مرتبطة بـ ${usersCount} مستخدم، لذلك سيقوم النظام بتعطيلها بدل حذفها للحفاظ على البيانات السابقة.` : `سيتم حذف طريقة «${name}» نهائيًا لأنها غير مستخدمة حاليًا.`}</DialogDescription></DialogHeader><DialogFooter className="sm:justify-start"><Button type="button" variant="outline" disabled={isDeleting} onClick={() => onOpenChange(false)}>إلغاء</Button><Button type="button" variant={isUsed ? "default" : "destructive"} disabled={isDeleting} onClick={onConfirm}>{isUsed ? "تعطيل" : "حذف"}</Button></DialogFooter></DialogContent></Dialog>;
}
