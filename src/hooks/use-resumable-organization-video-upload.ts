'use client'

import * as React from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import { organizationVideosServices } from '@/features/shared/organization-videos/organization-videos.services'
import { organizationVideosKeys } from '@/features/shared/organization-videos/organization-videos.query-keys'
import type {
  OrganizationVideosScope,
  PersistedVideoUploadMetadata,
  VideoUploadSession,
} from '@/features/shared/organization-videos/organization-videos.types'
import { resolveOrganizationVideoMimeType } from '@/features/shared/organization-videos/organization-videos.types'
import { normalizeApiError } from '@/lib/api-errors'
import { toast } from '@/lib/toast'

export type OrganizationVideoUploadPhase =
  | 'idle'
  | 'recovering'
  | 'initiating'
  | 'uploading'
  | 'pausing'
  | 'paused'
  | 'resuming'
  | 'needs-file'
  | 'assembling'
  | 'error'

type Options = { scope: OrganizationVideosScope; organizationId?: string }
type StartInput = { file: File; description?: string | null; replaceVideoId?: string | null }

const ASSEMBLING_POLL_DELAY_MS = 1500
const ASSEMBLING_MAX_POLLS = 60

function storageKey(scope: OrganizationVideosScope, organizationId?: string): string {
  return `jod:organization-video-upload:${scope}:${organizationId || 'self'}`
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function readPersistedUpload(key: string): PersistedVideoUploadMetadata | null {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PersistedVideoUploadMetadata>
    if (!parsed.uploadId || !parsed.organizationId || !parsed.fileName || !parsed.fileSize || !parsed.scope) return null
    return parsed as PersistedVideoUploadMetadata
  } catch {
    return null
  }
}

export function useResumableOrganizationVideoUpload({ scope, organizationId }: Options) {
  const queryClient = useQueryClient()
  const key = React.useMemo(() => storageKey(scope, organizationId), [scope, organizationId])
  const [session, setSession] = React.useState<VideoUploadSession | null>(null)
  const [file, setFile] = React.useState<File | null>(null)
  const [persistedMetadata, setPersistedMetadata] = React.useState<PersistedVideoUploadMetadata | null>(null)
  const [phase, setPhase] = React.useState<OrganizationVideoUploadPhase>('idle')
  const [error, setError] = React.useState<string | null>(null)
  const [activeChunkLoadedBytes, setActiveChunkLoadedBytes] = React.useState(0)
  const [needsFileReselection, setNeedsFileReselection] = React.useState(false)

  const sessionRef = React.useRef<VideoUploadSession | null>(null)
  const activeAbortRef = React.useRef<AbortController | null>(null)
  const queuePromiseRef = React.useRef<Promise<void> | null>(null)
  const pauseRequestedRef = React.useRef(false)
  const recoveredKeyRef = React.useRef<string | null>(null)

  const applySession = React.useCallback((next: VideoUploadSession | null) => {
    sessionRef.current = next
    setSession(next)
  }, [])

  const clearPersisted = React.useCallback(() => {
    window.localStorage.removeItem(key)
    setPersistedMetadata(null)
  }, [key])

  const persistUpload = React.useCallback((upload: VideoUploadSession, selectedFile: File) => {
    const metadata: PersistedVideoUploadMetadata = {
      uploadId: upload.id,
      organizationId: upload.organizationId,
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileLastModified: selectedFile.lastModified,
      scope,
    }
    window.localStorage.setItem(key, JSON.stringify(metadata))
    setPersistedMetadata(metadata)
  }, [key, scope])

  const invalidateVideos = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: organizationVideosKeys.list(scope, organizationId) })
  }, [organizationId, queryClient, scope])

  const resetLocalState = React.useCallback(() => {
    activeAbortRef.current = null
    pauseRequestedRef.current = false
    queuePromiseRef.current = null
    applySession(null)
    setFile(null)
    setActiveChunkLoadedBytes(0)
    setNeedsFileReselection(false)
    setError(null)
    setPhase('idle')
  }, [applySession])

  const finishRecoveredCompletedSession = React.useCallback(async () => {
    clearPersisted()
    await invalidateVideos()
    resetLocalState()
    toast.success('اكتملت معالجة الفيديو وأصبح جاهزًا للعرض.')
  }, [clearPersisted, invalidateVideos, resetLocalState])

  const pollAssemblingSession = React.useCallback(async (uploadId: string) => {
    setPhase('assembling')
    for (let attempt = 0; attempt < ASSEMBLING_MAX_POLLS; attempt += 1) {
      await wait(ASSEMBLING_POLL_DELAY_MS)
      try {
        const latest = await organizationVideosServices.status(scope, organizationId, uploadId)
        applySession(latest)
        if (latest.status === 'completed') {
          await finishRecoveredCompletedSession()
          return
        }
        if (latest.status !== 'assembling') {
          setPhase(latest.status === 'paused' ? 'paused' : 'needs-file')
          setNeedsFileReselection(true)
          return
        }
      } catch (pollError) {
        setError(normalizeApiError(pollError).message)
        setPhase('error')
        return
      }
    }
    setError('استغرقت معالجة الفيديو وقتًا أطول من المتوقع. يمكنك إعادة المحاولة بعد قليل.')
    setPhase('error')
  }, [applySession, finishRecoveredCompletedSession, organizationId, scope])

  const finalize = React.useCallback(async (current: VideoUploadSession): Promise<boolean> => {
    setPhase('assembling')
    setError(null)
    try {
      const result = await organizationVideosServices.complete(scope, organizationId, current.id)
      applySession(result.upload)
      clearPersisted()
      await invalidateVideos()
      resetLocalState()
      toast.success(current.replaceVideoId ? 'تم استبدال الفيديو بنجاح.' : 'تم رفع الفيديو بنجاح.')
      return true
    } catch (finalizeError) {
      setError(normalizeApiError(finalizeError).message)
      setPhase('error')
      return false
    }
  }, [applySession, clearPersisted, invalidateVideos, organizationId, resetLocalState, scope])

  const runQueue = React.useCallback(async (initialSession: VideoUploadSession, selectedFile: File) => {
    let current = initialSession
    setPhase('uploading')
    setError(null)

    for (const chunkIndex of [...current.missingChunks]) {
      if (pauseRequestedRef.current) return
      const start = chunkIndex * current.chunkSize
      const end = Math.min(start + current.chunkSize, selectedFile.size)
      const blob = selectedFile.slice(start, end)
      const controller = new AbortController()
      activeAbortRef.current = controller
      setActiveChunkLoadedBytes(0)

      try {
        current = await organizationVideosServices.uploadChunk(
          scope,
          organizationId,
          current.id,
          chunkIndex,
          blob,
          { signal: controller.signal, onProgress: setActiveChunkLoadedBytes },
        )
        applySession(current)
        setActiveChunkLoadedBytes(0)
      } catch (chunkError) {
        activeAbortRef.current = null
        setActiveChunkLoadedBytes(0)
        if (axios.isCancel(chunkError) || pauseRequestedRef.current) return
        try {
          const reconciled = await organizationVideosServices.status(scope, organizationId, current.id)
          current = reconciled
          applySession(reconciled)
          if (reconciled.isExpired) {
            clearPersisted()
            setError('انتهت صلاحية جلسة رفع الفيديو. ابدأ الرفع من جديد.')
          } else {
            setError(normalizeApiError(chunkError).message)
          }
        } catch (statusError) {
          setError(normalizeApiError(statusError).message)
        }
        setPhase('error')
        return
      } finally {
        activeAbortRef.current = null
      }
    }

    if (pauseRequestedRef.current) return

    try {
      if (!current.canComplete) {
        current = await organizationVideosServices.status(scope, organizationId, current.id)
        applySession(current)
      }
      if (current.canComplete) {
        await finalize(current)
      } else if (current.status === 'paused') {
        setPhase('paused')
      } else if (current.status === 'assembling') {
        await pollAssemblingSession(current.id)
      } else if (current.missingChunks.length > 0) {
        setError('تعذر إكمال بعض أجزاء الفيديو. اضغط متابعة لإعادة مزامنة الرفع.')
        setPhase('error')
      }
    } catch (queueError) {
      setError(normalizeApiError(queueError).message)
      setPhase('error')
    }
  }, [applySession, clearPersisted, finalize, organizationId, pollAssemblingSession, scope])

  const launchQueue = React.useCallback((current: VideoUploadSession, selectedFile: File) => {
    if (queuePromiseRef.current) return
    pauseRequestedRef.current = false
    const promise = runQueue(current, selectedFile).finally(() => {
      if (queuePromiseRef.current === promise) queuePromiseRef.current = null
    })
    queuePromiseRef.current = promise
  }, [runQueue])

  const start = React.useCallback(async ({ file: selectedFile, description, replaceVideoId }: StartInput): Promise<boolean> => {
    if (sessionRef.current || phase === 'recovering' || phase === 'initiating') return false
    const mimeType = resolveOrganizationVideoMimeType(selectedFile)
    if (!mimeType) return false

    setPhase('initiating')
    setError(null)
    try {
      const initiated = await organizationVideosServices.initiate(scope, organizationId, {
        originalName: selectedFile.name,
        description: description || null,
        mimeType,
        totalSize: selectedFile.size,
        replaceVideoId: replaceVideoId || null,
      })
      applySession(initiated)
      setFile(selectedFile)
      setNeedsFileReselection(false)
      persistUpload(initiated, selectedFile)
      launchQueue(initiated, selectedFile)
      return true
    } catch (startError) {
      const message = normalizeApiError(startError).message
      setError(message)
      setPhase('idle')
      toast.error(message)
      return false
    }
  }, [applySession, launchQueue, organizationId, persistUpload, phase, scope])

  const pause = React.useCallback(async (): Promise<void> => {
    const current = sessionRef.current
    if (!current?.canPause) return
    setPhase('pausing')
    pauseRequestedRef.current = true
    activeAbortRef.current?.abort()
    try { await queuePromiseRef.current } catch { /* intentional active request abort */ }

    const latest = sessionRef.current
    if (!latest) return
    try {
      const paused = await organizationVideosServices.pause(scope, organizationId, latest.id)
      applySession(paused)
      setPhase('paused')
      setError(null)
    } catch (pauseError) {
      setError(normalizeApiError(pauseError).message)
      setPhase('error')
    }
  }, [applySession, organizationId, scope])

  const resume = React.useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current
    if (!current) return false
    if (!file) {
      setNeedsFileReselection(true)
      setPhase('needs-file')
      return false
    }

    setPhase('resuming')
    setError(null)
    try {
      const resumed = current.canResume
        ? await organizationVideosServices.resume(scope, organizationId, current.id)
        : await organizationVideosServices.status(scope, organizationId, current.id)
      applySession(resumed)
      if (resumed.isExpired) {
        clearPersisted()
        setError('انتهت صلاحية جلسة رفع الفيديو. ابدأ الرفع من جديد.')
        setPhase('error')
        return false
      }
      if (resumed.status === 'completed') {
        await finishRecoveredCompletedSession()
      } else if (resumed.status === 'assembling') {
        void pollAssemblingSession(resumed.id)
      } else if (resumed.canComplete) {
        void finalize(resumed)
      } else {
        launchQueue(resumed, file)
      }
      return true
    } catch (resumeError) {
      setError(normalizeApiError(resumeError).message)
      setPhase('error')
      return false
    }
  }, [applySession, clearPersisted, file, finalize, finishRecoveredCompletedSession, launchQueue, organizationId, pollAssemblingSession, scope])

  const reselectFile = React.useCallback((candidate: File): boolean => {
    const metadata = persistedMetadata
    const current = sessionRef.current
    if (!metadata || !current) return false
    const matches = candidate.name === metadata.fileName && candidate.size === metadata.fileSize
    if (!matches) {
      setError('اختر نفس ملف الفيديو الذي بدأ رفعه سابقًا (الاسم والحجم يجب أن يتطابقا).')
      return false
    }
    setFile(candidate)
    setNeedsFileReselection(false)
    setError(null)
    if (current.status === 'paused') setPhase('paused')
    else if (current.canComplete) void finalize(current)
    else launchQueue(current, candidate)
    return true
  }, [finalize, launchQueue, persistedMetadata])

  const cancel = React.useCallback(async (): Promise<boolean> => {
    const current = sessionRef.current
    if (!current || current.status === 'assembling' || current.status === 'completed') return false
    pauseRequestedRef.current = true
    activeAbortRef.current?.abort()
    try { await queuePromiseRef.current } catch { /* intentional active request abort */ }
    try {
      await organizationVideosServices.cancel(scope, organizationId, current.id)
      clearPersisted()
      resetLocalState()
      toast.success('تم إلغاء رفع الفيديو وحذف الأجزاء المؤقتة.')
      return true
    } catch (cancelError) {
      setError(normalizeApiError(cancelError).message)
      setPhase('error')
      return false
    }
  }, [clearPersisted, organizationId, resetLocalState, scope])

  React.useEffect(() => {
    if (typeof window === 'undefined' || recoveredKeyRef.current === key) return
    recoveredKeyRef.current = key
    const metadata = readPersistedUpload(key)
    if (!metadata) return
    if (metadata.scope !== scope || (organizationId && metadata.organizationId !== organizationId)) {
      window.localStorage.removeItem(key)
      return
    }

    const recoveryTimer = window.setTimeout(() => {
      setPersistedMetadata(metadata)
      setPhase('recovering')
      void (async () => {
        try {
        const recovered = await organizationVideosServices.status(scope, organizationId, metadata.uploadId)
        applySession(recovered)
        if (recovered.status === 'completed') await finishRecoveredCompletedSession()
        else if (recovered.status === 'cancelled' || recovered.isExpired) {
          clearPersisted()
          resetLocalState()
          toast.info('انتهت جلسة رفع الفيديو السابقة. يمكنك بدء رفع جديد.')
        } else if (recovered.status === 'assembling') void pollAssemblingSession(recovered.id)
        else if (recovered.canComplete) void finalize(recovered)
        else {
          setNeedsFileReselection(true)
          setPhase('needs-file')
        }
        } catch (recoveryError) {
          clearPersisted()
          resetLocalState()
          setError(normalizeApiError(recoveryError).message)
          setPhase('error')
        }
      })()
    }, 0)

    return () => window.clearTimeout(recoveryTimer)
  }, [applySession, clearPersisted, finalize, finishRecoveredCompletedSession, key, organizationId, pollAssemblingSession, resetLocalState, scope])

  React.useEffect(() => {
    const handleOnline = () => {
      if (phase === 'error' && sessionRef.current && file) void resume()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [file, phase, resume])

  React.useEffect(() => () => activeAbortRef.current?.abort(), [])

  const optimisticUploadedBytes = session ? Math.min(session.totalSize, session.uploadedBytes + activeChunkLoadedBytes) : 0
  const progressPercent = session?.totalSize ? Math.min(100, (optimisticUploadedBytes / session.totalSize) * 100) : 0

  return {
    session,
    file,
    phase,
    error,
    persistedMetadata,
    needsFileReselection,
    progressPercent,
    optimisticUploadedBytes,
    isActive: Boolean(session) || ['recovering', 'initiating', 'assembling'].includes(phase),
    start,
    pause,
    resume,
    reselectFile,
    cancel,
  }
}
