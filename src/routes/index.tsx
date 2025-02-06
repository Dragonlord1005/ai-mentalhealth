import { component$, useStore, $ } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import styles from "./chatbot.css?inline";

export default component$(() => {
  const store = useStore({ darkMode: false });

  const toggleTheme = $(() => {
    store.darkMode = !store.darkMode;
    document.body.classList.toggle("dark-mode", store.darkMode);
  });

  useStyles$(styles);

  return (
    <div class={`chat-container ${store.darkMode ? "dark-mode" : ""}`}>
      <header>
        <div class="logo">
          <h1>Solace</h1>
          <div class="theme-toggle">
            <input
              type="checkbox"
              id="theme-switch"
              class="theme-switch"
              checked={store.darkMode}
              onClick$={toggleTheme}
            />
            <label for="theme-switch" class="theme-switch-label">
              <span class="theme-icon moon">🌙</span>
              <span class="theme-icon sun">☀️</span>
            </label>
          </div>
        </div>
      </header>

      <main class="chat-interface">
        <div class="chat-messages" id="chatMessages">
          {/* Chat messages will be dynamically inserted here */}
        </div>

        <div class="chat-input-area">
          <textarea
            id="userInput"
            placeholder="Type your message..."
            rows={3}
            class="chat-input"
          ></textarea>
          <button id="sendMessage" aria-label="Send Message">
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
