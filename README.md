# Convitsa - AI Engine Optimization Platform

A modern Next.js application for AI Engine Optimization (AIEO). Convitsa helps websites optimize their content and structure for AI engines, improving visibility and discoverability.

## Features

- **User Authentication**: Signup with email verification
- **Domain Verification**: DNS-based domain ownership verification
- **Competitor Analysis**: Compare your AI visibility score with competitors
- **AI Optimization**: Automated detection and fixing of AI visibility issues
- **Modern UI**: Clean, professional design with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Font**: DM Sans

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Starting Point

Navigate to `/signup?domain=https://yourdomain.com` to begin the onboarding flow with a pre-filled domain.

## Project Structure

```
/app
  /signup           # Signup & verification
  /(authenticated)  # Protected routes with sidebar
    /dashboard      # Domain verification
    /competitors    # Competitor analysis
    /ai-optimization # AI optimization flow
    /settings       # Account settings
  layout.tsx        # Root layout
  
/components
  /ui               # Reusable UI components
    Button.tsx
    Input.tsx
    Card.tsx
    Modal.tsx
    Loader.tsx
    Sidebar.tsx
    Toast.tsx

/context
  AppContext.tsx    # Global state management
```

## Brand Identity

- **Primary Color**: #6C5DD3 (Purple)
- **Secondary Color**: #FFFFFF (White)
- **Font**: DM Sans (Regular & Bold)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT


