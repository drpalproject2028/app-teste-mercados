import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobe } from '@/hooks/useWardrobe';
import { Colors } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingItem } from '@/types';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, removeItem } = useWardrobe();
  const router = useRouter();
  const [item, setItem] = useState<ClothingItem | null>(null);

  useEffect(() => {
    const found = items.find(i => i.id === id);
    setItem(found ?? null);
  }, [items, id]);

  if (!item) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: Colors.textSecondary }}>Peça não encontrada</Text>
      </View>
    );
  }

  const cat = CATEGORIES.find(c => c.key === item.category);

  function confirmDelete() {
    Alert.alert(
      'Apagar Peça',
      `Tens a certeza que queres apagar "${item!.label}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await removeItem(item!.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.back();
          },
        },
      ],
    );
  }

  const added = new Date(item.createdAt).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image */}
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.badge}>
          <Text style={styles.badgeEmoji}>{cat?.emoji}</Text>
          <Text style={styles.badgeLabel}>{cat?.label}</Text>
        </View>

        <Text style={styles.title}>{item.label}</Text>

        {item.notes ? (
          <View style={styles.notesBox}>
            <Ionicons name="document-text-outline" size={14} color={Colors.textSecondary} />
            <Text style={styles.notes}>{item.notes}</Text>
          </View>
        ) : null}

        <Text style={styles.date}>Adicionado em {added}</Text>
      </View>

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        <Text style={styles.deleteBtnText}>Apagar Peça</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 380,
    backgroundColor: Colors.bgCard,
  },
  info: {
    padding: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentSoft,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 16,
  },
  badgeEmoji: {
    fontSize: 14,
  },
  badgeLabel: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.bgCard,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notes: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.danger,
    backgroundColor: 'rgba(255,69,58,0.08)',
  },
  deleteBtnText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: '600',
  },
});
