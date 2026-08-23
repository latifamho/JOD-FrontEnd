export type MediaModel = "organization" | "campaign" | "post";

export type MediaProp = "logo" | "images";

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
