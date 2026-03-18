export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callAgent(messages: Message[], systemPrompt?: string): Promise<{ content?: string; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return { error: "OPENROUTER_API_KEY is not defined in environment variables." };
  }

  // If a system prompt is provided, prepend it to the messages
  const apiMessages = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", 
        "X-Title": "Brutally Honest Productivity OS",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini", // Default to a very capable model, configurable via .env
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return { error: `OpenRouter API call failed with status ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { content: data.choices?.[0]?.message?.content || "" };
  } catch (error: any) {
    console.error("Agent call failed:", error);
    return { error: error?.message || "Failed to reach OpenRouter API" };
  }
}
