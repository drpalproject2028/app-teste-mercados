# GPL Perto de Ti

App para encontrar o GPL (autogás) mais barato perto de ti em Portugal.

## Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Leaflet, Zustand
- **Backend**: FastAPI, PostgreSQL + PostGIS, SQLAlchemy
- **Infra**: Docker Compose

## Como correr

### Com Docker (recomendado)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API docs: http://localhost:8000/docs

### Sem Docker

**Backend:**

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Precisa de PostgreSQL + PostGIS a correr
export DATABASE_URL=postgresql://gpl:gpl@localhost:5432/gpldb
uvicorn main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

## API Endpoints

| Método | Path | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/stations/nearby?lat=&lon=&radius_km=&sort=` | Postos próximos com score |
| POST | `/api/stations/{id}/report` | Submeter preço |
| GET | `/api/stations/{id}` | Detalhe do posto |

## Algoritmo de decisão

```
score = (preço_normalizado × 0.5) + (distância_normalizada × 0.3) - (confiança × 0.2)
```

Menor score = melhor opção.

## Sistema de confiança

- Baseado em reports de utilizadores
- Decay exponencial com half-life de 48h
- Mais reports recentes = maior confiança
