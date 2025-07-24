import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  user: 'postgres', // заміни на свого користувача
  password: '904496Vfrc', // заміни на свій пароль
  database: 'football_calendare',
  port: 5432,
});

client.connect((err) => {
  if (err) {
    console.error('Помилка при підключенні до бази даних:', err);
  } else {
    console.log('Підключено до PostgreSQL');
  }
});

export default client; 