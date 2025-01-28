import { createDOM } from '@builder.io/qwik/testing'
import { QwikCityMockProvider } from '@builder.io/qwik-city'
import { test, expect, describe } from 'vitest'
import Index from './index'

describe('Main Page', () => {
  test('should render the main page with correct content', async () => {
    const { screen, render } = await createDOM();
    await render(
      <QwikCityMockProvider>
        <Index />
      </QwikCityMockProvider>
    );

    expect(screen.innerHTML).toContain('Welcome to the prototype of SOLUS ai!');
    expect(screen.innerHTML).toContain('Currently the model hasn\'t been trained, so it\'s a blank slate. Feel free to ask it anything!');
  });

  test('should render ThemeToggle component', async () => {
    const { screen, render } = await createDOM();
    await render(
      <QwikCityMockProvider>
        <Index />
      </QwikCityMockProvider>
    );

    const themeToggle = screen.querySelector('ThemeToggle');
    expect(themeToggle).not.toBeNull();
  });

  test('should render ChatBot component', async () => {
    const { screen, render } = await createDOM();
    await render(
      <QwikCityMockProvider>
        <Index />
      </QwikCityMockProvider>
    );

    const chatBot = screen.querySelector('ChatBot');
    expect(chatBot).not.toBeNull();
  });
});