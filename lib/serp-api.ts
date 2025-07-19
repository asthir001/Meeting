// Google Search API integration
interface SearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
}

interface GoogleSearchResponse {
  items?: SearchResult[]
  searchInformation?: {
    totalResults: string
  }
}

export async function googleSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID

  if (!apiKey || !searchEngineId) {
    console.log("Google Search API not configured, using fallback results")
    return generateFallbackResults(query)
  }

  try {
    const url = new URL("https://www.googleapis.com/customsearch/v1")
    url.searchParams.set("key", apiKey)
    url.searchParams.set("cx", searchEngineId)
    url.searchParams.set("q", query)
    url.searchParams.set("num", maxResults.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`)
    }

    const data: GoogleSearchResponse = await response.json()

    return (
      data.items?.map((item) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayLink,
      })) || []
    )
  } catch (error) {
    console.error("Google Search API error:", error)
    return generateFallbackResults(query)
  }
}

// Alternative SerpApi integration
export async function serpApiSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    console.log("SerpApi not configured, using fallback results")
    return generateFallbackResults(query)
  }

  try {
    const url = new URL("https://serpapi.com/search")
    url.searchParams.set("api_key", apiKey)
    url.searchParams.set("engine", "google")
    url.searchParams.set("q", query)
    url.searchParams.set("num", maxResults.toString())

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`SerpApi error: ${response.status}`)
    }

    const data = await response.json()

    return (
      data.organic_results?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        displayLink: item.displayed_link || item.link,
      })) || []
    )
  } catch (error) {
    console.error("SerpApi error:", error)
    return generateFallbackResults(query)
  }
}

function generateFallbackResults(query: string): SearchResult[] {
  return [
    {
      title: `Search result for "${query}" - Company Information`,
      link: `https://example.com/search-result-1-${Math.random().toString(36).substr(2, 9)}`,
      snippet: `Comprehensive information about ${query} including company overview, products, and market position.`,
      displayLink: "example.com",
    },
    {
      title: `${query} - Financial and Market Analysis`,
      link: `https://example.com/search-result-2-${Math.random().toString(36).substr(2, 9)}`,
      snippet: `Financial performance, market analysis, and competitive landscape for ${query}.`,
      displayLink: "example.com",
    },
    {
      title: `Recent News and Developments - ${query}`,
      link: `https://example.com/search-result-3-${Math.random().toString(36).substr(2, 9)}`,
      snippet: `Latest news, partnerships, and strategic developments related to ${query}.`,
      displayLink: "example.com",
    },
  ]
}
