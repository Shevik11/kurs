import db from "./db.js";

export class tables {
    constructor() {
        this.database = db;
    }
    async showTablesOfSeason(season_name) {
        // console.log(season_name);
        let season_id = await team.convert_season_name_to_id(season_name);
        const query = `
            select season_name, team_name, matches_played, win_games, draw_games, lose_games,  goals_scored, goals_conceded, goal_difference, points
            from teams
            join season on teams.season_id = season.id
            where season_id = '${season_id}'
            ORDER BY points DESC, goal_difference DESC  `;
        const result =  await this.database.query(query);
        const columnWidths = {
            season_name: 20,
            team_name: 10,
            matches_played: 10,
            win_games: 10,
            lose_games: 10,
            draw_games: 10,
            goals_scored: 10,
            goals_conceded: 10,
            goal_difference: 10,
            points: 10
        };
        return { result, columnWidths }; 
    }

    async generateCalendarForSeason(seasonName) {
        const seasonId = await team.convert_season_name_to_id(seasonName);
        // console.log(seasonId);
        const query = `
            SELECT team_name
            FROM teams
            WHERE season_id = '${seasonId}'`;

        const result = await this.database.query(query);
        const teams = result.map(row => row.team_name);

        if (teams.length % 2 !== 0) {
            throw new Error("Кількість команд повинна бути парною");
        }

        const matches = [];
        const rounds = teams.length - 1;

        for (let round = 1; round <= rounds; round++) {
            const tour = [];
            for (let i = 0; i < teams.length / 2; i++) {
                const match = `${teams[i]} - ${teams[teams.length - 1 - i]}`;
                tour.push(match);
            }
            matches.push({ tourNumber: round, matches: tour });
            const lastTeam = teams.pop();
            teams.splice(1, 0, lastTeam);
        }

        return matches;
    }


}
export default tables