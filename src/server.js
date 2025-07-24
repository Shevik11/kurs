import app from './app.js';
import { createSeasonTable } from './models/season.model.js';
import { createTeamTable } from './models/team.model.js';
import { createMatchTable } from './models/match.model.js';

const PORT = process.env.PORT || 8000;

// Ініціалізація таблиць
(async () => {
  await createSeasonTable();
  await createTeamTable();
  await createMatchTable();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})(); 