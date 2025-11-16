# Simplicity Core

REST API vytvorené v NestJS pre správu oznamov (announcements) s real-time WebSocket notifikáciami a možnosťou full-text vyhľadávania.

## Funkcie

- ✅ RESTful API pre CRUD operácie
- ✅ Full-text vyhľadávanie s podporou anglického jazyka
- ✅ Real-time WebSocket notifikácie
- ✅ Validácia vstupov
- ✅ Swagger/OpenAPI dokumentácia
- ✅ PostgreSQL databáza s Prisma ORM
- ✅ Docker pre lokálny vývoj

## Požiadavky

- Node.js 20+ a npm
- Docker a Docker Compose (pre kontajnerizované prostredie)
- PostgreSQL 17+ (ak spúšťate databázu lokálne)

## Lokálne nastavenie

1. **Spustite služby:**

   ```bash
   docker-compose up -d
   ```

2. **Spustite databázové migrácie:**

   ```bash
   docker exec -it simplicity-core npx prisma migrate deploy
   ```

3. **Prístup k aplikácii:**
   - API: http://localhost:3000
   - Swagger UI: http://localhost:3000/api
   - Databáza: localhost:5432

**Poznámka:** Po spustení kontajnerov musíte manuálne spustiť databázové migrácie. Databáza bude pripravená po niekoľkých sekundách.

## API Endpointy

### Základná URL

```
http://localhost:3000
```

### Oznamy

#### Získať všetky oznamy

```http
GET /announcements
```

**Query parametre:**

- `category` (voliteľné): Filtrovanie podľa kategórie
  - Hodnoty: `NEW_FEATURES`, `TIPS`, `MONTHLY_DIGEST`, `SECURITY_UPDATES`, `PROMOTIONS`, `OTHER`
- `search` (voliteľné): Full-text vyhľadávací dotaz (vyhľadáva v title a body)
- `skip` (voliteľné): Offset pre stránkovanie (číslo, predvolené: 0)
- `take` (voliteľné): Limit pre stránkovanie (číslo, min: 1, max: 100, predvolené: 10)

**Príklad:**

```bash
# Získať všetky oznámenia
curl http://localhost:3000/announcements

# Filtrovať podľa kategórie
curl http://localhost:3000/announcements?category=NEW_FEATURES

# Vyhľadať oznámenia
curl http://localhost:3000/announcements?search=important

# Kombinované filtre so stránkovaním
curl "http://localhost:3000/announcements?category=NEW_FEATURES&search=search&skip=0&take=10"
```

**Odpoveď:** `200 OK`

```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "New Feature: Enhanced Search",
    "body": "We are excited to announce...",
    "category": "NEW_FEATURES",
    "createdAt": "2025-11-15T20:30:00.000Z",
    "updatedAt": "2025-11-15T20:30:00.000Z"
  }
]
```

#### Získať oznamy podľa ID

```http
GET /announcements/:id
```

**Príklad:**

```bash
curl http://localhost:3000/announcements/123e4567-e89b-12d3-a456-426614174000
```

**Odpoveď:** `200 OK`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "New Feature: Enhanced Search",
  "body": "We are excited to announce...",
  "category": "NEW_FEATURES",
  "createdAt": "2025-11-15T20:30:00.000Z",
  "updatedAt": "2025-11-15T20:30:00.000Z"
}
```

**Chybová odpoveď:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Announcement with ID \"...\" not found"
}
```

#### Vytvoriť oznam

```http
POST /announcements
```

**Telo požiadavky:**

```json
{
  "title": "New Feature: Enhanced Search",
  "body": "We are excited to announce our new enhanced search functionality...",
  "category": "NEW_FEATURES"
}
```

**Validácia:**

- `title`: Povinné, reťazec, max 500 znakov
- `body`: Povinné, reťazec
- `category`: Povinné, musí byť platná enum hodnota

**Príklad:**

```bash
curl -X POST http://localhost:3000/announcements \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Feature: Enhanced Search",
    "body": "We are excited to announce...",
    "category": "NEW_FEATURES"
  }'
```

**Odpoveď:** `201 Created`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "New Feature: Enhanced Search",
  "body": "We are excited to announce...",
  "category": "NEW_FEATURES",
  "createdAt": "2025-11-15T20:30:00.000Z",
  "updatedAt": "2025-11-15T20:30:00.000Z"
}
```

**Poznámka:** Vytvorenie oznamu spustí WebSocket notifikáciu pre všetkých pripojených klientov.

#### Aktualizovať oznam

```http
PATCH /announcements/:id
```

**Body požiadavky:** (všetky polia voliteľné)

```json
{
  "title": "Updated Title",
  "body": "Updated body content",
  "category": "TIPS"
}
```

**Príklad:**

```bash
curl -X PATCH http://localhost:3000/announcements/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

**Odpoveď:** `200 OK` (rovnaká štruktúra ako GET)

**Chybová odpoveď:** `404 Not Found` (ak oznam neexistuje)

#### Zmazať oznam

```http
DELETE /announcements/:id
```

**Príklad:**

```bash
curl -X DELETE http://localhost:3000/announcements/123e4567-e89b-12d3-a456-426614174000
```

**Odpoveď:** `200 OK`

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Nová funkcia: Rozšírené vyhľadávanie",
  "body": "S radosťou oznamujeme...",
  "category": "NEW_FEATURES",
  "createdAt": "2025-11-15T20:30:00.000Z",
  "updatedAt": "2025-11-15T20:30:00.000Z"
}
```

**Chybová odpoveď:** `404 Not Found` (ak oznam neexistuje)

## WebSocket Notifikácie

Aplikácia obsahuje podporu WebSocket pre real-time notifikácie o oznamoch. Po vytvorení oznamu, všetci pripojení klienti dostanú notifikáciu.

### Počúvanie na WebSocket

Pre počúvanie notifikácií v termináli zadajte príkaz:

```bash
npm run listen:announcements
```

Príkazom sa pripojíte k WebSocket serveru a zobrazia sa real-time oznamy po vytvorení ako:

**Detaily WebSocket pripojenia:**

- **URL:** `http://localhost:3000/announcements`
- **Udalosť:** `announcement:created`
- **Payload:** Objekt oznamu (id, title, body, category, createdAt, updatedAt)

**Príklad výstupu:**

```
🔌 Connecting to WebSocket server...
📍 Server: http://localhost:3000/announcements
⏳ Waiting for announcements...

✅ Connected to WebSocket server
👂 Listening for announcement:created events...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📢 NEW ANNOUNCEMENT RECEIVED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ID:       123e4567-e89b-12d3-a456-426614174000
Title:    New Feature: Enhanced Search
Category: NEW_FEATURES
Body:     We are excited to announce...
Created:  11/15/2025, 8:30:00 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Stlačte `Ctrl+C` pre zastavenie Websocketu.

## Licencia

UNLICENSED
