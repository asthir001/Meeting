# Consultant's Company Insight Hub

An intelligent research assistant that automates deep company research for consultants preparing for client meetings or project proposals.

## Features

- **Automated Research**: AI-powered company research with structured insights
- **Professional Reports**: Document-like templates with sourced information
- **PDF Export**: Download comprehensive reports for client meetings
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Processing**: Live progress tracking during research generation

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with AI SDK integration
- **AI Integration**: OpenAI GPT-4 for intelligent query generation and data extraction
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- OpenAI API key
- Google Search API key (for production)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd consultant-insight-hub
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# OpenRouter API Configuration (Required)
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Site information for OpenRouter rankings (Optional)
SITE_URL=http://localhost:3000
SITE_NAME=Consultant's Company Insight Hub

# Google Search API Configuration (Optional - for production)
GOOGLE_SEARCH_API_KEY=your_google_search_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_custom_search_engine_id_here

# Alternative: SerpApi Configuration (Optional)
SERPAPI_KEY=your_serpapi_key_here
\`\`\`

### API Keys Setup

1. **OpenRouter API Key** (Required):
   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Get your API key from the dashboard
   - Add it to your `.env.local` file

2. **Google Search API** (Optional - for production):
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Custom Search API
   - Create credentials and get your API key
   - Set up a Custom Search Engine at [cse.google.com](https://cse.google.com/)

3. **SerpApi** (Alternative to Google Search):
   - Sign up at [SerpApi.com](https://serpapi.com/)
   - Get your API key from the dashboard

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Input Company Details**: Enter the company name and project domain
2. **Processing**: Watch real-time progress as AI processes the research
3. **Review Results**: Examine the structured research report with sourced information
4. **Export PDF**: Download the professional report for client meetings

## Research Categories

The application generates insights across 10 key categories:

1. **Company Overview**: Mission, vision, history, size, leadership
2. **Products and Services**: Core offerings, features, target markets
3. **Market Position & Industry**: Market share, competition, trends
4. **Financial Information**: Revenue, profitability, funding status
5. **Customer Base**: Demographics, notable clients, segments
6. **Marketing & Sales Strategy**: Channels, campaigns, approach
7. **Online Presence & Reputation**: Social media, reviews, sentiment
8. **Recent News & Developments**: Announcements, partnerships, launches
9. **Pain Points & Opportunities**: Challenges, growth areas
10. **Value Proposition**: Contextual consulting opportunities

## API Integration Notes

### Current Implementation (Demo)
- Uses simulated data for Google Search and web scraping
- AI-powered query generation and data structuring
- In-memory storage for research results

### Production Recommendations
- Integrate with Google Search API or SerpApi
- Implement proper web scraping with Puppeteer/Playwright
- Use a database (PostgreSQL, MongoDB) for data persistence
- Add rate limiting and caching mechanisms
- Implement proper PDF generation with libraries like Puppeteer

## Architecture

\`\`\`
app/
├── page.tsx                 # Main input form
├── research/
│   └── page.tsx            # Processing/loading page
├── results/
│   └── page.tsx            # Results display
└── api/
    └── research/
        ├── route.ts        # Main research endpoint
        └── [id]/
            ├── route.ts    # Get research results
            └── pdf/
                └── route.ts # PDF generation
\`\`\`

## Error Handling

- Network failure recovery
- API rate limit handling
- Invalid input validation
- Graceful degradation for missing data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
