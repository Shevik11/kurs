// actions with seasons(football)
import db from "./db.js"; 
class SeasonActions {
    constructor() {
        this.database = db;
    }

    async query(sql) {
        try {
            const result = await this.database.query(sql);
            // const full_result = await result.execute();  
            return result;
        } catch (error) {
            console.error('Помилка при виконанні запиту до бази даних:', error);
            throw error;
        }
    }
    
    async selectAll() {
        try {
            const query = this.database.query('select * from season');
            const result = await query.execute();
            console.log(result);

            const columnWidths = {
                id: 5,
                season_name: 20,
                season_year: 15
            };

            let tableHTML = '<table><tr>';
            tableHTML += Object.keys(columnWidths).map(column => `<th>${column}</th>`).join(''); // get titles of table 
            tableHTML += '</tr>';

            // Форматуємо кожен рядок даних
            result.forEach(item => {
                tableHTML += '<tr>';
                tableHTML += Object.keys(columnWidths).map(column => `<td>${item[column]}</td>`).join('');
                tableHTML += '</tr>';
            });

            tableHTML += '</table>';
            return tableHTML;
        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
    async insertData(season_name, season_year) {
        try {
            const query = this.database.query(`INSERT INTO season (season_name, season_year) VALUES ('${season_name}', '${season_year}')`);
            // await query.execute();
            console.log(`Дані успішно вставлені в таблицю "season".`);
            return { success: true };
        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
    
    

    async updateData(old_season_name, old_season_year, new_season_name, new_season_year) {
        this.old_season_name = old_season_name;
        this.old_season_year = old_season_year;
        this.new_season_name = new_season_name;
        this.new_season_year = new_season_year; 
        try {
            const query = this.database.query(`
                UPDATE season
                SET season_name = '${new_season_name}', season_year = '${new_season_year}'
                WHERE season_name = '${old_season_name}' AND season_year = '${old_season_year}'
            `);
            // await query.execute();
            console.log(`Дані успішно видалені з таблиці "season".`);
            return { success: true };

        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
    
    
    

    async deleteData(season_name, season_year) {
        this.season_name = season_name;
        this.season_year = season_year;
        try {
            const query = this.database.query(`DELETE FROM season WHERE season_name = '${season_name}' AND season_year = '${season_year}'`);
            // await query.execute();
            console.log(`Дані успішно видалені з таблиці "season".`);
            return { success: true };
        } catch (error) {
            console.error('Помилка при виконанні запиту:', error.message);
            throw error;
        }
    }
}    

export default SeasonActions
