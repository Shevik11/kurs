import db from "./db.js";
import teams_action from "./teams.js";
const team = new teams_action();


class Matches {
    constructor() {
        this.database = db;
    }

    async result_of_match(goalsScored, goalsConceded) {
        let result = goalsScored - goalsConceded;
        switch (true) {
            case result > 0:
                return {
                    win_games: 1, lose_games: 0, draw_games: 0, goal_scored: `${goalsScored}`, goal_conceded: `${goalsConceded}`,
                    goal_difference: `${result}`, points: 3, matches_played: 1
                };
            case result === 0:
                return {
                    win_games: 0, lose_games: 0, draw_games: 1, goal_scored: goalsScored, goal_conceded: goalsConceded,
                    goal_difference: result, points: 1, matches_played: 1
                };
            default:
                return {
                    win_games: 0, lose_games: 1, draw_games: 0, goal_scored: goalsScored, goal_conceded: goalsConceded,
                    goal_difference: result, points: 0, matches_played: 1
                };
        }
    }

    async change_stats(team_id, season_id, stats_to_change, how_change) {
        const change_stats_query = `
            UPDATE teams
            SET ${stats_to_change} = ${stats_to_change} + ${how_change}
            WHERE id = '${team_id}' AND season_id = '${season_id}'`;
            await this.database.query(change_stats_query);
    }



    async playMatchAndSaveData(season_name, homeTeamName, awayTeamName, goalsScoredHome, goalsScoredAway, matchDate) {
        try {
            const seasonId = await team.convert_season_name_to_id(season_name);
            const homeTeamId = await team.convert_team_name_to_id(homeTeamName);
            const awayTeamId = await team.convert_team_name_to_id(awayTeamName);
    
            // Занести дані матчу до таблиці matches
            const matchQuery = `
                INSERT INTO matches (season_id, home_team_id, away_team_id, goals_scored_home, goals_scored_away, match_date)
                VALUES ('${seasonId}', '${homeTeamId}', '${awayTeamId}', '${goalsScoredHome}', '${goalsScoredAway}', '${matchDate}')`;
            await this.database.query(matchQuery);
    
            const resultsHome = await this.result_of_match(goalsScoredHome, goalsScoredAway);
            const resultsAway = await this.result_of_match(goalsScoredAway, goalsScoredHome);

            await this.change_stats(homeTeamId, seasonId, 'win_games', resultsHome.win_games);
            await this.change_stats(homeTeamId, seasonId, 'lose_games', resultsHome.lose_games);
            await this.change_stats(homeTeamId, seasonId, 'draw_games', resultsHome.draw_games);
            await this.change_stats(homeTeamId, seasonId, 'goals_scored', resultsHome.goal_scored);
            await this.change_stats(homeTeamId, seasonId, 'goals_conceded', resultsHome.goal_conceded);
            await this.change_stats(homeTeamId, seasonId, 'goal_difference', resultsHome.goal_difference);
            await this.change_stats(homeTeamId, seasonId, 'points', resultsHome.points);
            await this.change_stats(homeTeamId, seasonId, 'matches_played', resultsHome.matches_played);

            await this.change_stats(awayTeamId, seasonId, 'win_games', resultsAway.win_games);
            await this.change_stats(awayTeamId, seasonId, 'lose_games', resultsAway.lose_games);
            await this.change_stats(awayTeamId, seasonId, 'draw_games', resultsAway.draw_games);
            await this.change_stats(awayTeamId, seasonId, 'goals_scored', resultsAway.goal_scored);
            await this.change_stats(awayTeamId, seasonId, 'goals_conceded', resultsAway.goal_conceded);
            await this.change_stats(awayTeamId, seasonId, 'goal_difference', resultsAway.goal_difference);
            await this.change_stats(awayTeamId, seasonId, 'points', resultsAway.points);
            await this.change_stats(awayTeamId, seasonId, 'matches_played', resultsAway.matches_played);

            console.log('Матч успішно зіграний та дані занесено до бази даних.');
        } catch (error) {
            console.error('Помилка при проведенні матчу:', error.message);
            throw error;
        }
    }
}


export default Matches