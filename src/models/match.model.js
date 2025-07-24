import db from './db.js';

export const createMatchTable = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    home_team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    away_team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    goals_scored_home INTEGER DEFAULT 0,
    goals_scored_away INTEGER DEFAULT 0,
    match_date DATE
  )`);
};

const Match = {
  async playMatch(season_name, home_team_name, away_team_name, goals_home, goals_away, match_date) {
    // Get season and team ids
    const seasonRes = await db.query('SELECT id FROM season WHERE season_name = $1', [season_name]);
    if (!seasonRes.rows[0]) throw new Error('Season not found');
    const season_id = seasonRes.rows[0].id;
    const homeRes = await db.query('SELECT id FROM teams WHERE team_name = $1 AND season_id = $2', [home_team_name, season_id]);
    const awayRes = await db.query('SELECT id FROM teams WHERE team_name = $1 AND season_id = $2', [away_team_name, season_id]);
    if (!homeRes.rows[0] || !awayRes.rows[0]) throw new Error('Team not found');
    const home_team_id = homeRes.rows[0].id;
    const away_team_id = awayRes.rows[0].id;
    // Insert match
    await db.query(`
      INSERT INTO matches (season_id, home_team_id, away_team_id, goals_scored_home, goals_scored_away, match_date)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [season_id, home_team_id, away_team_id, goals_home, goals_away, match_date]);
    // Update stats for both teams (simplified, can be expanded)
    // ...
  },
  async getBySeason(season_name) {
    const seasonRes = await db.query('SELECT id FROM season WHERE season_name = $1', [season_name]);
    if (!seasonRes.rows[0]) throw new Error('Season not found');
    const season_id = seasonRes.rows[0].id;
    const res = await db.query('SELECT * FROM matches WHERE season_id = $1', [season_id]);
    return res.rows;
  }
};

export default Match; 