<script>
  import { onMount } from 'svelte';
  import { matchApi, seasonApi } from '$lib/api';

  let seasons = [];
  let selectedSeason = '';
  let tournamentTable = [];
  let errorMessage = '';
  let successMessage = '';
  let loading = false;

  onMount(async () => {
    await fetchSeasons();
  });

  async function fetchSeasons() {
    try {
      seasons = await seasonApi.getAll();
      if (seasons.length > 0) {
        selectedSeason = seasons[0].season_name;
        await fetchTournamentTable();
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function fetchTournamentTable() {
    if (!selectedSeason) return;
    loading = true;
    errorMessage = '';
    try {
      tournamentTable = await matchApi.getTournamentTable(selectedSeason);
    } catch (error) {
      errorMessage = error.message;
      tournamentTable = [];
    } finally {
      loading = false;
    }
  }

  async function generateSchedule() {
    if (!selectedSeason) return;
    loading = true;
    errorMessage = '';
    successMessage = '';
    try {
      const result = await matchApi.generateSchedule(selectedSeason);
      successMessage = result.message;
      await fetchTournamentTable(); // Оновлюємо таблицю
    } catch (error) {
      errorMessage = error.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-6xl mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-bold">Турнірна таблиця</h1>

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

  <!-- Вибір сезону та генерація розкладу -->
  <div class="bg-white p-6 rounded shadow">
    <div class="flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-1">
        <label for="seasonSelect" class="block mb-1 text-gray-700">Оберіть сезон:</label>
        <select 
          id="seasonSelect" 
          bind:value={selectedSeason} 
          on:change={fetchTournamentTable}
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {#each seasons as season}
            <option value={season.season_name}>{season.season_name} ({season.season_year})</option>
          {/each}
        </select>
      </div>
      <button 
        on:click={generateSchedule}
        disabled={loading}
        class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
      >
        {loading ? 'Генерація...' : 'Згенерувати розклад'}
      </button>
    </div>
  </div>

  <!-- Турнірна таблиця -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">
      Турнірна таблиця {selectedSeason ? `- ${selectedSeason}` : ''}
    </h2>
    
    {#if loading}
      <div class="text-center py-8">
        <div class="text-gray-600">Завантаження...</div>
      </div>
    {:else if tournamentTable.length > 0}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">#</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Команда</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">І</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">В</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Н</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">П</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">М+</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">М-</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">±</th>
              <th class="px-2 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider font-bold">О</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {#each tournamentTable as team}
            <tr class="hover:bg-gray-50">
              <td class="px-2 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.position}</td>
              <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{team.team_name}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-600">{team.matches_played}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-green-600 font-medium">{team.win_games}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-yellow-600">{team.draw_games}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-red-600">{team.lose_games}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-600">{team.goals_scored}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center text-gray-600">{team.goals_conceded}</td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center font-medium {team.goal_difference >= 0 ? 'text-green-600' : 'text-red-600'}">
                {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
              </td>
              <td class="px-2 py-4 whitespace-nowrap text-sm text-center font-bold text-blue-600">{team.points}</td>
            </tr>
            {/each}
          </tbody>
        </table>
      </div>
      
      <!-- Легенда -->
      <div class="mt-4 text-xs text-gray-600">
        <p><strong>Легенда:</strong> І - Ігри, В - Виграші, Н - Нічиї, П - Поразки, М+ - Голи забиті, М- - Голи пропущені, ± - Різниця голів, О - Очки</p>
      </div>
    {:else}
      <div class="text-center py-8 text-gray-600">
        {#if selectedSeason}
          Дані турнірної таблиці для сезону "{selectedSeason}" відсутні.<br>
          Додайте команди до сезону і згенеруйте розклад.
        {:else}
          Оберіть сезон для перегляду турнірної таблиці.
        {/if}
      </div>
    {/if}
  </div>
</div>