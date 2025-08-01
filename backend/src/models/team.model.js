import prisma from '../lib/prisma.js';

export const createTeamTable = async () => {
  // Prisma handles table creation through migrations
  console.log('Prisma handles table creation through migrations');
};

const Team = {
  async getAllWithSeasons() {
    const teams = await prisma.team.findMany({
      include: {
        season: true
      },
      orderBy: {
        teamName: 'asc'
      }
    });

    const teamMap = new Map();
    teams.forEach(team => {
      if (!teamMap.has(team.teamName)) {
        teamMap.set(team.teamName, {
          team_name: team.teamName,
          seasons: []
        });
      }
      teamMap.get(team.teamName).seasons.push(team.season.seasonName);
    });

    return Array.from(teamMap.values());
  },

  async getBySeason(seasonName) {
    const teams = await prisma.team.findMany({
      where: {
        season: {
          seasonName
        }
      },
      include: {
        season: true
      }
    });

    return teams.map(team => ({
      season_name: team.season.seasonName,
      team_name: team.teamName
    }));
  },

  async add(teamName, seasonName) {
    const season = await prisma.season.findFirst({
      where: { seasonName }
    });
    
    if (!season) {
      throw new Error('Season not found');
    }

    return await prisma.team.create({
      data: {
        teamName,
        seasonId: season.id,
        winGames: 0,
        drawGames: 0,
        loseGames: 0,
        goalsScored: 0,
        goalsConceded: 0,
        goalDifference: 0,
        points: 0,
        matchesPlayed: 0
      }
    });
  },

  async update(seasonName, teamName, field, newValue) {
    const season = await prisma.season.findFirst({
      where: { seasonName }
    });
    
    if (!season) {
      throw new Error('Season not found');
    }

    const fieldMap = {
      'team_name': 'teamName',
      'win_games': 'winGames',
      'draw_games': 'drawGames',
      'lose_games': 'loseGames',
      'goals_scored': 'goalsScored',
      'goals_conceded': 'goalsConceded',
      'goal_difference': 'goalDifference',
      'points': 'points',
      'matches_played': 'matchesPlayed'
    };

    const prismaField = fieldMap[field] || field;

    return await prisma.team.updateMany({
      where: {
        teamName,
        seasonId: season.id
      },
      data: {
        [prismaField]: newValue
      }
    });
  },

  async deleteFromSeason(teamName, seasonName) {
    const season = await prisma.season.findFirst({
      where: { seasonName }
    });
    
    if (!season) {
      throw new Error('Season not found');
    }

    return await prisma.team.deleteMany({
      where: {
        teamName,
        seasonId: season.id
      }
    });
  },

  async delete(teamName) {
    return await prisma.team.deleteMany({
      where: {
        teamName
      }
    });
  }
};

export default Team; 