export interface Recording {
  id: string;
  name: string;
  url: string;
  uploaded: string;
  duration: number;
  size: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
}
