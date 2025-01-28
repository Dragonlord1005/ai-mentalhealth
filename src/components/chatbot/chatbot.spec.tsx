import { createDOM } from "@builder.io/qwik/testing";
import { describe, it, expect } from "vitest";
import { ChatBot } from "./chatbot";

// TODO: Make a mock implementation that could allow us to mock the chatbot api calls
// TODO: Add Github Actions to run the tests on every pull request

describe("ChatBot Component", () => {
  it("should render ChatBot component", async () => {
    const { screen, render } = await createDOM();
    await render(<ChatBot />);
    const chatBot = screen.querySelector("ChatBot");
    expect(chatBot).not.toBeNull();
  });

  it("should render buttons", async () => {
    const { screen, render } = await createDOM();
    await render(<ChatBot />);
    const buttons = screen.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("Should be able to click the buttons", async () => {
    const { screen, render, userEvent } = await createDOM();
    await render(<ChatBot />);
    const buttons = screen.querySelectorAll("button");
    const button = buttons[0];
    await userEvent(button, "click");
  });
}, 
); // Increase timeout for the entire suite to 20 seconds



