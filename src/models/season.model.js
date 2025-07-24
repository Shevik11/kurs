import db from './db.js';

export const createSeasonTable = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS season (
    id SERIAL PRIMARY KEY,
    season_name VARCHAR(255) NOT NULL,
    season_year VARCHAR(255) NOT NULL
  )`);
};

const Season = {
  async getAll() {
    const res = await db.query('SELECT * FROM season');
    return res.rows;
  },
  async create(season_name, season_year) {
    await db.query(
      'INSERT INTO season (season_name, season_year) VALUES ($1, $2)',
      [season_name, season_year]
    );
  },
  async update(old_name, old_year, new_name, new_year) {
    await db.query(
      'UPDATE season SET season_name = $1, season_year = $2 WHERE season_name = $3 AND season_year = $4',
      [new_name, new_year, old_name, old_year]
    );
  },
  async delete(season_name, season_year) {
    await db.query(
      'DELETE FROM season WHERE season_name = $1 AND season_year = $2',
      [season_name, season_year]
    );
  }
};

export default Season; 