import Team from '../models/team.model.js';

const TeamController = {
  async getAllWithSeasons(req, res) {
    try {
      const teams = await Team.getAllWithSeasons();
      res.json(teams);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getBySeason(req, res) {
    try {
      const { season_name } = req.query;
      const teams = await Team.getBySeason(season_name);
      res.json(teams);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async add(req, res) {
    try {
      const { team_name, team_season } = req.body;
      await Team.add(team_name, team_season);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async update(req, res) {
    try {
      const { team_name_for_update_, team_season_for_update, what_user_want, new_value } = req.body;
      await Team.update(team_season_for_update, team_name_for_update_, what_user_want, new_value);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async deleteFromSeason(req, res) {
    try {
      const { team_name, season_name } = req.body;
      await Team.deleteFromSeason(team_name, season_name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async delete(req, res) {
    try {
      const { team_name } = req.body;
      await Team.delete(team_name);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default TeamController; 