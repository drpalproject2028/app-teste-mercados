import { useState, useEffect, useCallback } from 'react';
import type { OutfitSuggestion } from '@/types';
import * as outfitStorage from '@/storage/outfitStorage';

export function useOutfits() {
  const [outfits, setOutfits] = useState<OutfitSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    outfitStorage.getAllOutfits().then(loaded => {
      setOutfits(loaded);
      setIsLoading(false);
    });
  }, []);

  const addOutfit = useCallback(async (outfit: OutfitSuggestion) => {
    setOutfits(prev => [outfit, ...prev]);
    await outfitStorage.saveOutfit(outfit);
  }, []);

  const removeOutfit = useCallback(async (id: string) => {
    setOutfits(prev => prev.filter(o => o.id !== id));
    await outfitStorage.deleteOutfit(id);
  }, []);

  const rateOutfit = useCallback(async (id: string, rating: 1 | 2 | 3 | 4 | 5) => {
    setOutfits(prev => prev.map(o => o.id === id ? { ...o, userRating: rating } : o));
    await outfitStorage.rateOutfit(id, rating);
  }, []);

  return { outfits, isLoading, addOutfit, removeOutfit, rateOutfit };
}
