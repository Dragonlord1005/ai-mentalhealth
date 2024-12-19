import { component$, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { server$ } from '@builder.io/qwik-city';
import { v4 as uuidv4 } from 'uuid';

const chatHistory = new Map<string, { userId: string; messages: { role: string; content: string }[] }>();

interface OllamaResponseChunk {
  response?: string;
}

const fetchAssistantResponse = server$(async (message: string, userId: string) => {
  const chatData = chatHistory.get(userId) || { userId, messages: [] };
  chatData.messages.push({ role: 'user', content: message });
  const prompt = chatData.messages.map(entry => `${entry.role}: ${entry.content}`).join("\n");

  const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://10.151.130.18:11434/api/generate';
  const ollamaResponse = await fetch(ollamaApiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.2',
      prompt,
      conversation: chatData.messages
    }),
  });

  if (!ollamaResponse.body) {
    throw new Error("No response body from Ollama API");
  }

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = ollamaResponse.body.getReader();
  const decoder = new TextDecoder();
  let assistantMessage = "";

  (async () => {
    const done = false;
    while (!done) {
      const { value } = await reader.read();
      if (!value) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");
      for (const line of lines) {
        try {
          const parsedLine: OllamaResponseChunk = JSON.parse(line);
          if (parsedLine.response) {
            assistantMessage += parsedLine.response;
            writer.write(new TextEncoder().encode(parsedLine.response));
          }
        } catch (error) {
          console.error("Error parsing JSON line:", error, "Line:", line);
        }
      }
    }
    writer.close();
  })();

  chatData.messages.push({ role: 'assistant', content: assistantMessage });
  chatHistory.set(userId, chatData);

  return readable;
});

export const ChatBot = component$(() => {
  useStylesScoped$(`
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
  `);

  const state = useStore({
    messages: [] as { role: 'user' | 'assistant'; content: string }[],
    input: '',
    userId: uuidv4(),
  });


  const sendMessage = server$(async () => {
    if (state.input.trim() === '') return;

    state.messages = [...state.messages, { role: 'user', content: state.input }];
    const userInput = state.input;
    state.input = '';

    try {
      const responseStream = await fetchAssistantResponse(userInput, state.userId);

      const reader = responseStream.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantMessageIndex = state.messages.length;

      // Add a placeholder for the assistant's message
      state.messages = [...state.messages, { role: 'assistant', content: assistantMessage }];

      const done = false;
      while (!done) {
        const { value } = await reader.read();
        if (!value) break;

        // Decode and process each chunk of data
        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        state.messages[assistantMessageIndex].content = assistantMessage;
        state.messages = [...state.messages]; // Trigger reactivity
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });

  return (
    <div>
      <div class="chat-window">
        {state.messages.map((message, index) => (
          <div key={index} class="message">
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <input
        value={state.input}
        onInput$={(e) => (state.input = (e.target as HTMLInputElement).value)}
        onKeyPress$={(e) => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
      />
      <button onClick$={() => sendMessage()}>Send</button>
    </div>
  );
});