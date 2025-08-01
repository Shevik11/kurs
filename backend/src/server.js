import app from './app.js';
import prisma from './lib/prisma.js';

const PORT = process.env.PORT || 8000;

// Ініціалізація Prisma з'єднання
(async () => {
  try {
    await prisma.$connect();
    console.log('Підключено до бази даних через Prisma');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Помилка підключення до бази даних:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 