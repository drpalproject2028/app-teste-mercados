import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ClothingItem } from '@/types';

const KEY = 'WARDROBE_ITEMS_V1';

export async function getAllItems(): Promise<ClothingItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ClothingItem[];
  } catch {
    return [];
  }
}

export async function saveItem(item: ClothingItem): Promise<void> {
  const items = await getAllItems();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.unshift(item);
  }
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function deleteItem(id: string): Promise<void> {
  const items = await getAllItems();
  await AsyncStorage.setItem(KEY, JSON.stringify(items.filter(i => i.id !== id)));
}
