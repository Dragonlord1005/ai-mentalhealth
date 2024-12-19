import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ChatBot } from "~/components/chatbot/chatbot";

export default component$(() => {
  return (
    <>
      <div>
        Welcome to the protoype of ACESO ai!
        <br/>
        Currently the model hasn't been trained, so it's a blank slate. Feel free to ask it anything!
      </div>
      <ChatBot />
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to ACESO ai",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
