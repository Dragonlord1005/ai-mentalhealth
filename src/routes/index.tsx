import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatBot } from "~/components/chatbot/chatbot";

export default component$(() => {
  return (
    <>
      <div>
        Welcome to the prototype of EVE ai!
        <br />
        Currently the model hasn't been trained, so it's a blank slate. Feel
        free to ask it anything!
      </div>
      <ChatBot />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to EVE ai",
  meta: [
    {
      name: "description",
      content:
        "The prototype of EVE ai, a mental health LLM designed to assist people living with mental health conditions.",
    },
  ],
};
