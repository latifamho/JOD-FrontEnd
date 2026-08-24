import type { AxiosProgressEvent } from 'axios'

import { api } from '@/services/api'
import type {
  OrganizationVideo,
  OrganizationVideosScope,
  VideoUploadCompleteResult,
  VideoUploadInitiateInput,
  VideoUploadSession,
} from './organization-videos.types'

type DataResponse<T> = { data: T }

type ChunkUploadOptions = {
  signal?: AbortSignal
  onProgress?: (loadedBytes: number) => void
}

function videosBasePath(scope: OrganizationVideosScope, organizationId?: string): string {
  if (scope === 'org') return '/org/videos'
  if (!organizationId) throw new Error('Organization id is required for admin video requests.')
  return `/admin/organizations/${organizationId}/videos`
}

function uploadBasePath(scope: OrganizationVideosScope, organizationId?: string): string {
  return `${videosBasePath(scope, organizationId)}/uploads`
}

export const organizationVideosServices = {
  async list(scope: OrganizationVideosScope, organizationId?: string): Promise<OrganizationVideo[]> {
    const response = await api.get<DataResponse<OrganizationVideo[]>>(videosBasePath(scope, organizationId))
    return response.data.data
  },

  async remove(scope: OrganizationVideosScope, organizationId: string | undefined, videoId: string): Promise<void> {
    await api.delete(`${videosBasePath(scope, organizationId)}/${videoId}`, {
      skipSuccessToast: true,
      skipErrorToast: true,
    })
  },

  async initiate(
    scope: OrganizationVideosScope,
    organizationId: string | undefined,
    input: VideoUploadInitiateInput,
  ): Promise<VideoUploadSession> {
    const response = await api.post<DataResponse<VideoUploadSession>>(
      uploadBasePath(scope, organizationId),
      input,
      { skipSuccessToast: true, skipErrorToast: true },
    )
    return response.data.data
  },

  async status(
    scope: OrganizationVideosScope,
    organizationId: string | undefined,
    uploadId: string,
  ): Promise<VideoUploadSession> {
    const response = await api.get<DataResponse<VideoUploadSession>>(
      `${uploadBasePath(scope, organizationId)}/${uploadId}`,
      { skipErrorToast: true },
    )
    return response.data.data
  },

  async uploadChunk(
    scope: OrganizationVideosScope,
    organizationId: string | undefined,
    uploadId: string,
    chunkIndex: number,
    blob: Blob,
    options: ChunkUploadOptions = {},
  ): Promise<VideoUploadSession> {
    const response = await api.put<DataResponse<VideoUploadSession>>(
      `${uploadBasePath(scope, organizationId)}/${uploadId}/chunks/${chunkIndex}`,
      blob,
      {
        headers: { 'Content-Type': 'application/octet-stream' },
        signal: options.signal,
        onUploadProgress: (event: AxiosProgressEvent) => options.onProgress?.(event.loaded),
        skipSuccessToast: true,
        skipErrorToast: true,
      },
    )
    return response.data.data
  },

  async pause(scope: OrganizationVideosScope, organizationId: string | undefined, uploadId: string): Promise<VideoUploadSession> {
    const response = await api.post<DataResponse<VideoUploadSession>>(
      `${uploadBasePath(scope, organizationId)}/${uploadId}/pause`,
      undefined,
      { skipSuccessToast: true, skipErrorToast: true },
    )
    return response.data.data
  },

  async resume(scope: OrganizationVideosScope, organizationId: string | undefined, uploadId: string): Promise<VideoUploadSession> {
    const response = await api.post<DataResponse<VideoUploadSession>>(
      `${uploadBasePath(scope, organizationId)}/${uploadId}/resume`,
      undefined,
      { skipSuccessToast: true, skipErrorToast: true },
    )
    return response.data.data
  },

  async complete(scope: OrganizationVideosScope, organizationId: string | undefined, uploadId: string): Promise<VideoUploadCompleteResult> {
    const response = await api.post<DataResponse<VideoUploadCompleteResult>>(
      `${uploadBasePath(scope, organizationId)}/${uploadId}/complete`,
      undefined,
      { skipSuccessToast: true, skipErrorToast: true },
    )
    return response.data.data
  },

  async cancel(scope: OrganizationVideosScope, organizationId: string | undefined, uploadId: string): Promise<void> {
    await api.delete(`${uploadBasePath(scope, organizationId)}/${uploadId}`, {
      skipSuccessToast: true,
      skipErrorToast: true,
    })
  },
}
