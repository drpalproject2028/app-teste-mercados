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

## Regras para qualquer instância Claude

1. **Nunca assumir** que este repo é o MarketPulse v5.4 da equipa ERA/ALATUS
2. **Nunca executar trades** — o botão Simular Compra é decorativo
3. **P/E é fictício** — não usar para análise financeira
4. O MarketPulse v5.4 real vive em Google Sheets + Apps Script, separado deste repo

## Pendente

- Rename do repo de `App-marketpulse` para `app-teste-mercados` (manual: GitHub → Settings → Rename)
