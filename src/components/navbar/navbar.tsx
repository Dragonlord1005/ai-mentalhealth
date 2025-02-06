import { component$ } from "@builder.io/qwik";
import { useStore } from "@builder.io/qwik";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

export const Navbar = component$(() => {
    return (
        <header>
            <div class="logo">
            <h1>Solace</h1>
            <ThemeToggle />

            </div>
        </header>
    )
    
})