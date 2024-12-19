import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatBot } from "~/components/chatbot/chatbot";
import { ThemeToggle } from "~/components/ThemeToggle";

export default component$(() => {
  return (
    <>
      <ThemeToggle />
      <div>
        Welcome to the protoype of EVE ai!
        <br/>
        Currently the model hasn't been trained, so it's a blank slate. Feel free to ask it anything!
      </div>
      <ChatBot />
    </>
  );
});

export const head: DocumentHead = {
  title: "EVE ai",
  meta: [
    {
      name: "description",
      content: "The prototype of EVE ai, a mental health LLM designed to assist people living with mental health conditions.",
    },
  ],
};
