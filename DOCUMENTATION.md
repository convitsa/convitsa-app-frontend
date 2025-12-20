# Convitsa AIEO - Complete Application Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Brand Identity](#brand-identity)
5. [Authentication Pages](#authentication-pages)
6. [Main Application Pages](#main-application-pages)
7. [Reusable UI Components](#reusable-ui-components)
8. [Global Components](#global-components)
9. [State Management](#state-management)
10. [Styling & Animations](#styling--animations)
11. [Performance Optimizations](#performance-optimizations)
12. [Getting Started](#getting-started)

---

## Project Overview

Convitsa AIEO (AI Engine Optimization) is a comprehensive web application built with Next.js 14 that helps websites optimize their content for AI search engines and language models. The platform provides tools for:

- Domain verification and setup
- Competitor analysis and benchmarking
- AI visibility score tracking
- Automated content optimization
- Real-time monitoring and analytics
- Team collaboration
- AI-powered chat assistance

### Starting Point

Users arrive at the application via:
```
https://app.convitsa.com/signup?domain=https://domain.com
```

The domain parameter is captured from the URL and becomes the user's first project after registration.

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.15 | React framework with App Router |
| React | 18.3.1 | UI library |
| TypeScript | 5.6.3 | Type safety |
| Tailwind CSS | 3.4.14 | Utility-first CSS |
| Lucide React | 0.460.0 | Icon library |
| Recharts | 2.15.4 | Data visualization charts |

### Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.js` - PostCSS plugins
- `next.config.js` - Next.js configuration

---

## Project Structure

```
convitsa-app/
├── app/
│   ├── (authenticated)/          # Protected routes with sidebar
│   │   ├── ai-assistant/
│   │   │   └── page.tsx          # AI chat interface
│   │   ├── ai-optimization/
│   │   │   └── page.tsx          # Optimization workflow
│   │   ├── analytics/
│   │   │   └── page.tsx          # Charts and metrics
│   │   ├── audit-history/
│   │   │   └── page.tsx          # Change timeline
│   │   ├── backlinks/
│   │   │   └── page.tsx          # AI citation tracking
│   │   ├── billing/
│   │   │   └── page.tsx          # Subscription & pricing
│   │   ├── competitors/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Competitor deep dive
│   │   │   └── page.tsx          # Competitor list & analysis
│   │   ├── content/
│   │   │   └── page.tsx          # Content editor
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Main dashboard
│   │   ├── docs/
│   │   │   └── page.tsx          # Documentation center
│   │   ├── integrations/
│   │   │   └── page.tsx          # Third-party connections
│   │   ├── monitoring/
│   │   │   └── page.tsx          # Health & status
│   │   ├── settings/
│   │   │   └── page.tsx          # Account settings
│   │   ├── team/
│   │   │   └── page.tsx          # Team management
│   │   └── layout.tsx            # Authenticated layout with sidebar
│   ├── forgot-password/
│   │   └── page.tsx              # Password recovery
│   ├── login/
│   │   └── page.tsx              # User login
│   ├── reset-password/
│   │   └── page.tsx              # Password reset
│   ├── signup/
│   │   └── page.tsx              # Registration with domain capture
│   ├── error.tsx                 # Error boundary
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── loading.tsx               # Loading state
│   ├── not-found.tsx             # 404 page
│   └── page.tsx                  # Root redirect
├── components/
│   └── ui/
│       ├── Button.tsx            # Button component
│       ├── Card.tsx              # Card components
│       ├── CommandPalette.tsx    # ⌘K search modal
│       ├── Input.tsx             # Form input
│       ├── Loader.tsx            # Loading spinners
│       ├── Modal.tsx             # Modal dialog
│       ├── Sidebar.tsx           # Navigation sidebar
│       ├── Toast.tsx             # Notifications
│       └── index.ts              # Component exports
├── context/
│   └── AppContext.tsx            # Global state provider
├── .gitignore
├── DOCUMENTATION.md              # This file
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```

---

## Brand Identity

### Colors

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary | `#6C5DD3` | Buttons, links, active states, accents |
| Primary Dark | `#5A4DB8` | Hover states |
| Primary Light | `#8B7FDF` | Gradients, backgrounds |
| White | `#FFFFFF` | Backgrounds, text on dark |
| Gray 50 | `#F8F9FA` | Page backgrounds |

### Typography

- **Font Family**: DM Sans (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Design Principles

- Modern, clean, professional aesthetic
- Subtle gradients and shadows
- Smooth animations and transitions
- Consistent spacing using Tailwind's scale
- Rounded corners (xl, 2xl) for friendly feel

---

## Authentication Pages

### 1. Signup Page (`/signup`)

**File**: `app/signup/page.tsx`

**Features**:
- Domain capture from URL query parameter (`?domain=https://domain.com`)
- Form fields: Email, First Name, Last Name, Password, Confirm Password
- Domain badge showing "Setting up for: {domain}"
- Form validation with error messages
- Two-step flow:
  1. Registration form
  2. Email verification (6-digit code input)
- Auto-focus on verification code inputs
- Redirect to `/dashboard` after verification
- Responsive, centered design with animated background

**State Management**:
- `step`: 'signup' | 'verify'
- `formData`: email, firstName, lastName, password, confirmPassword
- `errors`: validation error messages
- `verificationCode`: 6-digit array
- `isLoading`: form submission state

---

### 2. Login Page (`/login`)

**File**: `app/login/page.tsx`

**Features**:
- Email and password fields with icons
- "Remember me" checkbox
- "Forgot Password?" link
- Form validation
- Loading state on submit
- Link to signup page
- Mock authentication (stores user in context)
- Redirect to `/dashboard` on success

---

### 3. Forgot Password Page (`/forgot-password`)

**File**: `app/forgot-password/page.tsx`

**Features**:
- Email input field
- "Send Reset Link" button with loading state
- Success state with checkmark animation
- Success message: "Check your email for reset link"
- "Resend" option
- "Back to Login" link

---

### 4. Reset Password Page (`/reset-password`)

**File**: `app/reset-password/page.tsx`

**Features**:
- URL token validation (`?token=xxx`)
- Invalid token error state
- New password field
- Confirm password field
- Password strength indicator (4 levels):
  - Weak (red)
  - Fair (yellow)
  - Good (blue)
  - Strong (green)
- Strength calculated based on:
  - Length ≥ 8
  - Lowercase letters
  - Uppercase letters
  - Numbers
  - Special characters
- Redirect to `/login` on success with toast

---

## Main Application Pages

### 5. Dashboard Page (`/dashboard`)

**File**: `app/(authenticated)/dashboard/page.tsx`

**Features**:

**Initial State (Domain Not Verified)**:
- Alert banner: "Complete domain verification to unlock all features"
- DNS verification instructions
- CNAME record display: `convitsa-verify.yourdomain.com → verify.convitsa.com`
- TXT record display: `convitsa-verification=abc123xyz456`
- Copy to clipboard buttons
- "Check Verification" button with loading state
- Help link to DNS setup guide

**Success State (Domain Verified)**:
- Success banner with green checkmark: "You are all set! ✓"
- "Check Your Competitors" CTA button
- Stats cards:
  - AI Visibility Score (67/100)
  - Issues Detected (12)
  - Competitors Ahead (5)

---

### 6. My Competitors Page (`/competitors`)

**File**: `app/(authenticated)/competitors/page.tsx`

**Features**:

**Loading Phase** (5 seconds):
- Animated loader in center
- Rotating action texts (every 1.5 seconds):
  - "Searching Your Competitors..."
  - "Analyzing their AI Visibility..."
  - "Calculating scores..."
  - "Comparing performance..."
  - "Gathering insights..."

**Results View**:
- User's score card with circular progress (67/100)
- "Competitors Ranking Higher" section
- Competitor cards grid with:
  - Company initial avatar
  - Company name
  - Score (e.g., 89/100)
  - Progress bar
  - "Using Convitsa" badge (if applicable)
  - Points difference
- "Competitors You're Ahead Of" section (dimmed)
- "See Why You're Behind" CTA button

**Issues View**:
- Dramatic reveal with staggered animations
- Header with warning badge
- Grid of 10 issue cards:
  1. Missing llms.txt file
  2. Non-optimized metadata
  3. No structured data
  4. Poor content formatting
  5. Missing AI-readable summaries
  6. Incomplete sitemap
  7. Robots.txt issues
  8. Slow page performance
  9. Missing semantic markup
  10. No AI-specific endpoints
- Each card has icon + description
- "Solve Issues" button → navigates to `/ai-optimization`

**Circular Progress Component**:
- SVG-based circular progress
- Animated stroke-dashoffset
- Customizable size

---

### 7. Competitor Deep Dive Page (`/competitors/[id]`)

**File**: `app/(authenticated)/competitors/[id]/page.tsx`

**Features**:
- Back button navigation
- Competitor header with:
  - Large avatar
  - Company name
  - "Using Convitsa" badge
  - Website link
- Action buttons:
  - "Add to Watch List" toggle
  - "Compare with My Site"
- Large score card with circular progress
- Score comparison with user's site

**Score Breakdown**:
- Radar chart (Recharts) showing 6 categories:
  - Content Quality
  - Technical SEO
  - AI Readability
  - Structured Data
  - Page Speed
  - Metadata
- Category progress bars

**What They're Doing Right**:
- Expandable cards with:
  - Title and description
  - Code snippets (syntax highlighted)
  - Copy button
  - "Implement This" button

**Their llms.txt Preview**:
- Monospace code display
- "View Full File" button

**Citation Sources**:
- Grid showing citations per AI engine

**Score Timeline**:
- Line chart showing score history over 6 months

---

### 8. AI Engine Optimization Page (`/ai-optimization`)

**File**: `app/(authenticated)/ai-optimization/page.tsx`

**Features**:

**Phase 1 - Analyzing** (3 seconds):
- Animated loader with Sparkles icon
- Rotating texts:
  - "Analyzing your website..."
  - "Checking metadata..."
  - "Scanning content structure..."
  - "Identifying opportunities..."

**Phase 2 - Fixing** (4 seconds):
- Different loader animation with Zap icon
- Rotating texts:
  - "Started fixing your issues..."
  - "Generating llms.txt..."
  - "Creating markdown files..."
  - "Optimizing content..."
  - "Adding structured data..."
  - "Enhancing metadata..."

**Success Modal**:
- Confetti animation (50 particles)
- Checkmark with pulse ring
- "12 Issues Fixed Successfully! ✓"
- "See the Results Now" button

**Results View**:
- Success banner
- List of 12 completed fixes with checkmarks:
  1. llms.txt file created
  2. AI-optimized markdown files added
  3. Content structure improved
  4. Metadata enhanced
  5. Structured data implemented
  6. XML sitemap updated
  7. Robots.txt optimized
  8. Page performance improved
  9. Semantic HTML added
  10. AI endpoints configured
  11. Schema.org markup added
  12. Content summaries generated
- "Sync Changes" button
- Loading state → "Synced successfully!" toast
- Auto Sync toggle with lock icon
- PRO badge → opens upgrade modal

**Upgrade Modal**:
- Crown icon
- Features list (6 items)
- Pricing: $49/month
- "Upgrade Now" button

---

### 9. Analytics Page (`/analytics`)

**File**: `app/(authenticated)/analytics/page.tsx`

**Features**:
- Time period selector dropdown:
  - Last 7 days
  - Last 30 days
  - Last 90 days
  - All time
- Export Report button (PDF/CSV dropdown)

**Key Metrics Cards**:
1. Current Score (82/100) with trend
2. Score Change (+12) this month
3. Ranking Position (#23 in industry)
4. Total Optimizations (47)

**Charts** (Recharts):

**AI Visibility Score Over Time**:
- Line chart with 4 lines:
  - Your Score (solid purple)
  - TechFlow Inc (dashed green)
  - DataPulse (dashed amber)
  - CloudMind (dashed blue)
- Custom tooltip
- Legend

**Score Growth**:
- Area chart with gradient fill
- Shows user's score trend

**Impact Analysis Table**:
- Columns: Optimization, Before, After, Impact, Progress
- 5 rows showing impact of different optimizations
- Progress bars

---

### 10. Content Management Page (`/content`)

**File**: `app/(authenticated)/content/page.tsx`

**Features**:

**File Tree Sidebar**:
- Expandable folders with icons
- Files:
  - llms.txt
  - Markdown Files (folder)
    - about.md
    - services.md
  - Structured Data (folder)
    - organization.json
  - Metadata (folder)
    - meta-tags.json

**Editor Area**:
- File tabs
- Last edited timestamp
- Copy button
- Preview toggle
- Split screen: Editor | Preview
- Monospace font for code
- "Save Changes" button

**Action Bar**:
- "New File" button → modal with filename input
- "Generate with AI" button → AI modal
- "Delete" button → confirmation modal

**AI Generation Modal**:
- Textarea prompt input
- Loading state with rotating texts
- Generated content preview
- "Insert Content" button

---

### 11. Integrations Page (`/integrations`)

**File**: `app/(authenticated)/integrations/page.tsx`

**Features**:

**Integration Cards Grid**:
- Google Search Console (connected)
- Google Analytics (connected)
- WordPress (not connected)
- Webflow (not connected)
- Shopify (not connected)
- Squarespace (not connected)

Each card shows:
- Logo/emoji
- Name and description
- "Connected" badge or "Connect" button
- "Configure" button (if connected)

**API Keys Section**:
- API key display with copy button
- "Regenerate" button
- Security warning
- API documentation link

**Webhooks Section**:
- "Add Webhook" button
- List of configured webhooks showing:
  - URL
  - Active status
  - Events (chips)
  - "Test" button
  - Delete button

**Webhook Modal**:
- URL input
- Event checkboxes:
  - Sync Completed
  - Issues Found
  - Optimization Completed
  - Score Changed

---

### 12. Billing Page (`/billing`)

**File**: `app/(authenticated)/billing/page.tsx`

**Features**:

**Current Plan Card**:
- Plan badge (Free Plan)
- Usage bar: "3/10 optimizations used"
- "Upgrade to Pro" button

**Pricing Plans** (3 cards):

**Free Plan**:
- $0/month
- 1 domain
- 10 optimizations/month
- Basic analytics
- Email support
- "Current Plan" badge

**Pro Plan** (Most Popular):
- $49/month
- 5 domains
- Unlimited optimizations
- Advanced analytics
- Auto-sync
- Priority support
- AI chat assistant
- Custom reports
- Team members (3)
- "Upgrade Now" button

**Enterprise**:
- Custom pricing
- Unlimited domains
- White-label option
- Dedicated support
- API access
- Team management
- Custom integrations
- SLA guarantee
- "Contact Sales" button

**Payment Method Section**:
- Credit card on file (Visa •••• 4242)
- "Update Payment Method" button

**Billing History Table**:
- Columns: Invoice, Date, Description, Amount, Status, Actions
- Download button for each invoice

---

### 13. AI Chat Assistant Page (`/ai-assistant`)

**File**: `app/(authenticated)/ai-assistant/page.tsx`

**Features**:

**Chat History Sidebar**:
- "New Chat" button
- Recent chats list showing:
  - Chat title
  - Last message preview
  - Timestamp

**Main Chat Area**:

**Empty State**:
- Large Convitsa logo
- "How can I help you today?"
- Suggested prompts grid (6 prompts):
  - "How can I improve my AI visibility score?"
  - "Analyze my competitors' strategies"
  - "Generate content ideas for my website"
  - "What are the latest AI search trends?"
  - "Help me optimize my llms.txt file"
  - "Explain structured data best practices"

**Chat Interface**:
- Message bubbles (user = purple, AI = white)
- AI avatar with gradient
- User avatar with initial
- Timestamps
- Typing indicator (3 bouncing dots)
- Copy button for AI messages
- Regenerate button

**AI Responses**:
- Markdown-like formatting
- Tables
- Code blocks
- Lists
- Headers

**Input Area**:
- Textarea
- Send button
- "Press Enter to send, Shift+Enter for new line"

---

### 14. Audit History Page (`/audit-history`)

**File**: `app/(authenticated)/audit-history/page.tsx`

**Features**:

**Filters**:
- Search bar: "Search audit logs..."
- Type filter dropdown:
  - All Actions
  - Optimizations
  - Syncs
  - Manual Edits
  - Auto Updates
- Date range button

**Timeline View**:
Each entry shows:
- Type icon (color-coded):
  - Optimization (purple)
  - Sync (green)
  - Manual (blue)
  - Auto (amber)
- Action title
- Description
- User who performed it
- Timestamp (relative)
- Expand/collapse button

**Expanded Details**:
- Files Affected (chips)
- Changes (Before/After side-by-side)
- "Rollback Changes" button

**Rollback Modal**:
- Warning banner
- Action details
- "Confirm Rollback" button

---

### 15. Team Management Page (`/team`)

**File**: `app/(authenticated)/team/page.tsx`

**Features**:

**Team Members Table**:
- Columns: Member, Role, Status, Last Active, Actions
- Roles with colored badges:
  - Owner (purple, with shield icon)
  - Admin (blue)
  - Editor (green)
  - Viewer (gray)
- Status:
  - Active (green checkmark)
  - Invited (amber clock)
- Actions dropdown:
  - Edit Role
  - Remove

**Invite Modal**:
- Email input
- Role selector (radio buttons):
  - Admin: Full access except billing
  - Editor: Can edit content and run optimizations
  - Viewer: Read-only access
- "Send Invite" button

**Pending Invitations Section**:
- List of pending invites
- "Resend" and "Cancel" buttons

**Activity Log Section**:
- Recent team member actions
- Avatar, name, action, timestamp

---

### 16. Documentation Page (`/docs`)

**File**: `app/(authenticated)/docs/page.tsx`

**Features**:

**Left Sidebar Navigation**:
- Search bar with ⌘K shortcut
- Expandable sections:
  - Getting Started
  - Domain Verification
  - AI Optimization Guide
  - Content Management
  - Integrations
  - API Reference
  - FAQ
  - Troubleshooting

**Main Content Area**:
- Breadcrumb navigation
- Article content with:
  - Headers (H1, H2, H3)
  - Paragraphs
  - Code blocks with copy button
  - Blockquotes (info boxes)
  - Lists
  - Horizontal rules

**Right Sidebar**:
- "On this page" table of contents

**Feedback Section**:
- "Was this helpful?" with thumbs up/down
- "Contact Support" button

---

### 17. Monitoring Page (`/monitoring`)

**File**: `app/(authenticated)/monitoring/page.tsx`

**Features**:

**Status Overview Cards**:
1. System Status: "All Systems Operational" (green)
2. Uptime: 99.9%
3. Avg Response Time: 138ms

**Response Time Chart**:
- Line chart showing 24-hour response times
- Y-axis in milliseconds

**Health Checks**:
- 6 checks with status indicators:
  1. DNS Configuration ✓
  2. SSL Certificate ✓ (expires in 90 days)
  3. CNAME Record ✓
  4. TXT Record ✓
  5. llms.txt ✓
  6. Robots.txt ⚠ (warning)
- Last checked timestamp for each

**Incident History**:
- Timeline of past incidents
- Each shows:
  - Title
  - Impact badge (minor/major/critical)
  - Status badge (resolved/investigating)
  - Duration
  - Description

**Alert Settings**:
- Toggle switches for:
  - Email Notifications
  - Slack Integration
  - Webhook Alerts

---

### 18. Backlink Tracking Page (`/backlinks`)

**File**: `app/(authenticated)/backlinks/page.tsx`

**Features**:

**Overview Cards**:
1. Total AI Citations: 247
2. New This Month: +23
3. Top Source: ChatGPT (89 citations)

**Sources Breakdown Table**:
- Columns: AI Engine, Citations, Trend, Last Detected, Actions
- AI Engines:
  - ChatGPT (89, +12%)
  - Claude (67, +8%)
  - Gemini (45, -3%)
  - Perplexity (34, +15%)
  - Copilot (12, +5%)

**Recent Citations**:
- Cards showing actual AI responses mentioning brand
- Source icon and name
- Context snippet with brand highlighted
- "View Source" link

**Competitor Comparison Chart**:
- Bar chart (Recharts)
- Your site vs 2 competitors
- Grouped by AI engine

---

### 19. Settings Page (`/settings`)

**File**: `app/(authenticated)/settings/page.tsx`

**Features**:

**Profile Section**:
- First Name, Last Name inputs
- Email input
- "Save Changes" button

**Domain Management**:
- Domain display with verified badge
- "View Site" button

**Notifications**:
- Toggle switches for:
  - Email notifications
  - Weekly reports
  - Competitor alerts
  - Product updates

**Security**:
- Password (last changed info)
- "Change Password" button
- Two-Factor Authentication
- "Enable 2FA" button

**Billing Quick Access**:
- Current plan badge
- "Upgrade to Pro" button

**Danger Zone**:
- "Log Out" button
- "Delete Account" button (red)

---

## Reusable UI Components

### Button (`components/ui/Button.tsx`)

**Props**:
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `disabled`: boolean

**Features**:
- Loading spinner
- Shadow effects
- Hover transitions
- Focus ring

---

### Input (`components/ui/Input.tsx`)

**Props**:
- `label`: string
- `error`: string
- `helperText`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- `type`: 'text' | 'email' | 'password' | etc.

**Features**:
- Password visibility toggle
- Error state styling
- Focus ring
- Icon positioning

---

### Card (`components/ui/Card.tsx`)

**Props**:
- `hover`: boolean (enables hover effects)
- `gradient`: boolean (adds gradient background)
- `padding`: 'none' | 'sm' | 'md' | 'lg'

**Subcomponents**:
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

---

### Modal (`components/ui/Modal.tsx`)

**Props**:
- `isOpen`: boolean
- `onClose`: () => void
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `showCloseButton`: boolean

**Features**:
- Backdrop blur
- Scale-in animation
- Body scroll lock
- Close on backdrop click

---

### Loader (`components/ui/Loader.tsx`)

**Props**:
- `size`: 'sm' | 'md' | 'lg'
- `text`: string
- `variant`: 'spinner' | 'dots' | 'pulse'

**RotatingTextLoader Component**:
- `texts`: string[]
- `interval`: number (ms)
- Automatically cycles through texts

---

### Sidebar (`components/ui/Sidebar.tsx`)

**Features**:
- 14 navigation items with icons
- Domain selector dropdown
- User profile dropdown
- Command palette trigger (⌘K)
- Mobile hamburger menu
- Fixed positioning (sticky)
- Memoized for performance

**Navigation Items**:
1. Dashboard
2. My Competitors
3. AI Engine Optimization
4. Analytics
5. Content Management
6. Monitoring
7. Backlink Tracking
8. AI Assistant
9. Integrations
10. Audit History
11. Team
12. Billing
13. Documentation
14. Settings

---

### Toast (`components/ui/Toast.tsx`)

**Types**:
- Success (green)
- Error (red)
- Info (blue)

**Features**:
- Auto-dismiss after 4 seconds
- Slide-in animation
- Close button
- Icon per type

---

### CommandPalette (`components/ui/CommandPalette.tsx`)

**Features**:
- Opens with ⌘K / Ctrl+K
- Search across all pages
- Keyboard navigation (↑↓)
- Enter to select
- ESC to close
- Highlighted selected item
- Instant filtering

---

## Global Components

### Error Page (`app/error.tsx`)

**Features**:
- Error icon
- "Something went wrong" message
- "Try Again" button (calls reset)
- "Go to Dashboard" link
- Error details in development mode

---

### 404 Not Found Page (`app/not-found.tsx`)

**Features**:
- Large "404" text with search icon overlay
- "Page Not Found" message
- "Go to Dashboard" button
- "Go Back" button
- Help link to documentation

---

### Loading Page (`app/loading.tsx`)

**Features**:
- Animated Convitsa logo
- Spinning ring
- "Loading..." text with pulse

---

## State Management

### AppContext (`context/AppContext.tsx`)

**State**:
```typescript
interface AppContextType {
  domain: string | null;
  setDomain: (domain: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  isDomainVerified: boolean;
  setIsDomainVerified: (value: boolean) => void;
  verificationCode: string;
  competitorAnalysisComplete: boolean;
  setCompetitorAnalysisComplete: (value: boolean) => void;
  aiOptimizationComplete: boolean;
  setAiOptimizationComplete: (value: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}
```

**Features**:
- LocalStorage persistence for:
  - domain
  - user
  - authentication status
  - verification status
- Toast notification system
- Auto-restore state on mount

---

## Styling & Animations

### Global CSS (`app/globals.css`)

**Custom Styles**:
- DM Sans font import
- Custom scrollbar styling
- Gradient utilities:
  - `.gradient-primary`
  - `.gradient-subtle`
  - `.gradient-card`
- Circular progress bar styles
- Toast slide-in animation
- Stagger animation for cards (10 items)
- Confetti fall animation
- Pulse ring animation

### Tailwind Extensions (`tailwind.config.ts`)

**Custom Animations**:
- `spin-slow`: 3s linear spin
- `pulse-slow`: 3s pulse
- `bounce-slow`: 2s bounce
- `fade-in`: 0.5s fade
- `slide-up`: 0.5s slide + fade
- `scale-in`: 0.3s scale + fade

**Custom Colors**:
- `primary`: #6C5DD3
- `primary-dark`: #5A4DB8
- `primary-light`: #8B7FDF

---

## Performance Optimizations

### Sidebar Optimization

The sidebar was optimized to prevent unnecessary re-renders on page navigation:

1. **Memoized Components**: Each section is wrapped in `React.memo`:
   - `Logo` - Never re-renders
   - `SearchTrigger` - Static
   - `DomainSelector` - Only on domain change
   - `Navigation` - Only on pathname change
   - `NavItem` - Only on active state change
   - `UserSection` - Only on user change

2. **Isolated Pathname**: `usePathname()` is only used in the `Navigation` component, so path changes don't trigger re-renders for other sections.

3. **useCallback Hooks**: Event handlers are memoized to prevent prop changes.

### Layout Optimization

- Sidebar is `fixed` position with `h-screen`
- Main content has `lg:ml-72` offset
- Only page content re-renders on navigation, not the entire layout

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd convitsa-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access Points

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/signup` |
| `/signup?domain=https://example.com` | Registration with domain |
| `/login` | User login |
| `/dashboard` | Main dashboard (authenticated) |

### Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Summary

This documentation covers the complete Convitsa AIEO application built during this chat session:

- **19 total pages** (4 auth + 15 main)
- **8 reusable UI components**
- **Full authentication flow** with domain capture
- **Competitor analysis** with loading states and issues view
- **AI optimization workflow** with animated phases
- **Analytics dashboard** with Recharts visualizations
- **Content management** with file tree and editor
- **Team collaboration** with roles and permissions
- **AI chat assistant** with suggested prompts
- **Real-time monitoring** and health checks
- **Backlink tracking** for AI citations
- **Billing system** with pricing plans
- **Documentation center** with search
- **Command palette** for quick navigation
- **Error handling** with custom pages
- **Performance optimized** sidebar

Total files created: **40+**
Total lines of code: **~8,000+**


