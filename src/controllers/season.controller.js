import Season from '../models/season.model.js';

const SeasonController = {
  async getAll(req, res) {
    try {
      const seasons = await Season.getAll();
      res.json(seasons);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async create(req, res) {
    try {
      const { season_name, season_year } = req.body;
      await Season.create(season_name, season_year);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const { old_season_name, old_season_year, new_season_name, new_season_year } = req.body;
      await Season.update(old_season_name, old_season_year, new_season_name, new_season_year);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const { season_name, season_year } = req.body;
      await Season.delete(season_name, season_year);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default SeasonController; 