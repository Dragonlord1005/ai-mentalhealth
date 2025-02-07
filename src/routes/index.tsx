import { component$ } from "@builder.io/qwik";
import styles from "./chatbot.module.css";

export default component$(() => {
  return (
    <div class={styles.chatContainer}>
      <main class={styles.chatInterface}>
        <div class={styles.chatMessages} id="chatMessages">
          {/* Chat messages will be dynamically inserted here */}
        </div>

        <div class={styles.chatInputArea}>
          <textarea
            id="userInput"
            placeholder="Type your message..."
            rows={3}
            class={styles.chatInput}
          ></textarea>
          <button id="sendMessage" aria-label="Send Message" class={styles.sendMessageButton}>
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
