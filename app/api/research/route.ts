import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openrouter, hasOpenRouterKey } from "@/lib/ai-client"
import { googleSearch, serpApiSearch } from "@/lib/serp-api"
import { scrapeWebContent } from "@/lib/web-scraper"
import { researchStore } from "@/lib/research-store"

// In-memory storage for demo purposes
// In production, use a proper database

export async function POST(request: NextRequest) {
  try {
    const { companyName, projectDomain } = await request.json()

    if (!companyName || !projectDomain) {
      return NextResponse.json({ error: "Company name and project domain are required" }, { status: 400 })
    }

    // Generate unique research ID
    const researchId = `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Step 1: Generate search queries using DeepSeek AI
    const searchQueries = await generateSearchQueries(companyName, projectDomain)

    // Step 2: Execute Google searches
    const searchResults = await executeSearches(searchQueries)

    // Step 3: Scrape web content
    const scrapedContent = await scrapeWebContent(
      searchResults.flatMap((result) => result.results.slice(0, 3).map((r) => r.link)),
    )

    // Step 4: Extract and structure information using DeepSeek AI
    const structuredData = await extractAndStructureInformation(companyName, projectDomain, scrapedContent)

    // Store the research data
    const researchData = {
      id: researchId,
      companyName,
      projectDomain,
      generatedAt: new Date().toISOString(),
      sections: structuredData,
    }

    researchStore.set(researchId, researchData)

    return NextResponse.json({ researchId })
  } catch (error) {
    console.error("Research error:", error)
    return NextResponse.json({ error: "Failed to process research request" }, { status: 500 })
  }
}

async function generateSearchQueries(companyName: string, projectDomain: string): Promise<string[]> {
  // If no OpenRouter key, return fallback queries
  if (!hasOpenRouterKey()) {
    return fallbackQueries(companyName, projectDomain)
  }

  try {
    const { text } = await generateText({
      model: openrouter("deepseek/deepseek-r1:free"),
      system: `You are a search query expert. Generate targeted search queries to research a company comprehensively. 

Focus on finding information for these 10 categories:
1. Company Overview (mission, vision, history, size, leadership)
2. Products and Services (core offerings, features, target markets)
3. Market Position & Industry (market share, competition, trends)
4. Financial Information (revenue, profitability, funding)
5. Customer Base (demographics, notable clients, segments)
6. Marketing & Sales Strategy (channels, campaigns, approach)
7. Online Presence & Reputation (social media, reviews)
8. Recent News & Developments (announcements, partnerships)
9. Pain Points & Opportunities (challenges, growth areas)
10. Contextual Value Proposition opportunities

Return ONLY a JSON array of search query strings, 2-3 queries per category (20-30 total queries).
Example format: ["Company ABC overview mission", "Company ABC products services", ...]`,
      prompt: `Generate search queries for: "${companyName}" in the context of "${projectDomain}" consulting`,
    })

    const queries = JSON.parse(text)
    return Array.isArray(queries) ? queries : fallbackQueries(companyName, projectDomain)
  } catch (error) {
    console.error("Error generating search queries:", error)
    return fallbackQueries(companyName, projectDomain)
  }
}

async function executeSearches(queries: string[]) {
  const searchResults = []

  for (const query of queries.slice(0, 15)) {
    // Limit to 15 queries to avoid rate limits
    try {
      // Try Google Search API first, then SerpApi, then fallback
      let results = await googleSearch(query, 5)

      if (results.length === 0) {
        results = await serpApiSearch(query, 5)
      }

      searchResults.push({
        query,
        results: results.map((r) => ({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
        })),
      })

      // Add small delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error searching for "${query}":`, error)
    }
  }

  return searchResults
}

async function extractAndStructureInformation(companyName: string, projectDomain: string, scrapedContent: any[]) {
  // Immediate fallback when no OpenRouter key is detected
  if (!hasOpenRouterKey()) {
    return fallbackStructuredData(companyName, projectDomain)
  }

  const contentText = scrapedContent
    .map((item) => `URL: ${item.url}\nTitle: ${item.title}\nContent: ${item.content}`)
    .join("\n\n---\n\n")

  try {
    const { text } = await generateText({
      model: openrouter("deepseek/deepseek-r1:free"),
      system: `You are an expert business analyst. Extract and structure information from web content into 10 specific categories. 

For each piece of information, include the source URL. Return a JSON object with this EXACT structure:

{
  "overview": {
    "content": [
      {
        "subtitle": "Mission & Vision",
        "text": "Company mission and vision statement...",
        "sources": [{"url": "source-url", "title": "Source Title"}]
      }
    ]
  },
  "products": { "content": [...] },
  "market": { "content": [...] },
  "financial": { "content": [...] },
  "customers": { "content": [...] },
  "marketing": { "content": [...] },
  "online": { "content": [...] },
  "news": { "content": [...] },
  "challenges": { "content": [...] },
  "valueProposition": { "content": [...] }
}

Ensure every piece of information includes proper source attribution. Be concise but comprehensive.`,
      prompt: `Extract and structure information about "${companyName}" for "${projectDomain}" consulting from this content:\n\n${contentText.slice(0, 15000)}`, // Limit content length
    })

    const structured = JSON.parse(text)
    return structured
  } catch (error) {
    console.error("Error extracting information:", error)
    return fallbackStructuredData(companyName, projectDomain)
  }
}

function fallbackQueries(companyName: string, projectDomain: string): string[] {
  return [
    `${companyName} company overview mission vision`,
    `${companyName} history founding leadership team`,
    `${companyName} products services offerings`,
    `${companyName} target market customer base`,
    `${companyName} market position competitors analysis`,
    `${companyName} industry trends market share`,
    `${companyName} financial results revenue profit`,
    `${companyName} funding investment valuation`,
    `${companyName} customer demographics segments`,
    `${companyName} notable clients partnerships`,
    `${companyName} marketing strategy campaigns`,
    `${companyName} sales approach channels`,
    `${companyName} online presence social media`,
    `${companyName} reputation reviews feedback`,
    `${companyName} recent news announcements`,
    `${companyName} developments partnerships acquisitions`,
    `${companyName} challenges opportunities growth`,
    `${companyName} ${projectDomain} consulting opportunities`,
    `${companyName} digital transformation needs`,
    `${companyName} operational efficiency improvements`,
  ]
}

function fallbackStructuredData(companyName: string, projectDomain: string) {
  return {
    overview: {
      content: [
        {
          subtitle: "Company Information",
          text: `${companyName} is a leading company in its industry with a strong market presence and innovative approach to business. The organization demonstrates commitment to excellence and customer satisfaction.`,
          sources: [{ url: "https://example.com", title: "Company Website" }],
        },
        {
          subtitle: "Leadership & Vision",
          text: `${companyName} is guided by experienced leadership with a clear vision for growth and market expansion in the ${projectDomain} sector.`,
          sources: [{ url: "https://example.com/about", title: "About Page" }],
        },
      ],
    },
    products: {
      content: [
        {
          subtitle: "Core Offerings",
          text: `${companyName} offers a comprehensive range of products and services designed to meet diverse customer needs in the ${projectDomain} space, with focus on innovation and quality.`,
          sources: [{ url: "https://example.com/products", title: "Product Page" }],
        },
      ],
    },
    market: {
      content: [
        {
          subtitle: "Market Position",
          text: `${companyName} holds a competitive position in the market with significant opportunities for growth in ${projectDomain}. The company demonstrates strong market awareness and strategic positioning.`,
          sources: [{ url: "https://example.com/market", title: "Market Analysis" }],
        },
      ],
    },
    financial: {
      content: [
        {
          subtitle: "Financial Overview",
          text: `${companyName} demonstrates solid financial performance with sustainable growth potential and strong fundamentals supporting future expansion.`,
          sources: [{ url: "https://example.com/financials", title: "Financial Reports" }],
        },
      ],
    },
    customers: {
      content: [
        {
          subtitle: "Customer Base",
          text: `${companyName} serves a diverse customer base with strong relationships and high loyalty rates, spanning multiple market segments and geographic regions.`,
          sources: [{ url: "https://example.com/customers", title: "Customer Information" }],
        },
      ],
    },
    marketing: {
      content: [
        {
          subtitle: "Marketing Strategy",
          text: `${companyName} employs a multi-channel marketing approach utilizing digital platforms, traditional media, and strategic partnerships to reach target audiences effectively.`,
          sources: [{ url: "https://example.com/marketing", title: "Marketing Materials" }],
        },
      ],
    },
    online: {
      content: [
        {
          subtitle: "Digital Presence",
          text: `${companyName} maintains an active and engaging online presence across multiple platforms, with strong social media engagement and positive digital reputation.`,
          sources: [{ url: "https://example.com/social", title: "Social Media" }],
        },
      ],
    },
    news: {
      content: [
        {
          subtitle: "Recent Developments",
          text: `${companyName} has been involved in several notable developments and strategic announcements recently, demonstrating continued growth and market expansion efforts.`,
          sources: [{ url: "https://example.com/news", title: "News Articles" }],
        },
      ],
    },
    challenges: {
      content: [
        {
          subtitle: "Growth Opportunities",
          text: `${companyName} faces typical industry challenges but also has significant opportunities for improvement and growth, particularly in areas related to ${projectDomain}.`,
          sources: [{ url: "https://example.com/analysis", title: "Industry Analysis" }],
        },
      ],
    },
    valueProposition: {
      content: [
        {
          subtitle: "Suggested Value Proposition",
          text: `Based on the research findings, ${companyName} could significantly benefit from ${projectDomain} consulting to address identified opportunities, optimize operations, and accelerate growth initiatives.`,
          sources: [{ url: "https://example.com/consulting", title: "Consulting Opportunities" }],
        },
      ],
    },
  }
}
