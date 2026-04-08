import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useWardrobe } from '@/hooks/useWardrobe';
import { useOutfits } from '@/hooks/useOutfits';
import { generateOutfit } from '@/services/claudeService';
import { getApiKey } from '@/services/apiKeyService';
import { Colors } from '@/constants/colors';
import { OCCASIONS } from '@/constants/categories';
import type { OutfitSuggestion, Occasion } from '@/types';

type Phase = 'select' | 'generating' | 'result';

export default function GenerateScreen() {
  const router = useRouter();
  const { items } = useWardrobe();
  const { addOutfit } = useOutfits();

  const [occasion, setOccasion] = useState<string>('casual');
  const [phase, setPhase] = useState<Phase>('select');
  const [streamedText, setStreamedText] = useState('');
  const [result, setResult] = useState<OutfitSuggestion | null>(null);
  const [saved, setSaved] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const dotAnim = useRef(new Animated.Value(0)).current;

  const startDotAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
    ).start();
  }, [dotAnim]);

  async function handleGenerate() {
    const apiKey = await getApiKey();
    if (!apiKey) {
      Alert.alert(
        'API Key em falta',
        'Vai às Definições e adiciona a tua chave da API Anthropic.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Definições', onPress: () => router.push('/settings') },
        ],
      );
      return;
    }

    setPhase('generating');
    setStreamedText('');
    setSaved(false);
    startDotAnimation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    abortRef.current = new AbortController();

    try {
      const suggestion = await generateOutfit({
        items,
        occasion,
        onProgress: (text) => {
          setStreamedText(text);
          // Auto-scroll
          setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
        },
        signal: abortRef.current.signal,
      });
      setResult(suggestion);
      setPhase('result');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg !== 'CANCELLED') {
        setPhase('select');
        Alert.alert(
          'Erro',
          msg === 'API_KEY_MISSING'
            ? 'Adiciona a tua chave API nas Definições.'
            : 'Não foi possível gerar o outfit. Verifica a ligação e tenta novamente.',
        );
      } else {
        setPhase('select');
      }
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleSave() {
    if (!result) return;
    await addOutfit(result);
    setSaved(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  // SELECT phase
  if (phase === 'select') {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.selectContent}>
          {/* Header */}
          <LinearGradient
            colors={['rgba(212,175,55,0.15)', 'transparent']}
            style={styles.headerGrad}
          >
            <Text style={styles.aiIcon}>✨</Text>
            <Text style={styles.selectTitle}>Gerar Outfit com IA</Text>
            <Text style={styles.selectSub}>
              A IA vai analisar o teu guarda-roupa ({items.length} peças) e criar combinações
              baseadas nas tendências de 2026
            </Text>
          </LinearGradient>

          {/* Occasion */}
          <Text style={styles.sectionLabel}>Ocasião</Text>
          <View style={styles.occasionGrid}>
            {OCCASIONS.map(occ => (
              <TouchableOpacity
                key={occ.key}
                style={[
                  styles.occasionChip,
                  occasion === occ.key && styles.occasionChipActive,
                ]}
                onPress={() => setOccasion(occ.key)}
              >
                <Text style={styles.occasionEmoji}>{occ.emoji}</Text>
                <Text style={[
                  styles.occasionLabel,
                  occasion === occ.key && styles.occasionLabelActive,
                ]}>
                  {occ.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Cost note */}
          <View style={styles.costNote}>
            <Ionicons name="information-circle-outline" size={14} color={Colors.textTertiary} />
            <Text style={styles.costText}>
              Cada geração usa Claude Haiku — aprox. ~€0.01 por outfit
            </Text>
          </View>

          {/* Generate button */}
          {items.length < 2 ? (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={18} color={Colors.warning} />
              <Text style={styles.warningText}>
                Adiciona pelo menos 2 peças ao guarda-roupa para gerar um outfit.
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
              <Ionicons name="sparkles" size={20} color="#000" />
              <Text style={styles.generateBtnText}>Gerar Outfit</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  }

  // GENERATING phase
  if (phase === 'generating') {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          style={styles.streamContainer}
          contentContainerStyle={styles.streamContent}
        >
          {/* Status indicator */}
          <View style={styles.generatingHeader}>
            <Animated.View style={[styles.dot, { opacity: dotAnim }]} />
            <Text style={styles.generatingLabel}>A analisar o teu guarda-roupa...</Text>
          </View>

          {/* Streamed text */}
          {streamedText ? (
            <View style={styles.streamBox}>
              <Text style={styles.streamText}>{streamedText}</Text>
            </View>
          ) : (
            <View style={styles.loadingCenter}>
              <ActivityIndicator color={Colors.accent} size="large" />
              <Text style={styles.loadingText}>
                A IA está a escolher as melhores combinações para ti...
              </Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <Text style={styles.cancelBtnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // RESULT phase
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.streamContainer}
        contentContainerStyle={styles.resultContent}
      >
        {/* Result header */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultIcon}>🎨</Text>
          <View>
            <Text style={styles.resultTitle}>Outfit Gerado</Text>
            <Text style={styles.resultOccasion}>
              {OCCASIONS.find(o => o.key === occasion)?.emoji}{' '}
              {OCCASIONS.find(o => o.key === occasion)?.label}
            </Text>
          </View>
        </View>

        {/* Style advice */}
        <View style={styles.adviceBox}>
          <Text style={styles.adviceText}>{result?.styleAdvice}</Text>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={styles.resultBar}>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => { setPhase('select'); setResult(null); }}
        >
          <Ionicons name="refresh-outline" size={18} color={Colors.textSecondary} />
          <Text style={styles.retryBtnText}>Tentar Outra Vez</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnDone]}
          onPress={handleSave}
          disabled={saved}
        >
          {saved ? (
            <>
              <Ionicons name="checkmark" size={18} color={Colors.success} />
              <Text style={[styles.saveBtnText, { color: Colors.success }]}>Guardado!</Text>
            </>
          ) : (
            <>
              <Ionicons name="bookmark-outline" size={18} color="#000" />
              <Text style={styles.saveBtnText}>Guardar</Text>
            </>
          )}
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
  // Select
  selectContent: {
    padding: 24,
    paddingBottom: 60,
  },
  headerGrad: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 32,
  },
  aiIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  selectTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  selectSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  occasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  occasionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  occasionChipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  occasionEmoji: {
    fontSize: 16,
  },
  occasionLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  occasionLabelActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  costNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  costText: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  generateBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  generateBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,214,10,0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,214,10,0.3)',
  },
  warningText: {
    flex: 1,
    color: Colors.warning,
    fontSize: 13,
    lineHeight: 18,
  },
  // Generating
  streamContainer: {
    flex: 1,
  },
  streamContent: {
    padding: 20,
    paddingBottom: 80,
  },
  generatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  generatingLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  streamBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streamText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 24,
  },
  loadingCenter: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 20,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  cancelBtn: {
    margin: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Result
  resultContent: {
    padding: 20,
    paddingBottom: 100,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  resultIcon: {
    fontSize: 40,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  resultOccasion: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  adviceBox: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adviceText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 25,
  },
  resultBar: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: Colors.bgElevated,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  retryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retryBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.accent,
  },
  saveBtnDone: {
    backgroundColor: 'rgba(48,209,88,0.12)',
    borderWidth: 1,
    borderColor: Colors.success,
  },
  saveBtnText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '700',
  },
});
