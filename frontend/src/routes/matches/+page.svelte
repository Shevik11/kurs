<script>
  import { onMount } from 'svelte';
  import { matchApi, seasonApi, teamApi } from '$lib/api';

  let seasons = [];
  let teams = [];
  let selectedSeasonForPlay = '';
  let selectedSeasonForView = '';
  let homeTeamName = '';
  let awayTeamName = '';
  let goalsScoredHome = 0;
  let goalsScoredAway = 0;
  let matchDate = new Date().toISOString().slice(0, 10);

  let matchesInViewedSeason = [];
  let errorMessage = '';
  let successMessage = '';

  let editingMatch = null;
  let editingHomeTeam = '';
  let editingAwayTeam = '';
  let editingHomeGoals = 0;
  let editingAwayGoals = 0;
  let editingDate = '';
  let editError = '';
  let editSuccess = '';

  let deletingMatch = null;

  onMount(async () => {
    await fetchSeasons();
  });

  async function fetchSeasons() {
    errorMessage = '';
    try {
      seasons = await seasonApi.getAll();
      if (seasons.length > 0) {
        selectedSeasonForPlay = seasons[0].season_name;
        selectedSeasonForView = seasons[0].season_name;
        await fetchTeamsForPlayMatch();
        await fetchMatchesForView();
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function fetchTeamsForPlayMatch() {
    errorMessage = '';
    if (!selectedSeasonForPlay) {
      teams = [];
      return;
    }
    try {
      teams = await teamApi.getBySeason(selectedSeasonForPlay);
      homeTeamName = '';
      awayTeamName = '';
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function fetchMatchesForView() {
    errorMessage = '';
    if (!selectedSeasonForView) {
      matchesInViewedSeason = [];
      return;
    }
    try {
      matchesInViewedSeason = await matchApi.getBySeason(selectedSeasonForView);
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function handlePlayMatch() {
    errorMessage = '';
    successMessage = '';
    if (!selectedSeasonForPlay || !homeTeamName || !awayTeamName || homeTeamName === awayTeamName) {
      errorMessage = 'Будь ласка, оберіть різні команди та сезон.';
      return;
    }

    try {
      await matchApi.playMatch(
        selectedSeasonForPlay,
        homeTeamName,
        awayTeamName,
        goalsScoredHome,
        goalsScoredAway,
        matchDate
      );
      homeTeamName = '';
      awayTeamName = '';
      goalsScoredHome = 0;
      goalsScoredAway = 0;
      matchDate = new Date().toISOString().slice(0, 10);
      successMessage = 'Матч успішно записано!';
      await fetchMatchesForView();
    } catch (error) {
      errorMessage = error.message;
    }
  }

  function startEdit(match) {
    editingMatch = { ...match };
    editingHomeTeam = match.home_team_name;
    editingAwayTeam = match.away_team_name;
    editingHomeGoals = match.goals_scored_home;
    editingAwayGoals = match.goals_scored_away;
    editingDate = new Date(match.match_date).toISOString().slice(0, 10);
    editError = '';
    editSuccess = '';
  }

  function cancelEdit() {
    editingMatch = null;
    editingHomeTeam = '';
    editingAwayTeam = '';
    editingHomeGoals = 0;
    editingAwayGoals = 0;
    editingDate = '';
    editError = '';
    editSuccess = '';
  }

  function startDelete(match) {
    deletingMatch = match;
  }

  function cancelDelete() {
    deletingMatch = null;
  }

  async function confirmDelete() {
    if (!deletingMatch) return;
    
    try {
      await matchApi.deleteMatch(deletingMatch.id);
      successMessage = 'Матч успішно видалено!';
      deletingMatch = null;
      await fetchMatchesForView();
    } catch (error) {
      errorMessage = error.message;
      deletingMatch = null;
    }
  }

  async function generateScheduleForSeason() {
    if (!selectedSeasonForPlay) {
      errorMessage = 'Оберіть сезон для генерації розкладу.';
      return;
    }
    
    errorMessage = '';
    successMessage = '';
    
    try {
      const result = await matchApi.generateSchedule(selectedSeasonForPlay);
      successMessage = result.message;
      await fetchMatchesForView();
    } catch (error) {
      errorMessage = error.message;
    }
  }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-bold">Управління матчами</h1>

  {#if errorMessage}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {errorMessage}
    </div>
  {/if}

  {#if successMessage}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      {successMessage}
    </div>
  {/if}

  <!-- Форма запису нового матчу -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Записати новий матч</h2>
    <form on:submit|preventDefault={handlePlayMatch} class="space-y-4">
      <div>
        <label for="playMatchSeason" class="block mb-1 text-gray-700">Оберіть сезон:</label>
        <select id="playMatchSeason" bind:value={selectedSeasonForPlay} on:change={fetchTeamsForPlayMatch} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          {#each seasons as season}
            <option value={season.season_name}>{season.season_name}</option>
          {/each}
        </select>
      </div>

      {#if teams.length > 0}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="homeTeam" class="block mb-1 text-gray-700">Домашня команда:</label>
            <select id="homeTeam" bind:value={homeTeamName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
              <option value="" disabled>Оберіть домашню команду</option>
              {#each teams as team}
                <option value={team.team_name}>{team.team_name}</option>
              {/each}
            </select>
          </div>
          <div>
            <label for="awayTeam" class="block mb-1 text-gray-700">Гостьова команда:</label>
            <select id="awayTeam" bind:value={awayTeamName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
              <option value="" disabled>Оберіть гостьову команду</option>
              {#each teams as team}
                <option value={team.team_name}>{team.team_name}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="goalsHome" class="block mb-1 text-gray-700">Голи (дім):</label>
            <input type="number" id="goalsHome" bind:value={goalsScoredHome} min="0" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
          </div>
          <div>
            <label for="goalsAway" class="block mb-1 text-gray-700">Голи (гості):</label>
            <input type="number" id="goalsAway" bind:value={goalsScoredAway} min="0" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
          </div>
          <div>
            <label for="matchDate" class="block mb-1 text-gray-700">Дата матчу:</label>
            <input type="date" id="matchDate" bind:value={matchDate} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
          </div>
        </div>
        <div class="flex space-x-2">
          <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Записати матч</button>
          <button type="button" on:click={generateScheduleForSeason} class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Згенерувати розклад</button>
        </div>
      {:else if selectedSeasonForPlay}
        <p class="text-gray-600">Команд не знайдено для сезону {selectedSeasonForPlay}. Спочатку додайте команди до цього сезону.</p>
      {:else}
        <p class="text-gray-600">Оберіть сезон для запису матчу.</p>
      {/if}
    </form>
  </div>

  <!-- Розклад матчів -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">📅 Розклад матчів та результати</h2>
    <div class="mb-4">
      <label for="viewMatchSeason" class="block mb-1 text-gray-700">Оберіть сезон для перегляду:</label>
      <select id="viewMatchSeason" bind:value={selectedSeasonForView} on:change={fetchMatchesForView} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
        {#each seasons as season}
          <option value={season.season_name}>{season.season_name}</option>
        {/each}
      </select>
    </div>

    {#if matchesInViewedSeason.length > 0}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Дата</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Команди</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Рахунок</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Статус</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Дії</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each matchesInViewedSeason as match}
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 text-sm">{new Date(match.match_date).toLocaleDateString()}</td>
            <td class="px-4 py-2 text-sm">{match.home_team_name} - {match.away_team_name}</td>
            <td class="px-4 py-2 text-sm font-semibold">{match.goals_scored_home}:{match.goals_scored_away}</td>
            <td class="px-4 py-2 text-sm">
              {#if match.goals_scored_home === 0 && match.goals_scored_away === 0}
                <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">📅 Заплановано</span>
              {:else}
                <span class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">✅ Зіграно</span>
              {/if}
            </td>
            <td class="px-4 py-2 text-sm">
              <button on:click={() => startEdit(match)} class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Редагувати</button>
              <button on:click={() => startDelete(match)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Видалити</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    {:else if selectedSeasonForView}
      <div class="text-center py-8 text-gray-600">
        <p class="text-lg">🗓️ Розклад для сезону "{selectedSeasonForView}" ще не створено</p>
        <p class="mt-2">Натисніть кнопку "Згенерувати розклад" вище щоб створити матчі для всіх команд сезону</p>
      </div>
    {:else}
      <p class="text-gray-600">Оберіть сезон для перегляду розкладу матчів.</p>
    {/if}
  </div>

  <!-- Форма редагування -->
  {#if editingMatch}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Редагувати матч</h2>
    <form class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="editHomeTeam" class="block mb-1 text-gray-700">Домашня команда</label>
          <input id="editHomeTeam" type="text" bind:value={editingHomeTeam} readonly class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
        <div>
          <label for="editAwayTeam" class="block mb-1 text-gray-700">Гостьова команда</label>
          <input id="editAwayTeam" type="text" bind:value={editingAwayTeam} readonly class="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100" />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="editHomeGoals" class="block mb-1 text-gray-700">Голи (дім)</label>
          <input id="editHomeGoals" type="number" bind:value={editingHomeGoals} min="0" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>
        <div>
          <label for="editAwayGoals" class="block mb-1 text-gray-700">Голи (гості)</label>
          <input id="editAwayGoals" type="number" bind:value={editingAwayGoals} min="0" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>
        <div>
          <label for="editDate" class="block mb-1 text-gray-700">Дата матчу</label>
          <input id="editDate" type="date" bind:value={editingDate} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
        </div>
      </div>
      {#if editError}
        <p class="text-red-600">{editError}</p>
      {/if}
      {#if editSuccess}
        <p class="text-green-600">{editSuccess}</p>
      {/if}
      <div class="flex space-x-2">
        <button type="button" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Зберегти</button>
        <button type="button" on:click={cancelEdit} class="bg-gray-300 text-black px-4 py-2 rounded">Скасувати</button>
      </div>
    </form>
  </div>
  {/if}

  <!-- Підтвердження видалення -->
  {#if deletingMatch}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Видалити матч</h2>
    <p>
      Ви впевнені, що хочете видалити матч "{deletingMatch.home_team_name} {deletingMatch.goals_scored_home}:{deletingMatch.goals_scored_away} {deletingMatch.away_team_name}"?
    </p>
    <div class="mt-4 flex space-x-2">
      <button on:click={confirmDelete} class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Так, видалити</button>
      <button on:click={cancelDelete} class="bg-gray-300 text-black px-4 py-2 rounded">Скасувати</button>
    </div>
  </div>
  {/if}
</div>
