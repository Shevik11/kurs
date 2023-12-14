import db from "./db.js";

class teams_action {
    constructor(){
        this.database = db;
    }

    async convert_season_name_to_id(season_name) {
        try {
            const query = `SELECT id FROM season WHERE season_name = '${season_name}'`;
            const result = await this.database.query(query);
            
    
            if (result.length > 0 && result[0].id !== undefined) { // check length and check if id is undefined
                const my_result = result[0].id; // my result = id of first element
                return my_result;
            } else {
                console.error('Об\'єкт result порожній або не має властивості id.');
                return null;
            }
        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
    
    async convert_team_name_to_id(team_name){
        const query = `select id from teams where team_name = '${team_name}'`;
        const result = await this.database.query(query);

        if (result.length > 0 && result[0].id !== undefined) {
            const my_result = result[0].id;
            return my_result;
        } else {
            console.error('Об\'єкт result порожній або не має властивості id.');
            return null;
        }
    } catch (error) {
        console.error('Помилка при виконанні запиту:', error.message);
        throw error;
    }

    
        
    async AllTeamsAndSeasons() {
        try {
            const query = this.database.query(`
                SELECT team_name, season_name 
                FROM teams 
                JOIN season ON teams.season_id = season.id
            `);
    
            const resulted = await query; // Видаліть sql тут
    
            const data = resulted.map(item => ({
                season_name: item.season_name,
                team_name: item.team_name
            }));
    
            return data;
        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
    
    


        async GetTeamsFromSeason(season_name) {
            try {
                let season_id = await this.convert_season_name_to_id(season_name);
                // console.log(season_id);
                const query = `select season_name, team_name from teams inner join season on  teams.season_id = season.id where season_id = ${season_id};`;
                const result = await this.database.query(query);
                // console.log(query);
                return result;
                // Обробка результатів
            } catch (error) {
                console.error('Помилка при виконанні запиту:', error.message);
                throw error;
            }
        }
        
        async addTeam(team_name, season_name) {
            try {
                let season_id = await this.convert_season_name_to_id(season_name);
        
                const queryInsert = this.database.query(`
                    INSERT INTO teams (team_name, season_id, win_games, draw_games, lose_games, goals_scored, goals_conceded, goal_difference, points, matches_played) 
                    VALUES ('${team_name}', ${season_id}, 0, 0, 0, 0, 0, 0, 0, 0 );
                `);
        
                // const resultInsert = await queryInsert.execute();
                // const insertId = queryInsert.insertId;
        
                console.log(`Дані успішно вставлені в таблицю "teams"`);
                return { success: true };
            } catch (error) {
                console.error('Помилка при виконанні запиту:', error.message);
                throw error;
            }
        }
        

        
        
        async changeTeamInfo(SeasonName, TeamName, changeIT, newValue) {      
            this.SeasonName = SeasonName;
            this.changeIT = changeIT;
            this.newValue = newValue;
            this.TeamName = TeamName;
            let season_id = await this.convert_season_name_to_id(this.SeasonName);
            const query = this.database.query(`
                update teams
                set ${changeIT} = '${newValue}'
                where team_name = '${TeamName}' and season_id = '${season_id}'`);
            //  await query.execute();
             console.log("Айді сезону для команди успішно оновлено")
             return {success: true};
        }
        
        async deleteTeamInSeason(TeamName, SeasonName) {
            try {
                this.team_name = TeamName;
                const team_id = await this.convert_team_name_to_id(this.team_name);
                // console.log(team_id);
        
                const query1 = `DELETE FROM matches WHERE home_team_id = '${team_id}' OR away_team_id = '${team_id}'`;
                await this.database.query(query1);
        
                this.SeasonName = SeasonName;
                // console.log(SeasonName);
        
                const season_id = await this.convert_season_name_to_id(this.SeasonName);
                // console.log(season_id);
        
                const query = `DELETE FROM teams WHERE season_id = '${season_id}' AND team_name = '${TeamName}'`;
                // console.log(query);
        
                await this.database.query(query);
        
                console.log(`Команду ${TeamName} було видалено у сезоні №${season_id}`);
                
                return { success: true };
            } catch (error) {
                console.error('Помилка видалення команди в сезоні:', error);
                return { success: false, error: error.message };
            }
        }
        


        async deleteTeam(TeamName){
            try{
                this.team_name = TeamName;
                let team_id = await this.convert_team_name_to_id(this.team_name);
                // console.log(team_id);
                const query1 = `delete from matches where home_team_id = '${team_id}' or away_team_id = '${team_id}'`
                await this.database.query(query1);

                const query = `delete from teams
                where  team_name = '${TeamName}'`
                await this.database.query(query);
                console.log(`Команду ${TeamName} було видалено`)
                return {success: true}
            }
            catch(error){
                console.error('Помилка видалення команди:', error);
                return { success: false, error: error.message };
            }
        }
}

export default teams_action
