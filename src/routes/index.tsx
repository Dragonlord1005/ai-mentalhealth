import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatBot } from "~/components/chatbot/chatbot";
import { ThemeToggle } from "~/components/ThemeToggle/ThemeToggle";

export default component$(() => {
  return (
    <>
      <ThemeToggle />
      <div>
        Welcome to the prototype of Solace ai!
        <br />
        Currently the model hasn't been trained, so it's a blank slate. Feel
        free to ask it anything!
      </div>
      <ChatBot />
    </>
  );
});

export const head: DocumentHead = {
  title: "Solace ai",
  meta: [
    {
      name: "description",
      content:
        "The prototype of Solace ai, a mental health LLM designed to assist people living with mental health conditions.",
    },
  ],
};
