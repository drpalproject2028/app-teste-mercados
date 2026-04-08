import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useOutfits } from '@/hooks/useOutfits';
import { OutfitCard } from '@/components/outfit/OutfitCard';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function OutfitsScreen() {
  const { outfits, removeOutfit, rateOutfit, isLoading } = useOutfits();
  const [expanded, setExpanded] = useState<string | null>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function toggleExpand(id: string) {
    setExpanded(prev => prev === id ? null : id);
  }

  function handleDelete(id: string) {
    Alert.alert(
      'Apagar Outfit',
      'Tens a certeza que queres apagar este outfit?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            await removeOutfit(id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          },
        },
      ],
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Os Meus Outfits</Text>
          <Text style={styles.headerSub}>{outfits.length} sugestões guardadas</Text>
        </View>
      </View>

      {isLoading ? null : outfits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>✨</Text>
          <Text style={styles.emptyTitle}>Nenhum outfit ainda</Text>
          <Text style={styles.emptySub}>
            Gera o teu primeiro outfit com IA a partir do teu guarda-roupa
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => router.push('/outfit/generate')}
          >
            <Ionicons name="sparkles-outline" size={16} color="#000" />
            <Text style={styles.emptyBtnText}>Gerar Outfit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={outfits}
          keyExtractor={o => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OutfitCard
              outfit={item}
              expanded={expanded === item.id}
              onToggle={() => toggleExpand(item.id)}
              onDelete={() => handleDelete(item.id)}
              onRate={(rating) => rateOutfit(item.id, rating)}
            />
          )}
        />
      )}

      {outfits.length > 0 && (
        <View style={[styles.fab, { bottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.fabBtn}
            onPress={() => router.push('/outfit/generate')}
          >
            <Ionicons name="sparkles-outline" size={16} color={Colors.accent} />
            <Text style={styles.fabBtnText}>Novo Outfit</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingBottom: 12,
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
  list: {
    padding: 16,
    paddingBottom: 100,
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
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  fab: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
  fabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabBtnText: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 14,
  },
});
