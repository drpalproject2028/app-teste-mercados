import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useWardrobe } from '@/hooks/useWardrobe';
import { Colors } from '@/constants/colors';
import { CATEGORIES } from '@/constants/categories';
import type { ClothingCategory } from '@/types';

type Step = 'photo' | 'details';

export default function AddItemScreen() {
  const router = useRouter();
  const { pickFromGallery, takePhoto } = useImagePicker();
  const { addItem } = useWardrobe();

  const [step, setStep] = useState<Step>('photo');
  const [originalUri, setOriginalUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [category, setCategory] = useState<ClothingCategory>('tops');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  async function handlePickGallery() {
    const img = await pickFromGallery();
    if (!img) return;
    setOriginalUri(img.originalUri);
    setThumbnailUri(img.thumbnailUri);
    setStep('details');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleTakePhoto() {
    const img = await takePhoto();
    if (!img) return;
    setOriginalUri(img.originalUri);
    setThumbnailUri(img.thumbnailUri);
    setStep('details');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  async function handleSave() {
    if (!originalUri || !thumbnailUri) return;
    if (!label.trim()) {
      Alert.alert('Falta o nome', 'Dá um nome à peça antes de guardar.');
      return;
    }
    setSaving(true);
    try {
      await addItem({
        category,
        label: label.trim(),
        notes: notes.trim(),
        originalUri,
        thumbnailUri,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível guardar a peça.');
    } finally {
      setSaving(false);
    }
  }

  if (step === 'photo') {
    return (
      <View style={styles.container}>
        <View style={styles.photoStep}>
          <Text style={styles.photoTitle}>Adicionar Peça</Text>
          <Text style={styles.photoSub}>Escolhe como queres adicionar a foto</Text>

          <TouchableOpacity style={styles.photoOption} onPress={handleTakePhoto}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(212,175,55,0.15)' }]}>
              <Ionicons name="camera-outline" size={32} color={Colors.accent} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Tirar Foto</Text>
              <Text style={styles.optionSub}>Usa a câmara do teu iPhone</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoOption} onPress={handlePickGallery}>
            <View style={[styles.optionIcon, { backgroundColor: 'rgba(48,209,88,0.12)' }]}>
              <Ionicons name="images-outline" size={32} color={Colors.success} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Da Galeria</Text>
              <Text style={styles.optionSub}>Escolhe uma foto existente</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Preview */}
        {thumbnailUri && (
          <View style={styles.preview}>
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.changePhotoBtn}
              onPress={() => setStep('photo')}
            >
              <Ionicons name="camera-outline" size={14} color={Colors.accent} />
              <Text style={styles.changePhotoText}>Mudar foto</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Category */}
        <Text style={styles.sectionLabel}>Categoria</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.catChip, category === cat.key && styles.catChipActive]}
              onPress={() => setCategory(cat.key)}
            >
              <Text style={styles.catEmoji}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, category === cat.key && styles.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Name */}
        <Text style={styles.sectionLabel}>Nome da Peça *</Text>
        <TextInput
          style={styles.input}
          placeholder="ex: Camisa Azul Linen, Calças Cargo..."
          placeholderTextColor={Colors.textTertiary}
          value={label}
          onChangeText={setLabel}
          maxLength={60}
          returnKeyType="next"
        />

        {/* Notes */}
        <Text style={styles.sectionLabel}>Notas (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMulti]}
          placeholder="Marca, ocasião, tamanho..."
          placeholderTextColor={Colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          maxLength={200}
        />

        {/* Save */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.saveBtnText}>Guardar Peça</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // Photo step
  photoStep: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  photoTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  photoSub: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  optionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 3,
  },
  optionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  // Details step
  scroll: {
    padding: 20,
    paddingBottom: 60,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 28,
  },
  previewImage: {
    width: 180,
    height: 180,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  changePhotoText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.textSecondary,
    marginBottom: 10,
    marginTop: 4,
  },
  catScroll: {
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    gap: 6,
  },
  catChipActive: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  catEmoji: {
    fontSize: 16,
  },
  catLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  catLabelActive: {
    color: Colors.accent,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  inputMulti: {
    height: 88,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});
