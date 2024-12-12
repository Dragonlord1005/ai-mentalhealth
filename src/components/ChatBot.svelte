<script>
  import { v4 as uuidv4 } from 'uuid';

  let messages = [];
  let input = '';
  let userId = uuidv4();

  // Store userId in localStorage
//   localStorage.setItem('userId', userId);

  async function sendMessage() {
    if (input.trim() === '') return;

    messages = [...messages, { role: 'user', content: input }];
    const userInput = input;
    input = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, userId }),
      });
      const data = await response.json();
      messages = [...messages, { role: 'assistant', content: data.response }];
    } catch (error) {
      console.error('Error:', error);
    }
  }
</script>

<div class="chat-window">
  {#each messages as message}
    <div class="message">
      <strong>{message.role}:</strong> {message.content}
    </div>
  {/each}
</div>

<input
  bind:value={input}
  on:keypress={(e) => e.key === 'Enter' && sendMessage()}
  placeholder="Type your message..."
/>
<button on:click={sendMessage}>Send</button>

<style>
  .chat-window {
    height: 300px;
    overflow-y: scroll;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  .message {
    margin-bottom: 10px;
  }
  input {
    margin-right: 10px;
  }
</style>
