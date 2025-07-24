import Match from '../models/match.model.js';

const MatchController = {
  async playMatch(req, res) {
    try {
      const { season_name, home_team_name, away_team_name, goals_scored_home, goals_scored_away, match_date } = req.body;
      await Match.playMatch(season_name, home_team_name, away_team_name, goals_scored_home, goals_scored_away, match_date);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getBySeason(req, res) {
    try {
      const { season_name } = req.query;
      const matches = await Match.getBySeason(season_name);
      res.json(matches);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

export default MatchController; 