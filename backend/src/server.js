import app from './app.js';
import prisma from './lib/prisma.js';

const PORT = process.env.PORT || 8000;

// Initialize Prisma connection
(async () => {
  try {
    await prisma.$connect();
    console.log('Connected to database via Prisma');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
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