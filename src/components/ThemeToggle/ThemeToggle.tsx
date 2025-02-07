import {
  component$,
  useStore,
  $,
  useTask$,
//   useStylesScoped$,
} from "@builder.io/qwik";
import styles from "./NewThemeToggle.module.css"
import { MaterialSymbolsDarkModeOutlineRounded } from "./MaterialSymbolsDarkModeOutlineRounded"
import { MaterialSymbolsSunnyOutlineRounded } from "./MaterialSymbolsSunnyOutlineRounded"

export const ThemeToggle = component$(() => {
  const store = useStore({ theme: "light" });

  useTask$(() => {
    if (typeof localStorage !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      store.theme = storedTheme || (systemPrefersDark ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", store.theme);
    }
  });

  const toggleTheme = $(() => {
    store.theme = store.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", store.theme);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", store.theme);
    }
  });

//   useStylesScoped$(`
//     .theme-toggle {
//       display: flex;
//       align-items: center;
//       cursor: pointer;
//     }
//     .icon {
//       width: 24px;
//       height: 24px;
//     }
//   `);

  return (
    <button id="theme-toggle" onClick$={toggleTheme} class={styles.themeToggle} type="button">  
      {store.theme === "dark" ? (
        // <span class={styles.themeIcon}>☀️</span>
        <MaterialSymbolsSunnyOutlineRounded height={36} width={36} class={styles.themeIcon} />
      ) : (
        // <span class={styles.themeIcon}>🌙</span  >
        <MaterialSymbolsDarkModeOutlineRounded height={36} width={36} class={styles.themeIcon} />
      )}
    </button>
  );
});
