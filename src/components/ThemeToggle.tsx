import { component$, useStore, $, useTask$, useStylesScoped$ } from "@builder.io/qwik";
import MdiMoonFull from '~icons/mdi/moon-full';
import MdiWhiteBalanceSunny from '~icons/mdi/white-balance-sunny';

export const ThemeToggle = component$(() => {
  const store = useStore({ theme: 'light' });

  useTask$(() => {
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      store.theme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', store.theme);
    }
  });

  const toggleTheme = $(() => {
    store.theme = store.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', store.theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', store.theme);
    }
  });

  useStylesScoped$(`
    .theme-toggle {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .icon {
      width: 24px;
      height: 24px;
    }
  `);

  return (
    <button onClick$={toggleTheme} class="theme-toggle">
      {store.theme === 'dark' ? <MdiWhiteBalanceSunny class="icon" /> : <MdiMoonFull class="icon" />}
      Toggle to {store.theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
});