import { useState, useEffect, useCallback } from 'react';
import type { ClothingItem, ClothingCategory } from '@/types';
import * as wardrobeStorage from '@/storage/wardrobeStorage';
import { persistImages, deleteImages } from '@/storage/imageStorage';

interface AddItemData {
  category: ClothingCategory;
  label: string;
  notes: string;
  originalUri: string;
  thumbnailUri: string;
}

export function useWardrobe() {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    wardrobeStorage.getAllItems().then(loaded => {
      setItems(loaded);
      setIsLoading(false);
    });
  }, []);

  const addItem = useCallback(async (data: AddItemData): Promise<ClothingItem> => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();

    const { imageUri, thumbnailUri } = await persistImages(
      data.originalUri,
      data.thumbnailUri,
      id,
    );

    const item: ClothingItem = {
      id,
      category: data.category,
      label: data.label,
      notes: data.notes,
      imageUri,
      thumbnailUri,
      createdAt: now,
      updatedAt: now,
    };

    setItems(prev => [item, ...prev]);
    await wardrobeStorage.saveItem(item);
    return item;
  }, []);

  const removeItem = useCallback(async (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    await Promise.all([
      wardrobeStorage.deleteItem(id),
      deleteImages(id),
    ]);
  }, []);

  return { items, isLoading, addItem, removeItem };
}
