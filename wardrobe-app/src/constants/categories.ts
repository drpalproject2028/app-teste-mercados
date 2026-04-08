import type { ClothingCategory } from '@/types';

export const CATEGORIES: {
  key: ClothingCategory;
  label: string;
  icon: string;
  emoji: string;
}[] = [
  { key: 'tops',       label: 'Tops',       icon: 'shirt-outline',       emoji: '👕' },
  { key: 'calcas',     label: 'Calças',     icon: 'triangle-outline',    emoji: '👖' },
  { key: 'vestidos',   label: 'Vestidos',   icon: 'body-outline',        emoji: '👗' },
  { key: 'casacos',    label: 'Casacos',    icon: 'layers-outline',      emoji: '🧥' },
  { key: 'sapatos',    label: 'Sapatos',    icon: 'footsteps-outline',   emoji: '👟' },
  { key: 'acessorios', label: 'Acessórios', icon: 'watch-outline',       emoji: '⌚' },
  { key: 'desporto',   label: 'Desporto',   icon: 'barbell-outline',     emoji: '🏋️' },
];

export const OCCASIONS: { key: string; label: string; emoji: string }[] = [
  { key: 'casual',    label: 'Casual',     emoji: '☀️' },
  { key: 'trabalho',  label: 'Trabalho',   emoji: '💼' },
  { key: 'jantar',    label: 'Jantar',     emoji: '🍷' },
  { key: 'desporto',  label: 'Desporto',   emoji: '🏃' },
  { key: 'viagem',    label: 'Viagem',     emoji: '✈️' },
];
