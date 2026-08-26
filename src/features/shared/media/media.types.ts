export type MediaModel = "organization" | "campaign" | "post" | "article";

export type MediaProp = "logo" | "images" | "videos";

export interface MediaItem {
  id: string;
  model: MediaModel;
  modelId: string;
  prop: MediaProp;
  url: string;
  originalName: string;
  mimeType: string | null;
  size: number;
  position: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MediaUploadResponse {
  data: MediaItem;
}

export interface MediaTarget {
  model: MediaModel;
  modelId: string;
  prop: MediaProp;
}
