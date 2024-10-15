declare module "expo-image-picker" {
  export interface Asset {
    assetId: string | null;
    base64: string | null;
    duration: number | null;
    exif: any | null;
    fileName: string | null;
    fileSize: number | null;
    height: number;
    mimeType: string;
    rotation: number | null;
    type: "image" | "video";
    uri: string;
    width: number;
  }
  export interface ImagePickerResult {
    cancelled: boolean;
    assets?: Asset[];
    uri?: string;
    width?: number;
    height?: number;
    type?: string;
  }
  export interface LaunchCameraOptions {
    mediaTypes?: MediaTypeOptions;
    allowsEditing?: boolean;
    aspect?: [number, number];
    quality?: number;
  }

  export enum MediaTypeOptions {
    All = "All",
    Images = "Images",
    Videos = "Videos",
  }

  export function requestCameraPermissionsAsync(): Promise<{ status: string }>;
  export function launchCameraAsync(
    options?: LaunchCameraOptions
  ): Promise<ImagePickerResult>;
}
