# CLAUDE.md — App Teste Mercados (sandbox)

## Identidade deste repositório

Este repositório é um **sandbox experimental** chamado "App Teste Mercados — Paulo".

**NÃO é o MarketPulse v5.4** da equipa ALATUS (ERA Porto Baixa).

| | Este repo | MarketPulse v5.4 (real) |
|---|---|---|
| Nome | App Teste Mercados | MarketPulse v5.4 |
| Stack | HTML puro (76 linhas) | Google Apps Script (6 ficheiros .gs) |
| Dados | CoinCap API (criptos) | 498 leads imobiliários reais |
| Utilizadores | Apenas o Paulo (teste) | 7 consultores ALATUS |
| Ambiente | Sandbox, sem CI/CD | Sistema produtivo |

## O que este repo contém

Um único ficheiro `Index.html` que:
- Carrega top 100 criptomoedas via CoinCap API (dados reais de mercado)
- Mostra tabela com ranking, preço, variação 24h
- Tem campo de pesquisa por nome/símbolo
- **Botão "Simular Compra"**: apenas dispara `alert()` — não executa trades reais
- **P/E ratio**: gerado por `Math.random()*50+5` — é FAKE, não tem significado financeiro

Stack: HTML + CSS inline + JS vanilla. Sem build, sem deps, sem servidor.
Fonte de dados: `api.coincap.io/v2/assets?limit=100` (público, sem auth). CoinCap v2 pode migrar para v3 pago.
Como correr: abrir `Index.html` no browser e clicar "Carregar Top 100 Criptos".

## Regras para qualquer instância Claude

1. **Nunca assumir** que este repo é o MarketPulse v5.4 da equipa ERA/ALATUS
2. **Nunca executar trades** — o botão Simular Compra é decorativo (`Index.html:71-73`)
3. **P/E é fictício** (`Index.html:53`, `Math.random()*50+5`) — não usar para análise financeira. Manter "Simulado" visível na UI; rejeitar PR que remova essa marca
4. **PT-PT only** — nunca PT-BR, nunca reescrever strings para EN sem pedido explícito
5. **Nunca inventar dados** — se CoinCap falhar, manter mensagem de erro existente. Sem fallback fictício
6. **Sem credenciais** no repo (público). Segredos vão para `.claude/settings.local.json` (gitignored)
7. O MarketPulse v5.4 real vive em Google Sheets + Apps Script, separado deste repo

## Referência a CLAUDIUS v2.0

Este ficheiro é um **SCOPE local**. As regras globais (GENESIS Protocol, tom PT-PT/tu, DD/MM/YYYY, EUR, nunca inventar dados, nunca executar trades, attribution) vivem no CLAUDIUS v2.0 master do Paulo e aplicam-se implicitamente aqui. Não duplicar — em caso de conflito, CLAUDIUS v2.0 vence.

## Histórico pal-api

Commits `e783867` (add) → `2992a2c` (remove) introduziram e removeram um helper para a Edge Function `pal-api` (Supabase). Removido por 401 unauthorized + UI confusa num sandbox trivial.

Para reintroduzir em segurança:
- Bearer token via input local, **nunca hardcoded**
- Feature flag off por defeito
- Fluxo CoinCap directo continua caminho principal

Não reintroduzir sem pedido explícito do Paulo.

## Pendente

- Rename do repo de `App-marketpulse` para `app-teste-mercados` (manual: GitHub → Settings → Rename)
