import { component$, useStore, useSignal, $, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { v4 as uuidv4 } from "uuid";
import styles from "./chatbot.module.css";

// Store chat history in a Map
const chatHistory = new Map();

// Define the structure of the response chunk from Ollama API
interface OllamaResponseChunk {
  response?: string;
}

// Function to fetch assistant's response from Ollama API
const fetchAssistantResponse = server$(async function* (message, userId) {
  const chatData = chatHistory.get(userId) || { userId, messages: [] };
  chatData.messages.push({ role: "user", content: message });
  const prompt = chatData.messages.map((entry: { role: string; content: string }) => `${entry.role}: ${entry.content}`).join("\n");

  const ollamaApiUrl = "http://10.151.130.18:11434/api/generate";
  console.log("Sending request to Ollama API with prompt:", prompt);
  const ollamaResponse = await fetch(ollamaApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2", prompt, conversation: chatData.messages }),
  });

  if (!ollamaResponse.body) {
    console.error("No response body from Ollama API");
    throw new Error("No response body from Ollama API");
  }

  const reader = ollamaResponse.body.getReader();
  const decoder = new TextDecoder();
  let assistantMessage = "";

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (!value) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");
    for (const line of lines) {
      try {
        const parsedLine: OllamaResponseChunk = JSON.parse(line);
        if (parsedLine.response) {
          assistantMessage += parsedLine.response;
          yield parsedLine.response;
        }
      } catch (error) {
        console.error("Error parsing JSON line:", error, "Line:", line);
      }
    }
  }

  chatData.messages.push({ role: "assistant", content: assistantMessage });
  chatHistory.set(userId, chatData);
});

export const ChatBot = component$(() => {
  const state = useStore({
    messages: [] as { role: "user" | "assistant"; content: string }[],
    input: "",
    userId: uuidv4(),
    darkMode: false,
  });

  const chatWindowRef = useSignal<HTMLDivElement>();

  const toggleTheme = $(() => {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode", state.darkMode);
  });

  useTask$(({ track }) => {
    track(() => state.messages);
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight;
    }
  });

  const sendMessage = $(async () => {
    if (state.input.trim() === "") return;

    state.messages = [...state.messages, { role: "user", content: state.input }];
    const userInput = state.input;
    state.input = "";

    try {
      const responseStream = await fetchAssistantResponse(userInput, state.userId);
      let assistantMessage = "";
      const assistantMessageIndex = state.messages.length;
      state.messages = [...state.messages, { role: "assistant", content: assistantMessage }];

      for await (const chunk of responseStream) {
        assistantMessage += chunk;
        state.messages[assistantMessageIndex].content = assistantMessage;
        state.messages = [...state.messages];
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  return (
    <div class={`${styles.chatContainer} ${state.darkMode ? styles.darkMode : ''}`}>
      <header>
        <div class={styles.chatContainer}>
          <h1>Solace</h1>
          <div class={styles.themeToggle}>
            <input
              type="checkbox"
              id="themeSwitch"
              class={styles.themeSwitch}
              checked={state.darkMode}
              onClick$={toggleTheme}
            />
            <label for="themeSwitch" class={styles.themeSwitchLabel}>
              <span class={styles.themeIconMoon}>🌙</span>
              <span class={styles.themeIconSun}>☀️</span>
            </label>
          </div>
        </div>
      </header>

      <main class={styles.chatInterface}>
        <div ref={chatWindowRef} class={styles.chatMessages}>
          {state.messages.map((message, index) => (
            <div key={index} class={`${styles.message} ${styles[message.role]}`}>
              <strong>{message.role}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div class={styles.chatInputArea}>
          <textarea
            value={state.input}
            onInput$={(e) => (state.input = (e.target as HTMLTextAreaElement).value)}
            onKeyPress$={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            rows={3}
            class={styles.chatInput}
          ></textarea>
          <button onClick$={sendMessage} aria-label="Send Message">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
});
