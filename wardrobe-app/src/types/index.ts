export type ClothingCategory =
  | 'tops'
  | 'calcas'
  | 'vestidos'
  | 'casacos'
  | 'sapatos'
  | 'acessorios'
  | 'desporto';

export interface ClothingItem {
  id: string;
  category: ClothingCategory;
  label: string;
  imageUri: string;
  thumbnailUri: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface OutfitItem {
  itemId: string;
  role: string;
}

export interface OutfitSuggestion {
  id: string;
  items: OutfitItem[];
  occasion: string;
  styleAdvice: string;
  generatedAt: string;
  userRating?: 1 | 2 | 3 | 4 | 5;
}

export type Occasion = 'casual' | 'trabalho' | 'jantar' | 'desporto' | 'viagem';
