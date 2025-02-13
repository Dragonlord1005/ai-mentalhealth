import { component$ } from "@builder.io/qwik";
import styles from "./Navbar.module.css";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export const Navbar = component$(() => {
  return (
    <header>
      <div class={styles.logo}>
        <h1>Solace</h1>
        <ThemeToggle />
      </div>
    </header>
  );
});
