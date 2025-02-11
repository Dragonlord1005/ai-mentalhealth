import {
  component$,
  useStore,
  $,
  useTask$,
} from "@builder.io/qwik";
// import { MdiMoonFull } from "./MoonFull";
// import { MdiWeatherSunny } from "./Sun";
import styles from "./ThemeToggle.module.css"

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

  return (
    <button onClick$={toggleTheme} class={styles.themeToggle}>
      {store.theme === "dark" ? (
        // <MdiWeatherSunny class="icon" />
        <span class={styles.themeIconSun}>☀️</span>
      ) : (
        // <MdiMoonFull class="icon" />
        <span class={styles.themeIconMoon}>🌙</span>
      )}
      {/* Toggle to {store.theme === "dark" ? "light" : "dark"} mode */}
    </button>
  );
});
