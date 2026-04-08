import * as FileSystem from 'expo-file-system';

const WARDROBE_DIR = `${FileSystem.documentDirectory}wardrobe/`;
const THUMBS_DIR   = `${FileSystem.documentDirectory}wardrobe/thumbs/`;

async function ensureDirs() {
  await FileSystem.makeDirectoryAsync(WARDROBE_DIR, { intermediates: true });
  await FileSystem.makeDirectoryAsync(THUMBS_DIR,   { intermediates: true });
}

export async function persistImages(
  originalUri: string,
  thumbnailUri: string,
  itemId: string,
): Promise<{ imageUri: string; thumbnailUri: string }> {
  await ensureDirs();
  const imageUri = `${WARDROBE_DIR}${itemId}.jpg`;
  const thumbUri = `${THUMBS_DIR}${itemId}_thumb.jpg`;
  await FileSystem.copyAsync({ from: originalUri, to: imageUri });
  await FileSystem.copyAsync({ from: thumbnailUri, to: thumbUri });
  return { imageUri, thumbnailUri: thumbUri };
}

export async function deleteImages(itemId: string): Promise<void> {
  await Promise.allSettled([
    FileSystem.deleteAsync(`${WARDROBE_DIR}${itemId}.jpg`,        { idempotent: true }),
    FileSystem.deleteAsync(`${THUMBS_DIR}${itemId}_thumb.jpg`,    { idempotent: true }),
  ]);
}

export async function readAsBase64(uri: string): Promise<string> {
  return FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}
