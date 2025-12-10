import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function analyzeIntent(message) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Extract intent and entities from the user's message. Respond ONLY with JSON. " +
          "Intents: search_product, search_category, order_status, order_id_lookup, greeting, unknown."
      },
      { role: "user", content: message }
    ]
  });

  return JSON.parse(response.choices[0].message.content);
}
