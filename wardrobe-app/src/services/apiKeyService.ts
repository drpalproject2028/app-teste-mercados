import * as SecureStore from 'expo-secure-store';

const SECURE_KEY = 'CLAUDE_API_KEY';

export async function getApiKey(): Promise<string | null> {
  // Prefer SecureStore (user-set or previously bootstrapped)
  try {
    const stored = await SecureStore.getItemAsync(SECURE_KEY);
    if (stored) return stored;
  } catch {}

  // Fall back to build-time env var
  const envKey = process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? null;
  if (envKey && envKey !== 'your-anthropic-api-key-here') {
    await setApiKey(envKey);
    return envKey;
  }
  return null;
}

export async function setApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEY, key);
}

export async function clearApiKey(): Promise<void> {
  await SecureStore.deleteItemAsync(SECURE_KEY);
}
