<script>
  import { onMount } from 'svelte';
  import { teamApi, seasonApi } from '$lib/api';

  let allTeams = [];
  let teamsBySelectedSeason = [];
  let seasons = [];
  let selectedSeason = '';
  let errorMessage = '';
  let successMessage = '';

  let addTeamName = '';
  let addTeamSeason = '';

  let editingTeam = null;
  let editingName = '';
  let editingSeason = '';
  let editError = '';
  let editSuccess = '';

  let deletingTeam = null;
  let deleteFromSeason = false;

  onMount(async () => {
    await fetchAllTeams();
    await fetchSeasonsForSelect();
  });

  async function fetchAllTeams() {
    errorMessage = '';
    try {
      allTeams = await teamApi.getAllWithSeasons();
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function fetchSeasonsForSelect() {
    errorMessage = '';
    try {
      seasons = await seasonApi.getAll();
      if (seasons.length > 0) {
        selectedSeason = seasons[0].season_name;
        await fetchTeamsBySeason();
      }
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function fetchTeamsBySeason() {
    errorMessage = '';
    if (!selectedSeason) return;
    try {
      teamsBySelectedSeason = await teamApi.getBySeason(selectedSeason);
    } catch (error) {
      errorMessage = error.message;
    }
  }

  async function handleAddTeam() {
    errorMessage = '';
    successMessage = '';
    if (!addTeamName || !addTeamSeason) {
      errorMessage = 'Будь ласка, заповніть всі поля.';
      return;
    }
    try {
      await teamApi.add(addTeamName, addTeamSeason);
      addTeamName = '';
      addTeamSeason = '';
      successMessage = 'Команду успішно додано!';
      await fetchAllTeams();
      await fetchTeamsBySeason();
    } catch (error) {
      errorMessage = error.message;
    }
  }

  function startEdit(team) {
    editingTeam = { ...team };
    editingName = team.team_name;
    editingSeason = team.seasons && team.seasons.length > 0 ? team.seasons[0] : '';
    editError = '';
    editSuccess = '';
  }

  async function saveEdit() {
    editError = '';
    editSuccess = '';
    if (!editingName || !editingSeason) {
      editError = 'Будь ласка, заповніть всі поля.';
      return;
    }
    try {
      await teamApi.update(editingTeam.team_name, editingSeason, 'team_name', editingName);
      editSuccess = 'Зміни успішно збережено.';
      editingTeam = null;
      await fetchAllTeams();
      await fetchTeamsBySeason();
    } catch (error) {
      editError = error.message;
    }
  }

  function cancelEdit() {
    editingTeam = null;
    editingName = '';
    editingSeason = '';
    editError = '';
    editSuccess = '';
  }

  function startDelete(team, fromSeasonOnly = false) {
    deletingTeam = team;
    deleteFromSeason = fromSeasonOnly;
  }

  async function confirmDelete() {
    try {
      if (deleteFromSeason) {
        await teamApi.deleteFromSeason(deletingTeam.team_name, selectedSeason);
      } else {
        await teamApi.delete(deletingTeam.team_name);
      }
      deletingTeam = null;
      deleteFromSeason = false;
      await fetchAllTeams();
      await fetchTeamsBySeason();
    } catch (error) {
      errorMessage = error.message;
    }
  }

  function cancelDelete() {
    deletingTeam = null;
    deleteFromSeason = false;
  }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-bold">Управління командами</h1>

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

  <!-- Форма додавання команди -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Додати команду</h2>
    <form on:submit|preventDefault={handleAddTeam} class="space-y-4">
      <div>
        <label for="addTeamName" class="block mb-1 text-gray-700">Назва команди</label>
        <input id="addTeamName" type="text" bind:value={addTeamName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>
      <div>
        <label for="addTeamSeason" class="block mb-1 text-gray-700">Сезон</label>
        <select id="addTeamSeason" bind:value={addTeamSeason} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <option value="" disabled>Оберіть сезон</option>
          {#each seasons as season}
            <option value={season.season_name}>{season.season_name} ({season.season_year})</option>
          {/each}
        </select>
      </div>
      <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Додати команду</button>
    </form>
  </div>

  <!-- Команди за сезоном -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Команди за сезоном</h2>
    <div class="mb-4">
      <label for="selectSeason" class="block mb-1 text-gray-700">Оберіть сезон:</label>
      <select id="selectSeason" bind:value={selectedSeason} on:change={fetchTeamsBySeason} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
        {#each seasons as season}
          <option value={season.season_name}>{season.season_name}</option>
        {/each}
      </select>
    </div>
    
    {#if teamsBySelectedSeason.length > 0}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Назва команди</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Дії</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each teamsBySelectedSeason as team (team.team_name)}
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 text-sm">{team.team_name}</td>
            <td class="px-4 py-2 text-sm">
              <button on:click={() => startEdit(team)} class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Редагувати</button>
              <button on:click={() => startDelete(team, true)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Видалити з сезону</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    {:else if selectedSeason}
      <p class="text-gray-600">Команд не знайдено для сезону {selectedSeason}.</p>
    {:else}
      <p class="text-gray-600">Оберіть сезон.</p>
    {/if}
  </div>

  <!-- Всі команди з сезонами -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Всі команди</h2>
    {#if allTeams.length > 0}
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Назва команди</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Сезони</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Дії</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each allTeams as team (team.team_name)}
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 text-sm">{team.team_name}</td>
            <td class="px-4 py-2 text-sm">{team.seasons ? team.seasons.join(', ') : 'Н/Д'}</td>
            <td class="px-4 py-2 text-sm">
              <button on:click={() => startEdit(team)} class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Редагувати</button>
              <button on:click={() => startDelete(team, false)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Видалити повністю</button>
            </td>
          </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="text-gray-600">Команд не знайдено.</p>
    {/if}
  </div>

  <!-- Форма редагування -->
  {#if editingTeam}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Редагувати команду</h2>
    <form on:submit|preventDefault={saveEdit} class="space-y-4">
      <div>
        <label for="editName" class="block mb-1 text-gray-700">Назва команди</label>
        <input id="editName" type="text" bind:value={editingName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>
      <div>
        <label for="editSeason" class="block mb-1 text-gray-700">Сезон (контекст)</label>
        <select id="editSeason" bind:value={editingSeason} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
          <option value="" disabled>Оберіть сезон</option>
          {#each seasons as season}
            <option value={season.season_name}>{season.season_name} ({season.season_year})</option>
          {/each}
        </select>
      </div>
      {#if editError}
        <p class="text-red-600">{editError}</p>
      {/if}
      {#if editSuccess}
        <p class="text-green-600">{editSuccess}</p>
      {/if}
      <div class="flex space-x-2">
        <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Зберегти</button>
        <button type="button" on:click={cancelEdit} class="bg-gray-300 text-black px-4 py-2 rounded">Скасувати</button>
      </div>
    </form>
  </div>
  {/if}

  <!-- Підтвердження видалення -->
  {#if deletingTeam}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">
      {deleteFromSeason ? 'Видалити команду з сезону' : 'Видалити команду повністю'}
    </h2>
    <p>
      Ви впевнені, що хочете 
      {deleteFromSeason ? `видалити команду "${deletingTeam.team_name}" з сезону "${selectedSeason}"?` : `повністю видалити команду "${deletingTeam.team_name}" з усіх сезонів?`}
    </p>
    <div class="mt-4 flex space-x-2">
      <button on:click={confirmDelete} class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Так, видалити</button>
      <button on:click={cancelDelete} class="bg-gray-300 text-black px-4 py-2 rounded">Скасувати</button>
    </div>
  </div>
  {/if}
</div>
