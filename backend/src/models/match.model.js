import prisma from '../lib/prisma.js';

export const createMatchTable = async () => {
  // Prisma handles table creation through migrations
  console.log('Prisma handles table creation through migrations');
};

const Match = {
  async playMatch(seasonName, homeTeamName, awayTeamName, goalsHome, goalsAway, matchDate) {
    // Get season
    const season = await prisma.season.findFirst({
      where: { seasonName }
    });
    if (!season) throw new Error('Season not found');

    // Get teams
    const homeTeam = await prisma.team.findFirst({
      where: { 
        teamName: homeTeamName,
        seasonId: season.id
      }
    });
    const awayTeam = await prisma.team.findFirst({
      where: { 
        teamName: awayTeamName,
        seasonId: season.id
      }
    });

    if (!homeTeam || !awayTeam) throw new Error('Team not found');

    // Create match
    return await prisma.match.create({
      data: {
        seasonId: season.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        goalsScoredHome: goalsHome,
        goalsScoredAway: goalsAway,
        matchDate: new Date(matchDate)
      }
    });
  },
  async getBySeason(seasonName) {
    const matches = await prisma.match.findMany({
      where: {
        season: {
          seasonName
        }
      },
      include: {
        season: true,
        homeTeam: true,
        awayTeam: true
      },
      orderBy: [
        { matchDate: 'asc' },
        { id: 'asc' }
      ]
    });

    return matches.map(match => ({
      id: match.id,
      goals_scored_home: match.goalsScoredHome,
      goals_scored_away: match.goalsScoredAway,
      match_date: match.matchDate,
      season_name: match.season.seasonName,
      home_team_name: match.homeTeam.teamName,
      away_team_name: match.awayTeam.teamName
    }));
  },

  async generateSchedule(seasonName) {
    // Отримуємо сезон та всі команди
    const season = await prisma.season.findFirst({
      where: { seasonName },
      include: {
        teams: true
      }
    });
    
    if (!season) throw new Error('Season not found');
    
    const teams = season.teams;
    if (teams.length < 2) {
      throw new Error('Потрібно мінімум 2 команди для генерації розкладу');
    }

    // Перевіряємо чи вже існують матчі для цього сезону
    const existingMatches = await this.getBySeason(seasonName);
    if (existingMatches.length > 0) {
      throw new Error('Розклад вже згенеровано для цього сезону. Видаліть існуючі матчі спочатку.');
    }

    // Генеруємо матчі кожен з кожним (круговий турнір)
    const matches = [];
    const startDate = new Date();
    let matchDate = new Date(startDate);

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        // Перший матч - команда i дома
        matches.push({
          seasonId: season.id,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          goalsScoredHome: 0,
          goalsScoredAway: 0,
          matchDate: new Date(matchDate)
        });
        
        matchDate.setDate(matchDate.getDate() + 7); // +7 днів між матчами
        
        // Зворотний матч - команда j дома  
        matches.push({
          seasonId: season.id,
          homeTeamId: teams[j].id,
          awayTeamId: teams[i].id,
          goalsScoredHome: 0,
          goalsScoredAway: 0,
          matchDate: new Date(matchDate)
        });
        
        matchDate.setDate(matchDate.getDate() + 7);
      }
    }

    // Додаємо матчі в базу даних
    await prisma.match.createMany({
      data: matches
    });

    return matches;
  },

  async getTournamentTable(seasonName) {
    // Отримуємо статистику команд
    const teams = await prisma.team.findMany({
      where: {
        season: {
          seasonName
        }
      },
      orderBy: [
        { points: 'desc' },
        { goalDifference: 'desc' },
        { goalsScored: 'desc' },
        { teamName: 'asc' }
      ]
    });

    // Додаємо позицію в таблиці
    const table = teams.map((team, index) => ({
      position: index + 1,
      team_name: team.teamName,
      win_games: team.winGames,
      draw_games: team.drawGames,
      lose_games: team.loseGames,
      goals_scored: team.goalsScored,
      goals_conceded: team.goalsConceded,
      goal_difference: team.goalDifference,
      points: team.points,
      matches_played: team.matchesPlayed
    }));

    return table;
  },

  async deleteMatch(matchId) {
    const deleted = await prisma.match.delete({
      where: {
        id: parseInt(matchId)
      }
    });
    
    if (!deleted) {
      throw new Error('Матч не знайдено');
    }
    
    return { success: true };
  }
};

export default Match; 