<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';

  // Define the structure of a message
  type Message = {
    role: 'user' | 'assistant';
    content: string;
  };

  // List of messages in the chat
  let messages: Message[] = [];
  // User input for the chat
  let input: string = '';
  // Unique identifier for the user
  let userId: string = uuidv4();

  /**
   * Sends a message to the chat and processes the response from the assistant.
   */
  async function sendMessage(): Promise<void> {
    if (input.trim() === '') return;

    // Add the user's message to the chat
    messages = [...messages, { role: 'user', content: input }];
    const userInput: string = input;
    input = '';

    try {
      const response: Response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, userId }),
      });

      if (!response.body) throw new Error('Response body is null');
      const reader: ReadableStreamDefaultReader = response.body.getReader();
      const decoder: TextDecoder = new TextDecoder();
      let assistantMessage: string = "";
      let assistantMessageIndex: number = messages.length;

      // Add a placeholder for the assistant's message
      messages = [...messages, { role: 'assistant', content: assistantMessage }];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and process each chunk of data
        const chunk: string = decoder.decode(value);
        assistantMessage += chunk;
        messages[assistantMessageIndex].content = assistantMessage;
        messages = [...messages]; // Trigger reactivity
      }
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
