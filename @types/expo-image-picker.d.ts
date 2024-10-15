declare module "expo-image-picker" {
  export interface Asset {
    assetId: string | null; // ID for the asset
    base64: string | null; // Base64 representation of the image (if applicable)
    duration: number | null; // Duration for video assets (if applicable)
    exif: any | null; // EXIF data for images (if applicable)
    fileName: string | null; // The file name of the image
    fileSize: number | null; // The size of the image file in bytes
    height: number; // Height of the image
    mimeType: string; // MIME type of the image
    rotation: number | null; // Rotation for the image
    type: "image" | "video"; // Type of the asset
    uri: string; // URI for the asset
    width: number; // Width of the image
  }

  export interface ImagePickerResult {
    cancelled: boolean; // Indicates if the operation was canceled
    assets?: Asset[]; // Array of assets returned from the picker
    uri?: string; // URI of the selected image (if not using assets)
    width?: number; // Width of the selected image (if not using assets)
    height?: number; // Height of the selected image (if not using assets)
    type?: string; // Type of the selected image (if not using assets)
  }

  export interface LaunchCameraOptions {
    mediaTypes?: MediaTypeOptions; // Media types to choose from
    allowsEditing?: boolean; // Allows image editing
    aspect?: [number, number]; // Aspect ratio for cropping
    quality?: number; // Quality of the image
  }

  export enum MediaTypeOptions {
    All = "All", // Include all media types
    Images = "Images", // Include only images
    Videos = "Videos", // Include only videos
  }

  export function requestCameraPermissionsAsync(): Promise<{ status: string }>; // Request camera permissions
  export function launchCameraAsync(
    options?: LaunchCameraOptions
  ): Promise<ImagePickerResult>; // Launch camera with options
}
