'use client'

import * as React from 'react'
import {
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Replace,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { organizationVideosServices } from '@/features/shared/organization-videos/organization-videos.services'
import { useOrganizationVideos } from '@/features/shared/organization-videos/organization-videos.query'
import { organizationVideosKeys } from '@/features/shared/organization-videos/organization-videos.query-keys'
import type {
  OrganizationVideo,
  OrganizationVideosScope,
} from '@/features/shared/organization-videos/organization-videos.types'
import {
  ORGANIZATION_VIDEO_DESCRIPTION_MAX_LENGTH,
  ORGANIZATION_VIDEO_MAX_COUNT,
  validateOrganizationVideoFile,
} from '@/features/shared/organization-videos/organization-videos.types'
import { useResumableOrganizationVideoUpload } from '@/hooks/use-resumable-organization-video-upload'
import { normalizeApiError } from '@/lib/api-errors'
import { toast } from '@/lib/toast'

type OrganizationVideosSectionProps = {
  scope: OrganizationVideosScope
  organizationId?: string
  canManage?: boolean
  title?: string
  description?: string
}

type UploadDialogState = {
  open: boolean
  replaceVideo: OrganizationVideo | null
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function phaseLabel(phase: ReturnType<typeof useResumableOrganizationVideoUpload>['phase']): string {
  switch (phase) {
    case 'recovering': return 'جاري استعادة جلسة الرفع...'
    case 'initiating': return 'جاري بدء الرفع...'
    case 'uploading': return 'جاري رفع الفيديو...'
    case 'pausing': return 'جاري إيقاف الرفع مؤقتًا...'
    case 'paused': return 'الرفع متوقف مؤقتًا'
    case 'resuming': return 'جاري متابعة الرفع...'
    case 'needs-file': return 'يلزم اختيار الملف نفسه لمتابعة الرفع'
    case 'assembling': return 'تم رفع الملف، جاري معالجة الفيديو...'
    case 'error': return 'توقف الرفع ويحتاج إلى متابعة'
    default: return 'رفع الفيديو'
  }
}

export function OrganizationVideosSection({
  scope,
  organizationId,
  canManage = true,
  title = 'فيديوهات المنظمة',
  description = 'أضف فيديوهات تعريفية وترويجية للمنظمة. الحد الأقصى 10 فيديوهات، وحجم كل فيديو 100 MB.',
}: OrganizationVideosSectionProps) {
  const queryClient = useQueryClient()
  const videosQuery = useOrganizationVideos(scope, organizationId)
  const upload = useResumableOrganizationVideoUpload({ scope, organizationId })
  const [uploadDialog, setUploadDialog] = React.useState<UploadDialogState>({ open: false, replaceVideo: null })
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [videoDescription, setVideoDescription] = React.useState('')
  const [formError, setFormError] = React.useState<string | null>(null)
  const [deleteVideo, setDeleteVideo] = React.useState<OrganizationVideo | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const recoveryFileInputRef = React.useRef<HTMLInputElement | null>(null)

  const videos = videosQuery.data ?? []
  const atLimit = videos.length >= ORGANIZATION_VIDEO_MAX_COUNT
  const busy = upload.isActive || upload.phase !== 'idle'

  const resetUploadDialog = React.useCallback(() => {
    setSelectedFile(null)
    setVideoDescription('')
    setFormError(null)
    setUploadDialog({ open: false, replaceVideo: null })
  }, [])

  const openCreateDialog = () => {
    if (atLimit) {
      toast.info('وصلت المنظمة إلى الحد الأقصى وهو 10 فيديوهات.')
      return
    }
    setSelectedFile(null)
    setVideoDescription('')
    setFormError(null)
    setUploadDialog({ open: true, replaceVideo: null })
  }

  const openReplaceDialog = (video: OrganizationVideo) => {
    setSelectedFile(null)
    setVideoDescription(video.description ?? '')
    setFormError(null)
    setUploadDialog({ open: true, replaceVideo: video })
  }

  const submitUpload = async () => {
    if (!selectedFile) {
      setFormError('اختر ملف فيديو أولًا.')
      return
    }
    const validation = validateOrganizationVideoFile(selectedFile)
    if (validation) {
      setFormError(validation)
      return
    }
    if (videoDescription.length > ORGANIZATION_VIDEO_DESCRIPTION_MAX_LENGTH) {
      setFormError('وصف الفيديو يجب ألا يتجاوز 5000 حرف.')
      return
    }

    const started = await upload.start({
      file: selectedFile,
      description: videoDescription.trim() || null,
      replaceVideoId: uploadDialog.replaceVideo?.id ?? null,
    })
    if (started) resetUploadDialog()
  }

  const removeVideo = async () => {
    if (!deleteVideo) return
    setDeletingId(deleteVideo.id)
    try {
      await organizationVideosServices.remove(scope, organizationId, deleteVideo.id)
      await queryClient.invalidateQueries({ queryKey: organizationVideosKeys.list(scope, organizationId) })
      toast.success('تم حذف الفيديو بنجاح.')
      setDeleteVideo(null)
    } catch (error) {
      toast.error(normalizeApiError(error).message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="space-y-4 rounded-xl border bg-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{title}</h3>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {videos.length}/{ORGANIZATION_VIDEO_MAX_COUNT}
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">{description}</p>
        </div>
        {canManage ? (
          <Button type="button" onClick={openCreateDialog} disabled={busy || atLimit || videosQuery.isLoading}>
            <Upload className="size-4" />
            إضافة فيديو
          </Button>
        ) : null}
      </div>

      {upload.session || upload.phase === 'recovering' ? (
        <div className="space-y-3 rounded-lg border border-primary/25 bg-primary/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-foreground">{phaseLabel(upload.phase)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {upload.session?.originalName ?? upload.persistedMetadata?.fileName ?? 'الفيديو'}
                {upload.session ? ` · ${formatBytes(upload.optimisticUploadedBytes)} من ${formatBytes(upload.session.totalSize)}` : ''}
              </p>
            </div>
            <span className="text-sm font-semibold text-primary">{Math.round(upload.progressPercent)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${Math.max(0, Math.min(100, upload.progressPercent))}%` }}
            />
          </div>

          {upload.error ? <p className="text-xs leading-5 text-destructive">{upload.error}</p> : null}
          {upload.needsFileReselection && upload.persistedMetadata ? (
            <div className="rounded-md border border-dashed border-border bg-background p-3 text-xs text-muted-foreground">
              <p>
                بعد تحديث الصفحة لا يمكن للمتصفح استعادة الملف تلقائيًا. اختر الملف نفسه:
                <span className="ms-1 font-medium text-foreground">{upload.persistedMetadata.fileName}</span>
              </p>
              <input
                ref={recoveryFileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                className="hidden"
                onChange={(event) => {
                  const candidate = event.target.files?.[0]
                  if (candidate) upload.reselectFile(candidate)
                  event.currentTarget.value = ''
                }}
              />
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => recoveryFileInputRef.current?.click()}>
                <Upload className="size-4" />
                اختيار الملف نفسه
              </Button>
            </div>
          ) : null}

          {canManage ? (
            <div className="flex flex-wrap gap-2">
              {upload.session?.canPause && upload.phase === 'uploading' ? (
                <Button type="button" variant="outline" size="sm" onClick={() => void upload.pause()}>
                  <Pause className="size-4" />
                  إيقاف مؤقت
                </Button>
              ) : null}
              {(upload.phase === 'paused' || upload.phase === 'error') && upload.session ? (
                <Button type="button" variant="outline" size="sm" onClick={() => void upload.resume()}>
                  <Play className="size-4" />
                  متابعة
                </Button>
              ) : null}
              {upload.session && upload.session.status !== 'assembling' && upload.session.status !== 'completed' ? (
                <Button type="button" variant="destructive" size="sm" onClick={() => void upload.cancel()}>
                  <X className="size-4" />
                  إلغاء الرفع
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {videosQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-64 animate-pulse rounded-lg border bg-muted" />
          ))}
        </div>
      ) : videosQuery.isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p>تعذر تحميل فيديوهات المنظمة.</p>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void videosQuery.refetch()}>
            <RefreshCw className="size-4" />
            إعادة المحاولة
          </Button>
        </div>
      ) : videos.length === 0 ? (
        <EmptyState
          icon="organizations"
          title="لا توجد فيديوهات بعد"
          description={canManage ? 'أضف أول فيديو تعريفي أو ترويجي للمنظمة.' : 'لم تضف المنظمة أي فيديوهات حتى الآن.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="overflow-hidden rounded-lg border bg-background shadow-xs">
              <video
                src={video.url}
                controls
                preload="metadata"
                playsInline
                className="aspect-video w-full bg-black object-contain"
              >
                متصفحك لا يدعم تشغيل الفيديو.
              </video>
              <div className="space-y-3 p-4">
                <div>
                  <p className="truncate text-sm font-semibold text-foreground" title={video.originalName}>{video.originalName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatBytes(video.size)}</p>
                </div>
                {video.description ? (
                  <p className="line-clamp-3 text-xs leading-6 text-muted-foreground">{video.description}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">بدون وصف.</p>
                )}
                {canManage ? (
                  <div className="flex flex-wrap gap-2 border-t pt-3">
                    <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => openReplaceDialog(video)}>
                      <Replace className="size-4" />
                      استبدال
                    </Button>
                    <Button type="button" variant="destructive" size="sm" disabled={busy || deletingId === video.id} onClick={() => setDeleteVideo(video)}>
                      {deletingId === video.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                      حذف
                    </Button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={uploadDialog.open} onOpenChange={(open) => { if (!open) resetUploadDialog() }}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{uploadDialog.replaceVideo ? 'استبدال الفيديو' : 'إضافة فيديو جديد'}</DialogTitle>
            <DialogDescription>
              {uploadDialog.replaceVideo
                ? 'سيبقى الفيديو الحالي متاحًا حتى يكتمل رفع البديل ومعالجته بنجاح.'
                : 'يتم رفع الفيديو على أجزاء ويمكن إيقاف العملية ومتابعتها لاحقًا.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="organization-video-file">ملف الفيديو</Label>
              <input
                id="organization-video-file"
                type="file"
                accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                className="file:text-foreground h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm file:me-3 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null
                  setSelectedFile(nextFile)
                  setFormError(nextFile ? validateOrganizationVideoFile(nextFile) : null)
                }}
              />
              <p className="text-xs text-muted-foreground">MP4 أو MOV أو WebM — بحد أقصى 100 MB.</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="organization-video-description">الوصف</Label>
                <span className="text-xs text-muted-foreground">{videoDescription.length}/{ORGANIZATION_VIDEO_DESCRIPTION_MAX_LENGTH}</span>
              </div>
              <Textarea
                id="organization-video-description"
                value={videoDescription}
                maxLength={ORGANIZATION_VIDEO_DESCRIPTION_MAX_LENGTH}
                rows={5}
                placeholder="اكتب وصفًا مختصرًا يظهر مع الفيديو في التطبيق..."
                onChange={(event) => setVideoDescription(event.target.value)}
              />
            </div>
            {formError ? <p className="text-xs text-destructive">{formError}</p> : null}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" onClick={resetUploadDialog}>إلغاء</Button>
            <Button type="button" onClick={() => void submitUpload()} disabled={!selectedFile || Boolean(formError)}>
              <Upload className="size-4" />
              {uploadDialog.replaceVideo ? 'بدء الاستبدال' : 'بدء الرفع'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleteVideo)} onOpenChange={(open) => { if (!open && !deletingId) setDeleteVideo(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>حذف الفيديو</DialogTitle>
            <DialogDescription>
              سيتم حذف الفيديو المكتمل نهائيًا من فيديوهات المنظمة. هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <p className="rounded-md bg-muted p-3 text-sm text-foreground">{deleteVideo?.originalName}</p>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="outline" disabled={Boolean(deletingId)} onClick={() => setDeleteVideo(null)}>إلغاء</Button>
            <Button type="button" variant="destructive" disabled={Boolean(deletingId)} onClick={() => void removeVideo()}>
              {deletingId ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              حذف الفيديو
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
