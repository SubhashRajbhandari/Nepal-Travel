# Nepal Travel Recommendation Web App

A full-stack Next.js project for discovering Nepal travel destinations, planning trips, estimating budgets, saving destinations, and collecting traveler reviews.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM
- NextAuth
- OpenAI-compatible AI itinerary support

## Local Setup

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

On Windows PowerShell, use `npm.cmd` if scripts are blocked by execution policy:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

## Environment Variables

Update `.env` with your real database credentials:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nepal_travel_app?schema=public"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="replace-with-your-local-password"
POSTGRES_DB="nepal_travel_app"
POSTGRES_PORT="5432"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
AI_API_KEY=""
AI_MODEL="gpt-4o-mini"
```

If `AI_API_KEY` is empty, the app will use fallback itinerary and budget logic instead of calling an AI service.

## Docker PostgreSQL

If Docker Desktop is installed and the Docker CLI is available, start PostgreSQL with:

```bash
docker compose up -d
```

Then run:

```bash
npm run db:migrate -- --name init
npm run db:seed
```

## Database

The first schema includes:

- Users and roles
- Destination categories
- Destinations
- Reviews and difficulty feedback
- Bookmarks
- AI-generated itineraries
- Recommendations
- Destination suggestions
- Notifications
- Report snapshots

Seed data includes the required Nepal destinations such as Everest Base Camp, Annapurna Base Camp, Pashupatinath Temple, Lumbini, Pokhara, Rara Lake, Upper Mustang, Chitwan National Park, Bandipur, Manang, Muktinath, and Nagarkot.

Default seeded admin account:

```txt
Email: admin@nepaltravel.test
Password: admin12345
```

Change this password before using the app outside local development.

## Useful Commands

```bash
npm run dev
npm run build
npm run lint
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
npm run db:studio
```
