// Client-side utility for making API calls to our own endpoints
// This avoids direct OpenAI API calls from the client

export async function generateImage(prompt: string, style = "vivid") {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, style }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate image")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating image:", error)
    throw error
  }
}

export async function generateLogo(prompt: string, businessName: string) {
  try {
    const response = await fetch("/api/generate-logo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, businessName }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate logo")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating logo:", error)
    throw error
  }
}

export async function generateFontDescription(prompt: string) {
  try {
    const response = await fetch("/api/generate-font", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to generate font description")
    }

    return await response.json()
  } catch (error) {
    console.error("Error generating font description:", error)
    throw error
  }
}
