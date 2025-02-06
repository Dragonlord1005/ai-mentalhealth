import { component$, useStore, $ } from '@builder.io/qwik';
import { useStyles$ } from '@builder.io/qwik';
import styles from './chatbot.css?inline';
import { ChatBot } from '~/components/chatbot/chatbot';

export default component$(() => {
  const store = useStore({ darkMode: false });

  const toggleTheme = $(() => {
    store.darkMode = !store.darkMode;
    document.body.classList.toggle('dark-mode', store.darkMode);
  });

  useStyles$(styles);

  return (
    <div class={`chat-container ${store.darkMode ? 'dark-mode' : ''}`}>
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
      <ChatBot />

    
    </div>
  );
});
