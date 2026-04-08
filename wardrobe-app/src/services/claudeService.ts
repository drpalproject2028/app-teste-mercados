import Anthropic from '@anthropic-ai/sdk';
import type { ClothingItem, OutfitSuggestion } from '@/types';
import { getApiKey } from './apiKeyService';
import { readAsBase64 } from '@/storage/imageStorage';

const MAX_IMAGES = 6;

// Use Haiku for cost efficiency (~$0.01 per outfit vs $0.05 with Sonnet)
const MODEL = 'claude-haiku-4-5-20251001';

interface GenerateParams {
  items: ClothingItem[];
  occasion: string;
  onProgress?: (text: string) => void;
  signal?: AbortSignal;
}

export async function generateOutfit(params: GenerateParams): Promise<OutfitSuggestion> {
  const apiKey = await getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  });

  // Select a subset of items to keep payload lean
  const selected = params.items.slice(0, MAX_IMAGES);

  // Build image blocks
  const imageBlocks: Anthropic.ImageBlockParam[] = await Promise.all(
    selected.map(async (item) => {
      const base64 = await readAsBase64(item.imageUri);
      return {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: 'image/jpeg' as const,
          data: base64,
        },
      };
    }),
  );

  const itemList = selected
    .map((item, i) => `Peça ${i + 1}: ${item.label} (${item.category}${item.notes ? ' — ' + item.notes : ''})`)
    .join('\n');

  const systemPrompt = `És um consultor de moda de topo especializado nas tendências de 2026.
Analisas peças de roupa reais e crias combinações de outfits modernos e elegantes.
Respondes SEMPRE em português europeu, de forma directa e com personalidade.
Tens conhecimento das tendências actuais: oversized estruturado, cores sólidas ricas, layering inteligente, minimalismo premium, e athleisure elevado.`;

  const userPrompt = `Analisa as ${selected.length} peças de roupa nas imagens.

${itemList}

Ocasião: ${params.occasion}
Época: Primavera/Verão 2026

Cria 2-3 combinações de outfit. Para cada uma:

## Outfit [N] — [nome criativo cool]
**Peças:** [lista as peças pelo número]
**O look:** [2 frases sobre o estilo e porque funciona]
**Tendência 2026:** [1 frase sobre a trend que incorpora]
**Dica de styling:** [1 conselho prático — sapatos, acessório, etc.]

---

## Nota do Estilista
[1 parágrafo com observação geral sobre o guarda-roupa e 1 sugestão de peça que faltaria]`;

  let fullText = '';

  const stream = await client.messages.stream({
    model: MODEL,
    max_tokens: 1200,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          ...imageBlocks,
          { type: 'text', text: userPrompt },
        ],
      },
    ],
  });

  for await (const chunk of stream) {
    if (params.signal?.aborted) {
      stream.abort();
      throw new Error('CANCELLED');
    }
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      fullText += chunk.delta.text;
      params.onProgress?.(fullText);
    }
  }

  return {
    id: generateId(),
    items: selected.map(item => ({ itemId: item.id, role: 'sugerido' })),
    occasion: params.occasion,
    styleAdvice: fullText,
    generatedAt: new Date().toISOString(),
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
