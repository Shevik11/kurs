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

    async connect() {
        // Підключення вже створено в конструкторі, тут просто можемо вивести повідомлення
        console.log('Підключено до бази даних');
    }

    async query(sql) {
        return new Promise((resolve, reject) => { // створення нового обєкта проміс, що представляє результат асинхронної операції
            this.connection.query(sql, (err, results) => { // виклик квері
                if (err) {
                    reject(err); // обєкт помилки
                } else {
                    resolve(results); // результат запиту
                }
            });
        });
    }
}

export const db = new Db('localhost', 'root', '904496Vfrc', 'football_calendare');

export default db;
