import { createOpenAI } from "@ai-sdk/openai"

// Create OpenRouter client for DeepSeek model
export const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.SITE_URL || "http://localhost:3000",
    "X-Title": process.env.SITE_NAME || "Consultant's Company Insight Hub",
  },
})

// Check if OpenRouter API key is available
export const hasOpenRouterKey = Boolean(process.env.OPENROUTER_API_KEY)
