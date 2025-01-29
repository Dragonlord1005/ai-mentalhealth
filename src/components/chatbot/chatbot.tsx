import { component$, useStore, useSignal, $, useTask$ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { v4 as uuidv4 } from "uuid";
import styles from "./chatbot.module.css";

// Store chat history in a Map
const chatHistory = new Map<
  string,
  { userId: string; messages: { role: string; content: string }[] }
>();

// Define the structure of the response chunk from Ollama API
interface OllamaResponseChunk {
  response?: string;
}

// Function to fetch the assistant's response from the Ollama API using server$ streaming
const fetchAssistantResponse = server$(async function* (
  message: string,
  userId: string,
) {
  // Retrieve or initialize chat data for the user
  const chatData = chatHistory.get(userId) || { userId, messages: [] };
  chatData.messages.push({ role: "user", content: message });
  const prompt = chatData.messages
    .map((entry) => `${entry.role}: ${entry.content}`)
    .join("\n");

  // Fetch response from Ollama API
  const ollamaApiUrl = "http://10.151.130.18:11434/api/generate";
  console.log("Sending request to Ollama API with prompt:", prompt);
  const ollamaResponse = await fetch(ollamaApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3.2",
      prompt,
      conversation: chatData.messages,
    }),
  });

  if (!ollamaResponse.body) {
    console.error("No response body from Ollama API");
    throw new Error("No response body from Ollama API");
  }

  console.log("Received response from Ollama API");
  const reader = ollamaResponse.body.getReader();
  const decoder = new TextDecoder();
  let assistantMessage = "";

  // Process the response stream
  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (!value) break;

    const chunk = decoder.decode(value);
    console.log("Received chunk:", chunk);
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

  // Update chat history with the assistant's response
  chatData.messages.push({ role: "assistant", content: assistantMessage });
  chatHistory.set(userId, chatData);

  console.log("Assistant message:", assistantMessage);
});

// Define the ChatBot component
export const ChatBot = component$(() => {
  // Initialize component state
  const state = useStore({
    messages: [] as { role: "user" | "assistant"; content: string }[],
    input: "",
    userId: uuidv4(),
  });

  const chatWindowRef = useSignal<HTMLDivElement>();

  useTask$(({ track }) => {
    track(() => state.messages);
    if (chatWindowRef.value) {
      chatWindowRef.value.scrollTop = chatWindowRef.value.scrollHeight;
    }
  });

  // Function to send a message
  const sendMessage = $(async () => {
    if (state.input.trim() === "") return;

    // Add user's message to the state
    state.messages = [
      ...state.messages,
      { role: "user", content: state.input },
    ];
    const userInput = state.input;
    state.input = "";

    try {
      // Fetch assistant's response
      const responseStream = await fetchAssistantResponse(
        userInput,
        state.userId,
      );
      let assistantMessage = "";
      const assistantMessageIndex = state.messages.length;

      // Add a placeholder for the assistant's message
      state.messages = [
        ...state.messages,
        { role: "assistant", content: assistantMessage },
      ];

      // Process the response stream
      for await (const chunk of responseStream) {
        console.log("Received chunk in client:", chunk);
        assistantMessage += chunk;
        state.messages[assistantMessageIndex].content = assistantMessage;
        state.messages = [...state.messages]; // Trigger reactivity
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Render the chat interface
  return (
    <div>
      <div ref={chatWindowRef} class={styles.chatWindow}>
        {state.messages.map((message, index) => (
          <div key={index} class={styles.message}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>

      <input
        value={state.input}
        onInput$={(e) => (state.input = (e.target as HTMLInputElement).value)}
        onKeyPress$={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type your message..."
        type="text"
      />
      <button onClick$={() => sendMessage()}>Send</button>
    </div>
  );
});
