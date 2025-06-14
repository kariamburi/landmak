import OpenAI from "openai";
// Initialize OpenAI client

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Uses OpenAI to parse a human input string into a structured filter object.
 */
export async function aiParseFilters(humanInput: string): Promise<Record<string, any>> {
  const systemPrompt = `
You are a parser that converts user search queries into a JSON object of filters.
Fields available:
- query: property type or subcategory (e.g. "maisonette", "studio apartment")
- transaction: "rent" or "sale"
- price: string in format min-max (numbers only)
- bedrooms: integer number of bedrooms
- features: array of keywords (e.g. ["tarmac"])
- amenities: array of keywords (e.g. ["wifi", "pool"])
- facilities: array of keywords (e.g. ["gym", "parking"])
- address: area or region name
Return only valid JSON.`;
  const userPrompt = humanInput;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt.trim() },
      { role: "user", content: userPrompt }
    ],
    temperature: 0,
    max_tokens: 200
  });

  try {
    const text = completion.choices[0].message?.content || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("AI parse error", e);
    return {};
  }
}