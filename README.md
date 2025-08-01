# Football Calendar Management System

A full-stack web application for managing football seasons, teams, matches, and tournament tables.

## Tech Stack

### Frontend
- SvelteKit - Full-stack framework
- Svelte 5 - Reactive UI framework  
- TypeScript - Type safety
- Tailwind CSS - Utility-first styling
- Vite - Fast development server

### Backend
- Node.js - JavaScript runtime
- Express.js - Web framework
- Prisma ORM - Database toolkit with type safety
- PostgreSQL - Relational database
- PayPal SDK - Payment integration

## Features

- Season Management - Create and manage football seasons
- Team Management - Add teams to seasons with statistics tracking
- Match Scheduling - Auto-generate round-robin tournament schedules
- Match Results - Record match results and update team statistics
- Tournament Table - Real-time standings with points, goals, and positions
- Premium Features - PayPal integration for paid features
- Modern UI - Responsive design with Tailwind CSS
- Type Safety - Full TypeScript support across frontend and backend

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd football-calendar
```

2. **Install dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Database setup**
```bash
cd ../backend

# Create .env file
echo 'DATABASE_URL="postgresql://username:password@localhost:5432/football_calendare?schema=public"' > .env

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

4. **Start development servers**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

5. **Access application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Prisma Studio: `npx prisma studio` → `http://localhost:5555`

## Usage Guide

### Create Season
- Go to "Seasons" page
- Add season name and year
- Seasons must have unique name+year combinations

### Add Teams
- Go to "Teams" page  
- Select season from dropdown
- Add team name to specific season

### Generate Schedule
- Go to "Schedule" page or "Table" page
- Click "Generate Schedule" for a season
- Creates round-robin tournament (each team plays every other team twice)

### Record Results
- Go to "Schedule" page
- Edit scheduled matches (0:0) to add real scores
- Team statistics update automatically

### View Tournament Table
- Go to "Table" page
- Select season to see standings
- Teams ranked by points, goal difference, goals scored

## Project Structure

```
├── backend/              # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/  # API route handlers
│   │   ├── models/      # Database models (Prisma)
│   │   ├── routes/      # Express routes
│   │   ├── lib/         # Utilities (Prisma client)
│   │   └── server.js    # Application entry point
│   ├── prisma/          # Database schema and migrations
│   └── package.json
│
├── frontend/            # SvelteKit + TypeScript + Tailwind
│   ├── src/
│   │   ├── routes/      # SvelteKit pages
│   │   ├── lib/         # API client and utilities
│   │   └── app.html     # HTML template
│   └── package.json
│
└── README.md           # This file
```

## API Endpoints

### Seasons
- `GET /api/seasons` - List all seasons
- `POST /api/seasons` - Create season  
- `PUT /api/seasons` - Update season
- `DELETE /api/seasons` - Delete season

### Teams  
- `GET /api/teams` - List teams with seasons
- `GET /api/teams/by-season?season_name=X` - Teams in season
- `POST /api/teams` - Add team to season
- `PUT /api/teams` - Update team
- `DELETE /api/teams` - Delete team completely
- `DELETE /api/teams/from-season` - Remove from specific season

### Matches
- `GET /api/matches/by-season?season_name=X` - Season matches
- `POST /api/matches` - Create/update match result
- `POST /api/matches/generate-schedule` - Generate tournament
- `GET /api/matches/tournament-table?season_name=X` - Standings
- `DELETE /api/matches/:id` - Delete match

## Key Features Explained

### Tournament Generation
- Round-robin format: Every team plays every other team twice (home & away)
- Automatic scheduling: Matches spread 7 days apart starting from today
- Duplicate prevention: Cannot generate if matches already exist

### Team Statistics
- Points: 3 for win, 1 for draw, 0 for loss
- Goal difference: Goals scored minus goals conceded  
- Automatic updates: Statistics recalculated when match results change

### Tournament Table Sorting
1. Points (descending)
2. Goal difference (descending)  
3. Goals scored (descending)
4. Team name (alphabetical)

## Development

### Database Management
```bash
# View data in browser GUI
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset

# Generate TypeScript types
npx prisma generate
```

## Deployment

### Backend
1. Set `DATABASE_URL` environment variable
2. Run `npx prisma migrate deploy`
3. Run `npm start`

### Frontend  
1. Run `npm run build`
2. Deploy `build/` directory to static hosting
3. Configure API base URL for production