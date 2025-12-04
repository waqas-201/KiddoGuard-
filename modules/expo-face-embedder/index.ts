// Reexport the native module. On web, it will be resolved to ExpoFaceEmbedderModule.web.ts
// and on native platforms to ExpoFaceEmbedderModule.ts
export * from './src/ExpoFaceEmbedder.types';
import ExpoFaceEmbedderModule from './src/ExpoFaceEmbedderModule';


export function logImageUriAsync(imageUri: string): Promise<string> {
  return ExpoFaceEmbedderModule.logImageUriAsync(imageUri);
}

export function loadModelAsync(): Promise<void> {
  return ExpoFaceEmbedderModule.loadModelAsync();
}   
export function getImageEmbeddingAsync(imageUri: string): Promise<number[]> {
    return ExpoFaceEmbedderModule.getImageEmbeddingAsync(imageUri)
}
