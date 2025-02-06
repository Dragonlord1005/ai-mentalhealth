import {
  component$,
  useStore,
  $,
  useTask$,
  useStylesScoped$,
} from "@builder.io/qwik";
// import { MdiMoonFull } from "./MoonFull";
// import { MdiWeatherSunny } from "./Sun";
import styles from "./ThemeToggle.module.css"

export const ThemeToggle = component$(() => {
  const store = useStore({ theme: "light", darkMode: false });

  useTask$(() => {
    if (typeof localStorage !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      store.theme = storedTheme || (systemPrefersDark ? "dark" : "light");
      store.darkMode = store.theme === "dark";
      document.documentElement.setAttribute("data-theme", store.theme);
      document.body.classList.toggle("dark-mode", store.darkMode);
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
    // <button onClick$={toggleTheme} class="theme-toggle">
    //   {store.theme === "dark" ? (
    //     <MdiWeatherSunny class="icon" />
    //   ) : (
    //     <MdiMoonFull class="icon" />
    //   )}
    //   Toggle to {store.theme === "dark" ? "light" : "dark"} mode
    // </button>
    <div class="theme-toggle">
      <input
        type="checkbox"
        id="theme-switch"
        class={styles.themeToggle}
        checked={store.darkMode}
        onClick$={toggleTheme}
      />
      <label for="theme-switch" class="theme-switch-label">
        <span class="theme-icon moon">🌙</span>
        <span class="theme-icon sun">☀️</span>
      </label>
    </div>
  );
});
