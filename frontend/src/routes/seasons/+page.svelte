<script>
    import { onMount } from 'svelte';
    import { seasonApi } from '$lib/api';

    let seasons = [];

    let newName = '';
    let newYear = '';
    let createError = '';
    let createSuccess = '';

    let editingSeason = null;
    let editingName = '';
    let editingYear = '';
    let editError = '';
    let editSuccess = '';

    let deletingSeason = null;

    onMount(async () => {
        await fetchSeasons();
    });

    async function fetchSeasons() {
        try {
            console.log('Fetching seasons...');
            seasons = await seasonApi.getAll();
            console.log('Seasons loaded:', seasons);
            createError = '';
        } catch (error) {
            console.error('Error fetching seasons:', error);
            createError = `Помилка завантаження: ${error.message}`;
            seasons = [];
        }
    }

    async function addSeason() {
        createError = '';
        createSuccess = '';
        if (!newName || !newYear) {
            createError = 'Будь ласка, заповніть всі поля.';
            return;
        }
        

        const duplicate = seasons.find(s => 
            s.season_name.toLowerCase() === newName.toLowerCase() && 
            s.season_year === newYear
        );
        if (duplicate) {
            createError = `Сезон "${newName}" ${newYear} вже існує!`;
            return;
        }
        
        try {
            console.log(`Creating season: ${newName}, ${newYear}`);
            await seasonApi.create(newName, newYear);
            createSuccess = 'Сезон успішно створено!';
            newName = '';
            newYear = '';
            await fetchSeasons();
        } catch (error) {
            console.error('Error creating season:', error);
            createError = error.message;
        }
    }

    function startEdit(season) {
        editingSeason = { ...season };
        editingName = season.season_name;
        editingYear = season.season_year;
        editError = '';
        editSuccess = '';
    }

    async function saveEdit() {
        editError = '';
        editSuccess = '';
        if (!editingName || !editingYear) {
            editError = 'Будь ласка, заповніть всі поля.';
            return;
        }
        

        if (editingName !== editingSeason.season_name || editingYear !== editingSeason.season_year) {
            const duplicate = seasons.find(s => 
                s.season_name.toLowerCase() === editingName.toLowerCase() && 
                s.season_year === editingYear
            );
            if (duplicate) {
                editError = `Сезон "${editingName}" ${editingYear} вже існує!`;
                return;
            }
        }
        
        try {
            await seasonApi.update(
                editingSeason.season_name,
                editingSeason.season_year,
                editingName,
                editingYear
            );
            editSuccess = 'Зміни успішно збережено.';
            editingSeason = null;
            await fetchSeasons();
        } catch (error) {
            editError = error.message;
        }
    }

    function cancelEdit() {
        editingSeason = null;
        editingName = '';
        editingYear = '';
        editError = '';
        editSuccess = '';
    }

    function startDelete(season) {
        deletingSeason = season;
    }

    async function confirmDelete() {
        try {
            await seasonApi.delete(deletingSeason.season_name, deletingSeason.season_year);
            deletingSeason = null;
            await fetchSeasons();
        } catch (error) {
            createError = error.message;
            deletingSeason = null;
        }
    }

    function cancelDelete() {
        deletingSeason = null;
    }
</script>

<div class="max-w-3xl mx-auto p-6 space-y-6">
  <h1 class="text-2xl font-bold">Управління сезонами</h1>

  <!-- Форма створення -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Додати сезон</h2>
    <form on:submit|preventDefault={addSeason} class="space-y-4">
      <div>
        <label for="newName" class="block mb-1 text-gray-700">Назва сезону</label>
                 <input id="newName" type="text" bind:value={newName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>
      <div>
        <label for="newYear" class="block mb-1 text-gray-700">Рік</label>
                 <input id="newYear" type="number" bind:value={newYear} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>
      {#if createError}
        <p class="text-red-600">{createError}</p>
      {/if}
      {#if createSuccess}
        <p class="text-green-600">{createSuccess}</p>
      {/if}
             <button type="submit" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">Створити</button>
    </form>
  </div>

  <!-- Таблиця сезонів -->
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Список сезонів</h2>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Назва сезону</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Рік</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 uppercase">Дії</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        {#each seasons as season (`${season.season_name}-${season.season_year}`)}
        <tr class="hover:bg-gray-50">
          <td class="px-4 py-2 text-sm">{season.season_name}</td>
          <td class="px-4 py-2 text-sm">{season.season_year}</td>
          <td class="px-4 py-2 text-sm">
            <button on:click={() => startEdit(season)} class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded mr-2">Редагувати</button>
            <button on:click={() => startDelete(season)} class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Видалити</button>
          </td>
        </tr>
        {:else}
        <tr>
          <td colspan="3" class="px-4 py-8 text-center text-gray-500">
            {#if createError}
              Не вдалося завантажити сезони
            {:else}
              Сезонів ще немає. Додайте перший!
            {/if}
          </td>
        </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Форма редагування -->
  {#if editingSeason}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Редагувати сезон</h2>
    <form on:submit|preventDefault={saveEdit} class="space-y-4">
      <div>
        <label for="editName" class="block mb-1 text-gray-700">Назва сезону</label>
                 <input id="editName" type="text" bind:value={editingName} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
      </div>
      <div>
        <label for="editYear" class="block mb-1 text-gray-700">Рік</label>
                 <input id="editYear" type="number" bind:value={editingYear} class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
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
  {#if deletingSeason}
  <div class="bg-white p-6 rounded shadow">
    <h2 class="text-xl font-semibold mb-4">Видалити сезон</h2>
    <p>Ви впевнені, що хочете видалити сезон "{deletingSeason.season_name}"?</p>
    <div class="mt-4 flex space-x-2">
      <button on:click={confirmDelete} class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Так, видалити</button>
      <button on:click={cancelDelete} class="bg-gray-300 text-black px-4 py-2 rounded">Скасувати</button>
    </div>
  </div>
  {/if}
</div>
