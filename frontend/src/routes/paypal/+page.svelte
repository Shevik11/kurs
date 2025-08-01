<!-- src/routes/paypal/+page.svelte -->
<script>
  import { paypalApi } from '$lib/api';

  let message = '';
  let errorMessage = '';

  async function handleCreatePayment() {
    errorMessage = '';
    message = 'Redirecting to PayPal...';
    try {
  
      await paypalApi.createPayment();
    } catch (error) {
      errorMessage = error.message;
      message = ''; // Clear redirecting message
    }
  }
</script>

<h1>Premium Features</h1>
<p>Unlock premium features by making a one-time payment of $5.00 via PayPal.</p>

{#if message}
  <p>{message}</p>
{/if}

{#if errorMessage}
  <p class="error">{errorMessage}</p>
{/if}

<button on:click={handleCreatePayment}>Pay with PayPal</button>
