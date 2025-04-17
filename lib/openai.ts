import OpenAI from "openai"

// Create a singleton instance of the OpenAI client
let openaiInstance: OpenAI | null = null

export function openai(modelName: string): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key is missing")
    }

    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    })
  }

  return openaiInstance
}

export async function generateText(options: { model: OpenAI; prompt: string; system: string }) {
  const { model, prompt, system } = options

  try {
    const completion = await model.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      n: 1,
      stop: null,
    })

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("No completion choices were returned from OpenAI.")
    }

    const text = completion.choices[0].message?.content || ""
    return { text }
  } catch (error) {
    console.error("Error generating text:", error)
    throw error
  }
}
