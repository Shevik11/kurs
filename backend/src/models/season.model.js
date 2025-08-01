import prisma from '../lib/prisma.js';

export const createSeasonTable = async () => {
  // Prisma handles table creation through migrations
  // This function is kept for compatibility but does nothing
  console.log('Prisma handles table creation through migrations');
};

const Season = {
  async getAll() {
    return await prisma.season.findMany({
      orderBy: [
        { seasonYear: 'desc' },
        { seasonName: 'asc' }
      ]
    });
  },
  
  async exists(seasonName, seasonYear) {
    const count = await prisma.season.count({
      where: {
        seasonName,
        seasonYear
      }
    });
    return count > 0;
  },
  
  async create(seasonName, seasonYear) {
    const exists = await this.exists(seasonName, seasonYear);
    if (exists) {
      throw new Error(`Season "${seasonName}" ${seasonYear} already exists`);
    }
    
    return await prisma.season.create({
      data: {
        seasonName,
        seasonYear
      }
    });
  },

  async update(oldName, oldYear, newName, newYear) {
    // If data is changing, check if season already exists
    if (oldName !== newName || oldYear !== newYear) {
      const exists = await this.exists(newName, newYear);
      if (exists) {
        throw new Error(`Season "${newName}" ${newYear} already exists`);
      }
    }
    
    const updated = await prisma.season.updateMany({
      where: {
        seasonName: oldName,
        seasonYear: oldYear
      },
      data: {
        seasonName: newName,
        seasonYear: newYear
      }
    });
    
    if (updated.count === 0) {
      throw new Error(`Season "${oldName}" ${oldYear} not found`);
    }
    
    return updated;
  },

  async delete(seasonName, seasonYear) {
    const deleted = await prisma.season.deleteMany({
      where: {
        seasonName,
        seasonYear
      }
    });
    
    if (deleted.count === 0) {
      throw new Error(`Season "${seasonName}" ${seasonYear} not found`);
    }
    
    return deleted;
  }
};

export default Season; 