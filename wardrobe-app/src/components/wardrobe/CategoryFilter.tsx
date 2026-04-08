import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingCategory } from '@/types';

type Filter = ClothingCategory | 'todos';

interface Props {
  selected: Filter;
  onChange: (cat: Filter) => void;
  counts: Record<string, number>;
}

const ALL = { key: 'todos' as const, label: 'Tudo', emoji: '✨' };

export function CategoryFilter({ selected, onChange, counts }: Props) {
  const tabs = [ALL, ...CATEGORIES];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {tabs.map(tab => {
        const isActive = selected === tab.key;
        const count = tab.key === 'todos'
          ? Object.values(counts).reduce((a, b) => a + b, 0)
          : (counts[tab.key] ?? 0);

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onChange(tab.key as Filter)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{tab.emoji}</Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {count > 0 && (
              <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
                <Text style={[styles.count, isActive && styles.countActive]}>
                  {count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 5,
  },
  chipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  emoji: {
    fontSize: 13,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: Colors.bgElevated,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  countBadgeActive: {
    backgroundColor: Colors.accent,
  },
  count: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  countActive: {
    color: '#000',
  },
});
