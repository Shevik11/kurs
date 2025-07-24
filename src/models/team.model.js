import db from './db.js';

export const createTeamTable = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    season_id INTEGER NOT NULL REFERENCES season(id) ON DELETE CASCADE,
    win_games INTEGER DEFAULT 0,
    draw_games INTEGER DEFAULT 0,
    lose_games INTEGER DEFAULT 0,
    goals_scored INTEGER DEFAULT 0,
    goals_conceded INTEGER DEFAULT 0,
    goal_difference INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0
  )`);
};

const Team = {
  async getAllWithSeasons() {
    const res = await db.query(`
      SELECT team_name, season_name 
      FROM teams 
      JOIN season ON teams.season_id = season.id
    `);
    return res.rows;
  },
  async getBySeason(season_name) {
    const res = await db.query(`
      SELECT season_name, team_name 
      FROM teams 
      INNER JOIN season ON teams.season_id = season.id 
      WHERE season_name = $1
    `, [season_name]);
    return res.rows;
  },
  async add(team_name, season_name) {
    const seasonRes = await db.query('SELECT id FROM season WHERE season_name = $1', [season_name]);
    if (!seasonRes.rows[0]) throw new Error('Season not found');
    const season_id = seasonRes.rows[0].id;
    await db.query(`
      INSERT INTO teams (team_name, season_id, win_games, draw_games, lose_games, goals_scored, goals_conceded, goal_difference, points, matches_played)
      VALUES ($1, $2, 0, 0, 0, 0, 0, 0, 0, 0)
    `, [team_name, season_id]);
  },
  async update(season_name, team_name, field, new_value) {
    const seasonRes = await db.query('SELECT id FROM season WHERE season_name = $1', [season_name]);
    if (!seasonRes.rows[0]) throw new Error('Season not found');
    const season_id = seasonRes.rows[0].id;
    await db.query(
      `UPDATE teams SET ${field} = $1 WHERE team_name = $2 AND season_id = $3`,
      [new_value, team_name, season_id]
    );
  },
  async deleteFromSeason(team_name, season_name) {
    const seasonRes = await db.query('SELECT id FROM season WHERE season_name = $1', [season_name]);
    if (!seasonRes.rows[0]) throw new Error('Season not found');
    const season_id = seasonRes.rows[0].id;
    await db.query('DELETE FROM teams WHERE team_name = $1 AND season_id = $2', [team_name, season_id]);
  },
  async delete(team_name) {
    await db.query('DELETE FROM teams WHERE team_name = $1', [team_name]);
  }
};

export default Team; 