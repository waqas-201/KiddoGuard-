import { NativeModule, requireNativeModule } from 'expo';
import { ExpoFaceEmbedderModuleEvents } from './ExpoFaceEmbedder.types';

declare class ExpoFaceEmbedderModule extends NativeModule<ExpoFaceEmbedderModuleEvents> {
  logImageUriAsync(imageUri: string): Promise<string>; 
  loadModelAsync(): Promise<void>;
  getImageEmbeddingAsync (imageUri:string):Promise<number[]> 
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoFaceEmbedderModule>('ExpoFaceEmbedder');
