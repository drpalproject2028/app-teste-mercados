import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingItem } from '@/types';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

interface Props {
  item: ClothingItem;
  onPress: () => void;
}

export function ClothingCard({ item, onPress }: Props) {
  const cat = CATEGORIES.find(c => c.key === item.category);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: item.thumbnailUri }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={styles.badge}>
          <Text style={styles.emoji}>{cat?.emoji ?? '👔'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.label} numberOfLines={1}>{item.label}</Text>
          <Text style={styles.category}>{cat?.label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    margin: 6,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 24,
    background: 'transparent',
    flexDirection: 'row',
    alignItems: 'flex-end',
    // Gradient via backgroundColor with opacity
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(212,175,55,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  emoji: {
    fontSize: 14,
  },
  info: {
    flex: 1,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  category: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
