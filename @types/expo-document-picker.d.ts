declare module "expo-document-picker" {
  // Define the structure for an individual asset
  export interface DocumentPickerAsset {
    uri: string; // The URI of the picked document
    name: string; // The name of the document
    mimeType: string; // The MIME type of the document
    size: number; // The size of the document in bytes
  }

  // Define the structure for a successful document picker result
  export interface DocumentPickerSuccessResult {
    type: "success"; // Indicates the type of result
    assets: DocumentPickerAsset[]; // Array of assets
  }

  // Define the possible result types from the document picker
  export type DocumentPickerResult =
    | DocumentPickerSuccessResult
    | { type: "cancel" }; // Indicates cancellation

  // Define the function to get a document
  export function getDocumentAsync(options: {
    type?: string; // Optional MIME type filter
    multiple?: boolean; // Optional flag for multiple selections
  }): Promise<DocumentPickerResult>; // The promise resolves to the result type
}
