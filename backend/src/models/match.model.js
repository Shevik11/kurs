import prisma from '../lib/prisma.js';

export const createMatchTable = async () => {
  // Prisma handles table creation through migrations
  console.log('Prisma handles table creation through migrations');
};

const Match = {
  async playMatch(seasonName, homeTeamName, awayTeamName, goalsHome, goalsAway, matchDate) {
    const season = await prisma.season.findFirst({
      where: { seasonName }
    });
    if (!season) throw new Error('Season not found');

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
    const season = await prisma.season.findFirst({
      where: { seasonName },
      include: {
        teams: true
      }
    });
    
    if (!season) throw new Error('Season not found');
    
    const teams = season.teams;
    if (teams.length < 2) {
      throw new Error('At least 2 teams required to generate schedule');
    }

    // Check if matches already exist for this season
    const existingMatches = await this.getBySeason(seasonName);
    if (existingMatches.length > 0) {
      throw new Error('Schedule already generated for this season. Delete existing matches first.');
    }

    // Generate round-robin tournament matches
    const matches = [];
    const startDate = new Date();
    let matchDate = new Date(startDate);

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        matches.push({
          seasonId: season.id,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          goalsScoredHome: 0,
          goalsScoredAway: 0,
          matchDate: new Date(matchDate)
        });
        
        matchDate.setDate(matchDate.getDate() + 7);
        
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

    await prisma.match.createMany({
      data: matches
    });

    return matches;
  },

  async getTournamentTable(seasonName) {
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
      throw new Error('Match not found');
    }
    
    return { success: true };
  }
};

export default Match; 