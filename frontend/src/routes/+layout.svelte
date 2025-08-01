<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css'; // Global CSS with Tailwind directives
</script>

<nav class="sticky top-0 z-50 bg-gradient-to-r from-emerald-800 to-teal-600 text-white shadow-lg rounded-b-lg">
  <div class="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 gap-8" style="gap: 5rem;">
    <div class="flex text-lg font-medium" style="gap: 2rem;">
      <a href="/" class="hover:text-emerald-200 transition">Home</a>
      <a href="/seasons" class="hover:text-emerald-200 transition">Seasons</a>
      <a href="/teams" class="hover:text-emerald-200 transition">Teams</a>
      <a href="/matches" class="hover:text-emerald-200 transition" title="Розклад та результати матчів">Schedule</a>
      <a href="/table" class="hover:text-emerald-200 transition" title="Турнірна таблиця">Table</a>
      <a href="/paypal" class="hover:text-emerald-200 transition">Premium</a>
    </div>
  </div>
</nav>

<main class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex flex-col items-center justify-start py-10 px-2">
  <slot />
</main>

<style>
  nav {
    display: flex;
    padding: 1rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ddd;
  }
  nav a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  nav a:hover {
    color: #007bff;
  }
  main {
    padding: 2rem;
  }
  :global(button) {
    padding: 0.5rem 1rem;
    background-color: #10b981; /* emerald-500 */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
  }
  :global(button:hover) {
    background-color: #059669; /* emerald-600 */
  }
  :global(input[type="text"], input[type="number"], input[type="date"], select) {
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }
  :global(.form-group) {
    margin-bottom: 1rem;
  }
  :global(label) {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  :global(.error) {
    color: red;
    margin-top: 0.5rem;
  }
  :global(ul) {
    list-style: none;
    padding: 0;
  }
  :global(li) {
    background-color: #f9f9f9;
    margin-bottom: 0.5rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
  }
</style> 