# App Teste Mercados

Sandbox HTML estático para testar a API CoinCap. Top 100 criptomoedas numa tabela simples.

## Não confundir com MarketPulse v5.4

O nome do repositório GitHub (`App-marketpulse`) é um acidente histórico. **Este repo NÃO é** o MarketPulse v5.4 — a ferramenta de prospecção gamificada da equipa ALATUS/ERA Porto Baixa, que vive em Google Sheets + Apps Script.

Rename recomendado: `drpalproject2028/app-teste-mercados` (acção manual em GitHub → Settings → Rename).

## Como correr

Abrir `Index.html` no browser. Clicar **Carregar Top 100 Criptos**. Não há build, não há dependências, não há servidor.

## O que faz

- Fetch top 100 criptomoedas via [CoinCap API](https://docs.coincap.io/)
- Tabela com: #, Nome, Preço (USD), Variação 24h (%), P/E Simulado, Simular Compra

> **Aviso**: O P/E é gerado por `Math.random()` e o botão Comprar dispara apenas `alert()`. Isto é um sandbox — não é ferramenta de trading.

## Estrutura

```
Index.html              — Aplicação (HTML + CSS + JS, tudo inline)
CLAUDE.md               — Contexto para instâncias Claude
AGENTS.md               — Ponteiro para CLAUDE.md (convenção multi-agente)
README.md               — Este ficheiro
.claude/settings.json   — Configuração Claude Code
```

## Attribution

GENESIS Protocol / Paulo Branco (drpalproject2028) — Porto
