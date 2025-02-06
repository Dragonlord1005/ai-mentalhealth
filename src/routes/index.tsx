import { component$, useStore, $ } from '@builder.io/qwik';
import { useStyles$ } from '@builder.io/qwik';
import styles from './chatbot.css?inline';

export default component$(() => {
  useStyles$(styles);

  return (
    <div class={`chat-container ${store.darkMode ? 'dark-mode' : ''}`}>
      

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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </main>
    </div>
  );
});
