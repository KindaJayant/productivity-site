export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callAgent(messages: Message[], systemPrompt?: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not defined in environment variables.");
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
      },
      body: JSON.stringify({
        // We can let the user pick the model, defaulting to a solid free one.
        model: "huggingfaceh4/zephyr-7b-beta:free",
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      throw new Error(`OpenRouter API call failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Agent call failed:", error);
    throw error;
  }
}
