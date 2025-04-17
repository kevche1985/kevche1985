import OpenAI from "openai"

// Create a singleton instance of the OpenAI client
let openaiInstance: OpenAI | null = null

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      console.error("OpenAI API key is not set in environment variables")
      throw new Error("OpenAI API key is not set in environment variables")
    }

    console.log("Initializing OpenAI client with API key")

    // Initialize the OpenAI client with the API key
    openaiInstance = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Allow browser-like environments
    })

    console.log("OpenAI client initialized successfully")
  }

  return openaiInstance
}
