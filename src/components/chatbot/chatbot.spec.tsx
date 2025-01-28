import { createDOM } from "@builder.io/qwik/testing";
import { describe, it, expect, vi } from "vitest";
import { ChatBot } from "./chatbot";

// Should make sure the ChatBot component is rendered
// Should also make sure buttons exist
// Needto keep in mind that the buttons won't actually work so we need to fiure out how to avoid that breaking it

describe("ChatBot Component", () => {
  it("should render ChatBot component", async () => {
    const { screen, render } = await createDOM();
    await render(<ChatBot />);
    const chatBot = screen.querySelector("ChatBot");
    expect(chatBot).not.toBeNull();
  });
});

