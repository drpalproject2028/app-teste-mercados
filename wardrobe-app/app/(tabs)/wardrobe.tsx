import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useWardrobe } from '@/hooks/useWardrobe';
import { ClothingCard } from '@/components/wardrobe/ClothingCard';
import { CategoryFilter } from '@/components/wardrobe/CategoryFilter';
import { Colors } from '@/constants/colors';
import type { ClothingCategory } from '@/types';

const { width } = Dimensions.get('window');
type Filter = ClothingCategory | 'todos';

export default function WardrobeScreen() {
  const { items, isLoading } = useWardrobe();
  const [selected, setSelected] = useState<Filter>('todos');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() =>
    selected === 'todos' ? items : items.filter(i => i.category === selected),
    [items, selected],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const item of items) {
      c[item.category] = (c[item.category] ?? 0) + 1;
    }
    return c;
  }, [items]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Guarda-Roupa</Text>
          <Text style={styles.headerSub}>{items.length} peças</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsBtn}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Category filter */}
      <CategoryFilter selected={selected} onChange={setSelected} counts={counts} />

      {/* Grid */}
      {isLoading ? null : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>👗</Text>
          <Text style={styles.emptyTitle}>
            {items.length === 0 ? 'Guarda-roupa vazio' : 'Sem peças aqui'}
          </Text>
          <Text style={styles.emptySub}>
            {items.length === 0
              ? 'Adiciona a tua primeira peça de roupa'
              : 'Tenta outra categoria'}
          </Text>
          {items.length === 0 && (
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/item/add')}
            >
              <Text style={styles.emptyBtnText}>Adicionar Peça</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ClothingCard
              item={item}
              onPress={() => router.push(`/item/${item.id}`)}
            />
          )}
        />
      )}

      {/* FABs */}
      <View style={[styles.fabs, { paddingBottom: insets.bottom + 16 }]}>
        {items.length >= 2 && (
          <TouchableOpacity
            style={styles.fabSecondary}
            onPress={() => router.push('/outfit/generate')}
          >
            <Ionicons name="sparkles-outline" size={18} color={Colors.accent} />
            <Text style={styles.fabSecondaryText}>Gerar Outfit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/item/add')}
        >
          <Ionicons name="add" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    paddingHorizontal: 10,
    paddingBottom: 120,
  },
  row: {
    justifyContent: 'flex-start',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 24,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  fabs: {
    position: 'absolute',
    right: 20,
    bottom: 0,
    alignItems: 'flex-end',
    gap: 12,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  fabSecondaryText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
});
