import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { OCCASIONS } from '@/constants/categories';
import type { OutfitSuggestion } from '@/types';

interface Props {
  outfit: OutfitSuggestion;
  onDelete: () => void;
  onRate: (rating: 1 | 2 | 3 | 4 | 5) => void;
  expanded?: boolean;
  onToggle?: () => void;
}

export function OutfitCard({ outfit, onDelete, onRate, expanded, onToggle }: Props) {
  const occ = OCCASIONS.find(o => o.key === outfit.occasion);
  const date = new Date(outfit.generatedAt).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'short',
  });

  // Preview: first 200 chars
  const preview = outfit.styleAdvice.slice(0, 180).trimEnd() + '...';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onToggle}
      activeOpacity={0.88}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.occBadge}>
            <Text style={styles.occEmoji}>{occ?.emoji ?? '✨'}</Text>
            <Text style={styles.occLabel}>{occ?.label ?? outfit.occasion}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Ionicons name="trash-outline" size={18} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={styles.text}>
        {expanded ? outfit.styleAdvice : preview}
      </Text>

      {/* Rating */}
      <View style={styles.footer}>
        <View style={styles.stars}>
          {([1, 2, 3, 4, 5] as const).map(star => (
            <TouchableOpacity key={star} onPress={() => onRate(star)}>
              <Ionicons
                name={star <= (outfit.userRating ?? 0) ? 'star' : 'star-outline'}
                size={18}
                color={star <= (outfit.userRating ?? 0) ? Colors.accent : Colors.textTertiary}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.expandBtn}>
          <Text style={styles.expandText}>{expanded ? 'Fechar' : 'Ler mais'}</Text>
          <Ionicons
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={Colors.accent}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  occBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  occEmoji: {
    fontSize: 12,
  },
  occLabel: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  date: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
