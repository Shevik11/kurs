const BASE_URL = 'http://localhost:8000/api';
async function handleResponse<T>(response: Response): Promise<T> {
  console.log(`API Response: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    console.log('API Data:', data);
    return data;
  } catch (e) {
    console.error('Failed to parse JSON response:', e);
    throw new Error('Invalid JSON response from server');
  }
}
export interface Season {
  season_name: string;
  season_year: string; 
}

export interface Team {
  team_name: string;
  team_season: string;
  seasons?: string[];
}

export interface Match {
  season_name: string;
  home_team_name: string;
  away_team_name: string;
  goals_scored_home: number;
  goals_scored_away: number;
  match_date: string;
}

export interface TournamentTeam {
  position: number;
  team_name: string;
  matches_played: number;
  win_games: number;
  draw_games: number;
  lose_games: number;
  goals_scored: number;
  goals_conceded: number;
  goal_difference: number;
  points: number;
}
export const seasonApi = {
  getAll: async (): Promise<Season[]> => {
    const response = await fetch(`${BASE_URL}/seasons`);
    return handleResponse<Season[]>(response);
  },
  create: async (season_name: string, season_year: string): Promise<Season> => {
    const response = await fetch(`${BASE_URL}/seasons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season_name, season_year }),
    });
    return handleResponse<Season>(response);
  },
  update: async (
    old_season_name: string,
    old_season_year: string,
    new_season_name: string,
    new_season_year: string
  ): Promise<Season> => {
    const response = await fetch(`${BASE_URL}/seasons`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_season_name, old_season_year, new_season_name, new_season_year }),
    });
    return handleResponse<Season>(response);
  },
  delete: async (season_name: string, season_year: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/seasons`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season_name, season_year }),
    });
    return handleResponse<{ message: string }>(response);
  },
};
export const teamApi = {
  getAllWithSeasons: async (): Promise<Team[]> => {
    const response = await fetch(`${BASE_URL}/teams`);
    return handleResponse<Team[]>(response);
  },
  getBySeason: async (season_name: string): Promise<Team[]> => {
    const response = await fetch(`${BASE_URL}/teams/by-season?season_name=${encodeURIComponent(season_name)}`);
    return handleResponse<Team[]>(response);
  },
  add: async (team_name: string, team_season: string): Promise<Team> => {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_name, team_season }),
    });
    return handleResponse<Team>(response);
  },
  update: async (
    team_name_for_update_: string,
    team_season_for_update: string,
    what_user_want: string,
    new_value: string
  ): Promise<Team> => {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_name_for_update_, team_season_for_update, what_user_want, new_value }),
    });
    return handleResponse<Team>(response);
  },
  deleteFromSeason: async (team_name: string, season_name: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/teams/from-season`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_name, season_name }),
    });
    return handleResponse<{ message: string }>(response);
  },
  delete: async (team_name: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/teams`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_name }),
    });
    return handleResponse<{ message: string }>(response);
  },
};
export const matchApi = {
  playMatch: async (
    season_name: string,
    home_team_name: string,
    away_team_name: string,
    goals_scored_home: number,
    goals_scored_away: number,
    match_date: string
  ): Promise<Match> => {
    const response = await fetch(`${BASE_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season_name, home_team_name, away_team_name, goals_scored_home, goals_scored_away, match_date }),
    });
    return handleResponse<Match>(response);
  },
  getBySeason: async (season_name: string): Promise<Match[]> => {
    const response = await fetch(`${BASE_URL}/matches/by-season?season_name=${encodeURIComponent(season_name)}`);
    return handleResponse<Match[]>(response);
  },
  generateSchedule: async (season_name: string): Promise<{ success: boolean; message: string; matches: any[] }> => {
    const response = await fetch(`${BASE_URL}/matches/generate-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season_name }),
    });
    return handleResponse(response);
  },
  getTournamentTable: async (season_name: string): Promise<TournamentTeam[]> => {
    const response = await fetch(`${BASE_URL}/matches/tournament-table?season_name=${encodeURIComponent(season_name)}`);
    return handleResponse<TournamentTeam[]>(response);
  },
  deleteMatch: async (matchId: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${BASE_URL}/matches/${matchId}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
export const paypalApi = {
  createPayment: async (): Promise<void> => {
    const response = await fetch(`${BASE_URL}/paypal/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const data: { approval_url?: string } = await handleResponse(response);
    if (data.approval_url) {
      window.location.href = data.approval_url;
    } else {
      throw new Error('No PayPal approval URL received.');
    }
  }
}; 