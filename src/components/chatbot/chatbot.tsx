import { component$, useStore, useSignal, $, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { v4 as uuidv4 } from "uuid";

// Import your CSS module:
import styles from "./chatbot.module.css";

// --- Example: In-memory chat history store (for demonstration) ---
const chatHistory = new Map();

interface OllamaResponseChunk {
  response?: string;
}

const fetchAssistantResponse = server$(async function* (message: string, userId: string) {
  // Retrieve existing chat for this user or create a new one
  const chatData = chatHistory.get(userId) || { userId, messages: [] };
  chatData.messages.push({ role: "user", content: message });

  // Build the prompt from chat history
  const prompt = chatData.messages
    .map((entry: { role: string; content: string }) => `${entry.role}: ${entry.content}`)
    .join("\n");

  const ollamaApiUrl = "http://10.151.130.18:11434/api/generate";

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

  // Scroll to bottom whenever messages change
  useTask$(({ track }) => {
    track(() => state.messages);
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight;
    }
  });

  // Send user message to the server function
  const sendMessage = $(async () => {
    if (state.input.trim() === "") return;

    // Add user's message to UI
    state.messages = [
      ...state.messages,
      { role: "user", content: state.input },
    ];
    const userInput = state.input;
    state.input = "";

    try {
      // Stream assistant response
      const responseStream = await fetchAssistantResponse(userInput, state.userId);
      let assistantMessage = "";
      const assistantMsgIndex = state.messages.length;
      // Preemptively add assistant entry with empty string
      state.messages = [...state.messages, { role: "assistant", content: "" }];

      for await (const chunk of responseStream) {
        assistantMessage += chunk;
        // Update last message chunk-by-chunk
        state.messages[assistantMsgIndex].content = assistantMessage;
        // Force Qwik re-render
        state.messages = [...state.messages];
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  return (
    <div class={styles.chatContainer}>
      {/* Main chat area */}
      <main class={styles.chatInterface}>
        <div ref={chatWindowRef} class={styles.chatMessages}>
          {state.messages.map((message, index) => (
            <div
              key={index}
              class={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant}`}
            >
              <strong>{message.role}:</strong> {message.content}
            </div>
          ))}
        </div>

        <div class={styles.chatInputArea}>
          <textarea
            id="userInput"
            onInput$={(e) => (state.input = (e.target as HTMLTextAreaElement).value)}
            onKeyPress$={(e) => e.key === "Enter" && sendMessage()}
            value={state.input}
            placeholder="Type your message..."
            rows={2}
          />
          <button id="sendMessage" class={styles.sendButton} onClick$={sendMessage} aria-label="Send Message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
});
