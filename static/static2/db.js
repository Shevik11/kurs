import * as mysql2 from 'mysql2';
class Db {
    constructor(host, user, password, database) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;

        // Зберігаємо підключення в конструкторі
        this.connection = mysql2.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
        });

        // Виклик методу connect для встановлення з'єднання
        this.connection.connect((err) => {
            if (err) {
                console.error('Помилка при підключенні до бази даних:', err);
            } else {
                console.log('Підкл до бази даних');
            }
        });
    }

    // виконання sql запиту
    async query(sql) {
        return new Promise((resolve, reject) => { // create new object Promise
            this.connection.query(sql, (err, results) => { // 
                if (err) {
                    reject(err); // error object
                } else {
                    resolve(results); // result
                }
            });
        });
    }
}

export const db = new Db('localhost', 'root', '904496Vfrc', 'football_calendare');

export default db;
