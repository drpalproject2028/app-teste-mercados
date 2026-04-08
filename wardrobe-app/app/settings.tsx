import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { getApiKey, setApiKey, clearApiKey } from '@/services/apiKeyService';
import { Colors } from '@/constants/colors';

export default function SettingsScreen() {
  const router = useRouter();
  const [key, setKey] = useState('');
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    getApiKey().then(k => {
      if (k) {
        setHasKey(true);
        setKey(k);
      }
    });
  }, []);

  async function handleSave() {
    if (!key.trim().startsWith('sk-ant-')) {
      Alert.alert('Chave inválida', 'A chave da API Anthropic começa por "sk-ant-..."');
      return;
    }
    setSaving(true);
    await setApiKey(key.trim());
    setHasKey(true);
    setSaving(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Guardado!', 'A chave API foi guardada em segurança no teu iPhone.');
  }

  async function handleClear() {
    Alert.alert(
      'Remover Chave',
      'Vais precisar de a inserir novamente para gerar outfits.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await clearApiKey();
            setKey('');
            setHasKey(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* API Key section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chave API Anthropic</Text>
        <Text style={styles.sectionSub}>
          Necessária para gerar outfits com IA. Obtém a tua chave em{' '}
          <Text style={{ color: Colors.accent }}>console.anthropic.com</Text>
        </Text>

        {hasKey && (
          <View style={styles.keyStatus}>
            <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
            <Text style={styles.keyStatusText}>Chave API configurada</Text>
          </View>
        )}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="sk-ant-api03-..."
            placeholderTextColor={Colors.textTertiary}
            value={showKey ? key : key.replace(/./g, '•')}
            onChangeText={setKey}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={false}
            editable={!showKey ? false : true}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowKey(prev => !prev)}
          >
            <Ionicons
              name={showKey ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {showKey && (
          <>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.saveBtnText}>Guardar Chave</Text>
              )}
            </TouchableOpacity>

            {hasKey && (
              <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                <Text style={styles.clearBtnText}>Remover Chave</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Cost info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custos Estimados</Text>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Modelo</Text>
          <Text style={styles.costValue}>Claude Haiku 4.5</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Por geração</Text>
          <Text style={styles.costValue}>~€0.01</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>100 outfits</Text>
          <Text style={styles.costValue}>~€1.00</Text>
        </View>
        <Text style={styles.costNote}>
          Os custos são cobrados directamente pela Anthropic na tua conta.
        </Text>
      </View>

      {/* App info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre a App</Text>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Versão</Text>
          <Text style={styles.costValue}>1.0.0</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>Dados</Text>
          <Text style={styles.costValue}>Guardados localmente</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
    gap: 20,
  },
  section: {
    backgroundColor: Colors.bgCard,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  keyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(48,209,88,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(48,209,88,0.3)',
  },
  keyStatusText: {
    color: Colors.success,
    fontSize: 13,
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgInput,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: 14,
    fontSize: 14,
    color: Colors.text,
    fontFamily: 'Courier',
  },
  eyeBtn: {
    padding: 14,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
  },
  clearBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  costLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  costValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  costNote: {
    color: Colors.textTertiary,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 16,
  },
});
