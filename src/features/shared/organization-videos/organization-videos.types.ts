export type OrganizationVideosScope = 'org' | 'admin'

export type OrganizationVideo = {
  id: string
  model: 'organization'
  modelId: string
  prop: 'videos'
  url: string
  originalName: string
  description: string | null
  mimeType: string | null
  size: number
  position: number
  createdAt: string | null
  updatedAt: string | null
}

export type VideoUploadStatus =
  | 'initiated'
  | 'uploading'
  | 'paused'
  | 'assembling'
  | 'completed'
  | 'cancelled'

export type VideoUploadSession = {
  id: string
  organizationId: string
  replaceVideoId: string | null
  videoId: string | null
  originalName: string
  description: string | null
  mimeType: string
  totalSize: number
  chunkSize: number
  totalChunks: number
  receivedChunks: number[]
  missingChunks: number[]
  nextChunk: number | null
  uploadedBytes: number
  progressPercent: number
  status: VideoUploadStatus
  isExpired?: boolean
  canPause: boolean
  canResume: boolean
  canComplete: boolean
  expiresAt: string | null
  completedAt: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type VideoUploadInitiateInput = {
  originalName: string
  description?: string | null
  mimeType: string
  totalSize: number
  replaceVideoId?: string | null
}

export type VideoUploadCompleteResult = {
  upload: VideoUploadSession
  video: OrganizationVideo
}

export type PersistedVideoUploadMetadata = {
  uploadId: string
  organizationId: string
  fileName: string
  fileSize: number
  fileLastModified: number
  scope: OrganizationVideosScope
}

export const ORGANIZATION_VIDEO_MAX_COUNT = 10
export const ORGANIZATION_VIDEO_MAX_SIZE = 100 * 1024 * 1024
export const ORGANIZATION_VIDEO_DESCRIPTION_MAX_LENGTH = 5000
export const ORGANIZATION_VIDEO_ALLOWED_MIME_TYPES = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
] as const

const MIME_BY_EXTENSION: Record<string, (typeof ORGANIZATION_VIDEO_ALLOWED_MIME_TYPES)[number]> = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
}

export function resolveOrganizationVideoMimeType(file: File): string | null {
  if (
    ORGANIZATION_VIDEO_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ORGANIZATION_VIDEO_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return file.type
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  return MIME_BY_EXTENSION[extension] ?? null
}

export function validateOrganizationVideoFile(file: File): string | null {
  if (!resolveOrganizationVideoMimeType(file)) {
    return 'صيغة الفيديو غير مدعومة. الصيغ المسموحة: MP4 وMOV وWebM.'
  }

  if (file.size <= 0) return 'ملف الفيديو فارغ.'
  if (file.size > ORGANIZATION_VIDEO_MAX_SIZE) {
    return 'حجم الفيديو يجب ألا يتجاوز 100 ميغابايت.'
  }

  return null
}
