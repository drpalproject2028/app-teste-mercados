import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

export interface PickedImage {
  originalUri: string;
  thumbnailUri: string;
}

export function useImagePicker() {
  async function processImage(uri: string): Promise<PickedImage> {
    const [original, thumbnail] = await Promise.all([
      ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
      ),
      ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      ),
    ]);
    return { originalUri: original.uri, thumbnailUri: thumbnail.uri };
  }

  async function pickFromGallery(): Promise<PickedImage | null> {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Permissão necessária', 'Permite o acesso à galeria nas Definições.');
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled) return null;
    return processImage(result.assets[0].uri);
  }

  async function takePhoto(): Promise<PickedImage | null> {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Permissão necessária', 'Permite o acesso à câmara nas Definições.');
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (result.canceled) return null;
    return processImage(result.assets[0].uri);
  }

  return { pickFromGallery, takePhoto };
}
