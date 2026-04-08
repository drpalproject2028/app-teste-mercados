import AsyncStorage from '@react-native-async-storage/async-storage';
import type { OutfitSuggestion } from '@/types';

const KEY = 'OUTFIT_SUGGESTIONS_V1';

export async function getAllOutfits(): Promise<OutfitSuggestion[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as OutfitSuggestion[];
  } catch {
    return [];
  }
}

export async function saveOutfit(outfit: OutfitSuggestion): Promise<void> {
  const outfits = await getAllOutfits();
  outfits.unshift(outfit);
  await AsyncStorage.setItem(KEY, JSON.stringify(outfits));
}

export async function deleteOutfit(id: string): Promise<void> {
  const outfits = await getAllOutfits();
  await AsyncStorage.setItem(KEY, JSON.stringify(outfits.filter(o => o.id !== id)));
}

export async function rateOutfit(id: string, rating: 1 | 2 | 3 | 4 | 5): Promise<void> {
  const outfits = await getAllOutfits();
  const idx = outfits.findIndex(o => o.id === id);
  if (idx >= 0) {
    outfits[idx] = { ...outfits[idx], userRating: rating };
    await AsyncStorage.setItem(KEY, JSON.stringify(outfits));
  }
}
