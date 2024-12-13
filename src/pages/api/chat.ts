export const prerender = false;

// In-memory storage for chat history
const chatHistory = new Map<string, { userId: string; messages: { role: string; content: string }[] }>();

export async function POST({ request }) {
  const body = await request.json();
  const { message, userId } = body;

  if (!userId || !message) {
    return new Response(JSON.stringify({ error: "userId and message are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Fetch or create chat history for the user
    let chatData = chatHistory.get(userId) || { userId, messages: [] };

    // Add the user's message to the conversation history
    chatData.messages.push({ role: 'user', content: message });

    // Construct the prompt from the conversation history
    const prompt = chatData.messages.map(entry => `${entry.role}: ${entry.content}`).join("\n");

    // Call Ollama API with streaming response
    // !FIXME: Make so we use an environment variable
    const ollamaResponse = await fetch('http://10.151.130.18:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        prompt: prompt,
      }),
    });

    if (!ollamaResponse.body) {
      throw new Error("No response body from Ollama API");
    }

    // Parse the streaming response
    const reader = ollamaResponse.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode and process each chunk of data
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
        try {
          const parsedLine = JSON.parse(line);
          if (parsedLine.response) {
            assistantMessage += parsedLine.response;
          }
        } catch (error) {
          console.error("Error parsing JSON line:", error, "Line:", line);
        }
      }
    }

    // Add the assistant's response to the conversation history
    chatData.messages.push({ role: 'assistant', content: assistantMessage });
    chatHistory.set(userId, chatData);

    return new Response(JSON.stringify({ response: assistantMessage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || "An error occurred while processing your request" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
