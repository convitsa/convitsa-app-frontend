// Mock data for the Convitsa dashboard

// Prompt data for the dashboard
export interface Prompt {
  id: string;
  prompt: string;
  topLLM: string;
  visibilityScore: number;
  topCompetitors: string[];
  location: string;
  group: string;
}

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    prompt: 'Best project management tools for startups',
    topLLM: 'ChatGPT',
    visibilityScore: 85,
    topCompetitors: ['Asana', 'Monday.com', 'Notion'],
    location: 'US',
    group: 'Product',
  },
  {
    id: '2',
    prompt: 'How to improve team productivity',
    topLLM: 'Claude',
    visibilityScore: 72,
    topCompetitors: ['Slack', 'Microsoft Teams'],
    location: 'UK',
    group: 'Productivity',
  },
  {
    id: '3',
    prompt: 'Best CRM software for small business',
    topLLM: 'Perplexity',
    visibilityScore: 68,
    topCompetitors: ['Salesforce', 'HubSpot', 'Pipedrive'],
    location: 'EU',
    group: 'Sales',
  },
  {
    id: '4',
    prompt: 'AI tools for content creation',
    topLLM: 'ChatGPT',
    visibilityScore: 91,
    topCompetitors: ['Jasper', 'Copy.ai', 'Writesonic'],
    location: 'US',
    group: 'Marketing',
  },
  {
    id: '5',
    prompt: 'Best analytics platforms 2024',
    topLLM: 'Gemini',
    visibilityScore: 54,
    topCompetitors: ['Google Analytics', 'Mixpanel', 'Amplitude'],
    location: 'Asia',
    group: 'Analytics',
  },
];

// Content keywords for Write Content section
export interface ContentKeyword {
  id: string;
  keyword: string;
  aiModels: string[];
  searchVolume?: number;
  difficulty?: string;
}

export const mockContentKeywords: ContentKeyword[] = [
  { id: '1', keyword: 'web3 job boards', aiModels: ['Gemini', 'ChatGPT', 'Perplexity'] },
  { id: '2', keyword: 'best web3 job boards', aiModels: ['Gemini', 'ChatGPT'] },
  { id: '3', keyword: 'web3 job sites', aiModels: ['Gemini', 'ChatGPT'] },
  { id: '4', keyword: 'decentralized job platforms', aiModels: ['Gemini'] },
  { id: '5', keyword: 'remote web3 job board', aiModels: ['Gemini', 'ChatGPT', 'Perplexity'] },
  { id: '6', keyword: 'how to find Web3 developer jobs', aiModels: ['ChatGPT', 'Gemini'] },
  { id: '7', keyword: 'where to find web3 jobs', aiModels: ['ChatGPT', 'Gemini'] },
  { id: '8', keyword: 'blockchain job boards', aiModels: ['Gemini'] },
  { id: '9', keyword: 'top web3 career sites', aiModels: ['Gemini'] },
  { id: '10', keyword: 'Web3 developer job boards', aiModels: ['Gemini'] },
];

// Backlink opportunities
export interface BacklinkOpportunity {
  id: string;
  url: string;
  domain: string;
  favicon?: string;
  aiModels: string[];
  usageCount: number;
  lastSeen: string;
  firstIdentified: string;
  hasOutreach?: boolean;
}

export const mockBacklinkOpportunities: BacklinkOpportunity[] = [
  { id: '1', url: 'https://beincrypto.com/jobs/', domain: 'beincrypto.com', aiModels: ['Gemini', 'ChatGPT'], usageCount: 76, lastSeen: 'Dec 17', firstIdentified: 'Jun 30', hasOutreach: true },
  { id: '2', url: 'https://www.cryptojobs.com/web3', domain: 'cryptojobs.com', aiModels: ['ChatGPT', 'Gemini'], usageCount: 47, lastSeen: 'Dec 17', firstIdentified: 'Jul 5', hasOutreach: true },
  { id: '3', url: 'https://wellfound.com/web3', domain: 'wellfound.com', aiModels: ['Gemini', 'ChatGPT'], usageCount: 31, lastSeen: 'Dec 17', firstIdentified: 'Jun 30' },
  { id: '4', url: 'https://cryptojobslist.com/', domain: 'cryptojobslist.com', aiModels: ['Gemini'], usageCount: 30, lastSeen: 'Dec 17', firstIdentified: 'Jun 30', hasOutreach: true },
  { id: '5', url: 'https://coinledger.io/tools/best-crypto-and-...', domain: 'coinledger.io', aiModels: ['Gemini'], usageCount: 25, lastSeen: 'Dec 17', firstIdentified: 'Jul 5', hasOutreach: true },
  { id: '6', url: 'https://hashtagweb3.com/best-web3-job-b...', domain: 'hashtagweb3.com', aiModels: ['Gemini'], usageCount: 15, lastSeen: 'Dec 17', firstIdentified: 'Oct 30', hasOutreach: true },
  { id: '7', url: 'https://wellfound.com/web3?utm_source=chatg...', domain: 'wellfound.com', aiModels: ['Perplexity'], usageCount: 12, lastSeen: 'Dec 17', firstIdentified: 'Aug 8' },
  { id: '8', url: 'https://www.cryptojobs.com/', domain: 'cryptojobs.com', aiModels: ['Gemini'], usageCount: 10, lastSeen: 'Dec 17', firstIdentified: 'Jul 9', hasOutreach: true },
  { id: '9', url: 'https://web3.career/remote-jobs', domain: 'web3.career', aiModels: ['ChatGPT', 'Gemini'], usageCount: 10, lastSeen: 'Dec 17', firstIdentified: 'Jun 30', hasOutreach: true },
  { id: '10', url: 'https://www.reddit.com//r/web3/comments/1nsz...', domain: 'reddit.com', aiModels: ['Perplexity'], usageCount: 9, lastSeen: 'Dec 17', firstIdentified: 'Nov 2' },
];

// Prompt groups for the dropdown
export interface PromptGroup {
  id: string;
  name: string;
  promptCount: number;
}

export const mockPromptGroups: PromptGroup[] = [
  { id: '1', name: 'where to find web3 jobs', promptCount: 12 },
  { id: '2', name: 'best crypto job boards', promptCount: 8 },
  { id: '3', name: 'remote blockchain careers', promptCount: 6 },
  { id: '4', name: 'web3 developer opportunities', promptCount: 15 },
  { id: '5', name: 'defi job listings', promptCount: 4 },
];

// Top Domains for Sources page
export interface TopDomainSource {
  id: string;
  domain: string;
  count: number;
  color: string;
  favicon?: string;
}

export const mockTopDomainSources: TopDomainSource[] = [
  { id: '1', domain: 'remote3.co', count: 137, color: '#6C5DD3' },
  { id: '2', domain: 'github.com', count: 106, color: '#333333' },
  { id: '3', domain: 'cryptojobslist.com', count: 70, color: '#10B981' },
  { id: '4', domain: 'beincrypto.com', count: 53, color: '#F59E0B' },
  { id: '5', domain: 'coinledger.io', count: 53, color: '#3B82F6' },
  { id: '6', domain: 'web3.career', count: 49, color: '#EC4899' },
];

// Domain trends data for chart
export interface DomainTrendPoint {
  date: string;
  remote3: number;
  github: number;
  cryptojobslist: number;
  beincrypto: number;
  coinledger: number;
  web3career: number;
}

export const mockDomainTrends: DomainTrendPoint[] = [
  { date: '12 Dec', remote3: 45, github: 38, cryptojobslist: 25, beincrypto: 20, coinledger: 18, web3career: 15 },
  { date: '13 Dec', remote3: 52, github: 42, cryptojobslist: 28, beincrypto: 22, coinledger: 20, web3career: 18 },
  { date: '14 Dec', remote3: 48, github: 35, cryptojobslist: 30, beincrypto: 25, coinledger: 22, web3career: 20 },
  { date: '15 Dec', remote3: 65, github: 48, cryptojobslist: 35, beincrypto: 28, coinledger: 25, web3career: 22 },
  { date: '16 Dec', remote3: 58, github: 52, cryptojobslist: 32, beincrypto: 30, coinledger: 28, web3career: 25 },
  { date: '17 Dec', remote3: 70, github: 55, cryptojobslist: 38, beincrypto: 32, coinledger: 30, web3career: 28 },
];

// Source URLs for the main table
export interface SourceURLItem {
  id: string;
  url: string;
  domain: string;
  tags: { label: string; type: 'default' | 'success' | 'warning' | 'danger' }[];
  aiModels: string[];
  usageCount: number;
  lastSeen: string;
  firstIdentified: string;
  hasOutreach?: boolean;
  status: 'opportunity' | 'mentions_you' | 'your_website';
}

export const mockSourceURLItems: SourceURLItem[] = [
  { id: '1', url: 'https://www.remote3.co/', domain: 'remote3.co', tags: [{ label: 'Other', type: 'default' }, { label: 'You', type: 'default' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 122, lastSeen: 'Dec 18', firstIdentified: 'Jun 3', status: 'your_website' },
  { id: '2', url: 'https://github.com/Shubham0850/awesome-we...', domain: 'github.com', tags: [{ label: 'Documentation', type: 'default' }, { label: 'Mentions you', type: 'success' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 104, lastSeen: 'Dec 18', firstIdentified: 'Jul 5', hasOutreach: true, status: 'mentions_you' },
  { id: '3', url: 'https://coinledger.io/tools/best-crypto-and-bloc...', domain: 'coinledger.io', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 53, lastSeen: 'Dec 18', firstIdentified: 'Jul 5', hasOutreach: true, status: 'opportunity' },
  { id: '4', url: 'https://beincrypto.com/jobs/', domain: 'beincrypto.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 52, lastSeen: 'Dec 18', firstIdentified: 'Jul 3', hasOutreach: true, status: 'opportunity' },
  { id: '5', url: 'https://thecryptorecruiters.io/blockchain-jobs/', domain: 'thecryptorecruiters.io', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini'], usageCount: 28, lastSeen: 'Dec 18', firstIdentified: 'Jul 18', hasOutreach: true, status: 'opportunity' },
  { id: '6', url: 'https://www.cryptojobs.com/web3', domain: 'cryptojobs.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT', 'Gemini'], usageCount: 27, lastSeen: 'Dec 18', firstIdentified: 'Jul 5', hasOutreach: true, status: 'opportunity' },
  { id: '7', url: 'https://web3.career/', domain: 'web3.career', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 21, lastSeen: 'Dec 18', firstIdentified: 'Jun 3', status: 'opportunity' },
  { id: '8', url: 'https://cryptojobslist.com/', domain: 'cryptojobslist.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini', 'ChatGPT'], usageCount: 20, lastSeen: 'Dec 18', firstIdentified: 'Jun 3', hasOutreach: true, status: 'opportunity' },
  { id: '9', url: 'https://cryptocurrencyjobs.co/web3/', domain: 'cryptocurrencyjobs.co', tags: [{ label: 'E-commerce', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT', 'Gemini'], usageCount: 18, lastSeen: 'Dec 18', firstIdentified: 'Jul 9', hasOutreach: true, status: 'opportunity' },
  { id: '10', url: 'https://www.calyptus.co/blog/the-best-web3-jo...', domain: 'calyptus.co', tags: [{ label: 'Blog', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT', 'Gemini'], usageCount: 16, lastSeen: 'Dec 18', firstIdentified: 'Jul 5', hasOutreach: true, status: 'opportunity' },
  { id: '11', url: 'https://cryptojobslist.com/web3', domain: 'cryptojobslist.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT', 'Gemini'], usageCount: 13, lastSeen: 'Dec 18', firstIdentified: 'Jun 3', status: 'opportunity' },
  { id: '12', url: 'https://web3.career/post-web3-job', domain: 'web3.career', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT'], usageCount: 12, lastSeen: 'Dec 18', firstIdentified: 'Nov 2', status: 'opportunity' },
  { id: '13', url: 'https://www.remote3.co/blog-post/10-best-job-...', domain: 'remote3.co', tags: [{ label: 'Other', type: 'default' }, { label: 'You', type: 'default' }], aiModels: ['ChatGPT'], usageCount: 9, lastSeen: 'Dec 18', firstIdentified: 'Jul 5', status: 'your_website' },
  { id: '14', url: 'https://laborx.com/', domain: 'laborx.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT', 'Gemini'], usageCount: 9, lastSeen: 'Dec 18', firstIdentified: 'Jun 3', status: 'opportunity' },
  { id: '15', url: 'https://findweb3.com/jobs', domain: 'findweb3.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT'], usageCount: 9, lastSeen: 'Dec 18', firstIdentified: 'Jul 9', hasOutreach: true, status: 'opportunity' },
  { id: '16', url: 'https://www.reddit.com//r/web3/comments/1nsz...', domain: 'reddit.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Perplexity'], usageCount: 8, lastSeen: 'Dec 18', firstIdentified: 'Nov 2', status: 'opportunity' },
  { id: '17', url: 'https://workquest.co/', domain: 'workquest.co', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini'], usageCount: 8, lastSeen: 'Dec 18', firstIdentified: 'Jul 13', hasOutreach: true, status: 'opportunity' },
  { id: '18', url: 'https://www.linkedin.com/jobs/web3-job-jobs-w...', domain: 'linkedin.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['ChatGPT'], usageCount: 7, lastSeen: 'Dec 18', firstIdentified: 'Jul 12', status: 'opportunity' },
  { id: '19', url: 'https://www.cryptotask.org/en', domain: 'cryptotask.org', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini'], usageCount: 7, lastSeen: 'Dec 18', firstIdentified: 'Jul 9', hasOutreach: true, status: 'opportunity' },
  { id: '20', url: 'https://www.binance.com/en/square/post/502086', domain: 'binance.com', tags: [{ label: 'Other', type: 'default' }, { label: 'Not mentioned', type: 'danger' }], aiModels: ['Gemini'], usageCount: 6, lastSeen: 'Dec 18', firstIdentified: 'Oct 13', status: 'opportunity' },
];

// Competitor data
export interface Competitor {
  id: string;
  name: string;
  website: string;
  score: number;
  trend: number;
  icon?: string;
}

export const mockCompetitors: Competitor[] = [
  { id: '1', name: 'Remote3', website: 'remote3.co', score: 72, trend: 5.2, icon: '📡' },
  { id: '2', name: 'CryptoJobsList', website: 'cryptojobslist.com', score: 50.4, trend: 3.1, icon: '🟢' },
  { id: '3', name: 'Web3.career', website: 'web3.career', score: 37.7, trend: -1.5, icon: '🌐' },
  { id: '4', name: 'Wellfound', website: 'wellfound.com', score: 36.2, trend: 7.3, icon: 'W:' },
  { id: '5', name: 'LinkedIn', website: 'linkedin.com', score: 33.5, trend: 2.0, icon: 'in' },
  { id: '6', name: 'Indeed', website: 'indeed.com', score: 29.2, trend: 1.5, icon: 'i' },
  { id: '7', name: 'RemoteOK', website: 'remoteok.com', score: 27.5, trend: -0.8, icon: '🌍' },
  { id: '8', name: 'CryptocurrencyJobs.co', website: 'cryptocurrencyjobs.co', score: 27.2, trend: 4.2, icon: '🪙' },
  { id: '9', name: 'Glassdoor', website: 'glassdoor.com', score: 25, trend: 0.5, icon: '🚪' },
  { id: '10', name: 'AngelList', website: 'angel.co', score: 25, trend: 1.8, icon: 'W:' },
];

// LLM visibility data
export interface LLMVisibility {
  id: string;
  name: string;
  score: number;
  color: string;
  icon: string;
}

export const mockLLMVisibility: LLMVisibility[] = [
  { id: '1', name: 'Gemini', score: 99.79, color: '#4285F4', icon: '✦' },
  { id: '2', name: 'ChatGPT', score: 74.74, color: '#10B981', icon: '◎' },
  { id: '3', name: 'Perplexity', score: 46.4, color: '#3B82F6', icon: '◉' },
  { id: '4', name: 'Claude', score: 38.2, color: '#8B5CF6', icon: '◈' },
  { id: '5', name: 'Bing AI', score: 22.5, color: '#F59E0B', icon: '◇' },
];

// Recent mentions data
export interface RecentMention {
  id: string;
  source: string;
  sourceIcon: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  brandName: string;
  context: string;
  fullText: string;
  timestamp: string;
  url?: string;
}

export const mockRecentMentions: RecentMention[] = [
  { 
    id: '1', 
    source: 'ChatGPT', 
    sourceIcon: '◎',
    sentiment: 'positive',
    brandName: 'Remote3',
    context: '.co – A growing job board focused on remote Web3 opportunities, including developer, design, and community roles.',
    fullText: 'Remote3.co – A growing job board focused on remote Web3 opportunities, including developer, design, and community roles. They have a strong presence in the blockchain and cryptocurrency space.',
    timestamp: '2 hours ago',
    url: 'https://chat.openai.com'
  },
  { 
    id: '2', 
    source: 'Gemini 2.5 Flash', 
    sourceIcon: '✦',
    sentiment: 'positive',
    brandName: 'Remote3',
    context: '.co is a prominent job board specializing in Web3 and crypto jobs, listing hundreds of new positions daily with real-time updates available through their Telegram group.',
    fullText: 'Here are some of the top remote Web3 job boards to help you find opportunities in blockchain, cryptocurrency, DeFi, and NFTs: Remote3.co is a prominent job board specializing in Web3 and crypto jobs, listing hundreds of new positions daily with real-time updates available through their Telegram group.',
    timestamp: '5 hours ago',
    url: 'https://gemini.google.com'
  },
  { 
    id: '3', 
    source: 'Perplexity', 
    sourceIcon: '◉',
    sentiment: 'positive',
    brandName: 'Remote3',
    context: '.co — specializes in Web3, crypto, blockchain, DeFi, and NFT roles with frequent new postings and real-time alerts.',
    fullText: 'Top picks - Remote3.co — specializes in Web3, crypto, blockchain, DeFi, and NFT roles with frequent new postings and real-time alerts.',
    timestamp: '1 day ago',
    url: 'https://perplexity.ai'
  },
  { 
    id: '4', 
    source: 'ChatGPT', 
    sourceIcon: '◎',
    sentiment: 'neutral',
    brandName: 'Remote3',
    context: '.co – remote-first Web3 job board.',
    fullText: 'Remote3.co – remote-first Web3 job board. Good option for finding blockchain development positions.',
    timestamp: '2 days ago',
    url: 'https://chat.openai.com'
  },
  { 
    id: '5', 
    source: 'Gemini 2.5 Flash', 
    sourceIcon: '✦',
    sentiment: 'neutral',
    brandName: 'Remote3',
    context: 'You can also create a Web3 portfolio on platforms like...',
    fullText: 'You can also create a Web3 portfolio on platforms like Remote3.co, Web3.career, and CryptoJobsList to increase your visibility.',
    timestamp: '3 days ago',
    url: 'https://gemini.google.com'
  },
];

// Visibility score history for chart
export interface VisibilityDataPoint {
  date: string;
  score: number;
  competitorAvg?: number;
}

export const mockVisibilityHistory: VisibilityDataPoint[] = [
  { date: '21 Nov', score: 68, competitorAvg: 45 },
  { date: '25 Nov', score: 72, competitorAvg: 46 },
  { date: '29 Nov', score: 65, competitorAvg: 44 },
  { date: '3 Dec', score: 78, competitorAvg: 48 },
  { date: '7 Dec', score: 70, competitorAvg: 47 },
  { date: '11 Dec', score: 75, competitorAvg: 49 },
  { date: '16 Dec', score: 72, competitorAvg: 50 },
];

// Source/URL data
export interface SourceURL {
  id: string;
  url: string;
  aiModels: string[];
  mentionCount: number;
  lastChecked: string;
  firstIdentified: string;
}

export const mockSourceURLs: SourceURL[] = [
  {
    id: '1',
    url: 'https://example.com/blog/ai-tools',
    aiModels: ['ChatGPT', 'Claude', 'Perplexity'],
    mentionCount: 156,
    lastChecked: '2024-01-15',
    firstIdentified: '2023-11-20',
  },
  {
    id: '2',
    url: 'https://example.com/products/overview',
    aiModels: ['ChatGPT', 'Gemini'],
    mentionCount: 89,
    lastChecked: '2024-01-15',
    firstIdentified: '2023-12-05',
  },
  {
    id: '3',
    url: 'https://example.com/pricing',
    aiModels: ['Claude', 'Perplexity'],
    mentionCount: 67,
    lastChecked: '2024-01-14',
    firstIdentified: '2023-10-18',
  },
  {
    id: '4',
    url: 'https://example.com/features',
    aiModels: ['ChatGPT'],
    mentionCount: 45,
    lastChecked: '2024-01-15',
    firstIdentified: '2023-12-10',
  },
  {
    id: '5',
    url: 'https://example.com/case-studies',
    aiModels: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    mentionCount: 234,
    lastChecked: '2024-01-15',
    firstIdentified: '2023-09-01',
  },
];

// Top domains data
export interface TopDomain {
  id: string;
  domain: string;
  mentions: number;
  trend: number;
  icon?: string;
}

export const mockTopDomains: TopDomain[] = [
  { id: '1', domain: 'chat.openai.com', mentions: 1250, trend: 12.5 },
  { id: '2', domain: 'claude.ai', mentions: 890, trend: 8.3 },
  { id: '3', domain: 'perplexity.ai', mentions: 567, trend: 15.2 },
  { id: '4', domain: 'gemini.google.com', mentions: 432, trend: -2.1 },
  { id: '5', domain: 'bing.com/chat', mentions: 321, trend: 5.7 },
];

// Web Analytics data
export interface WebAnalytics {
  liveVisitors: number;
  totalVisitors: number;
  pageViews: number;
  avgDuration: string;
  churnRate: number;
}

export const mockWebAnalytics: WebAnalytics = {
  liveVisitors: 127,
  totalVisitors: 45892,
  pageViews: 128456,
  avgDuration: '3m 24s',
  churnRate: 42.5,
};

// Visitor pages data
export interface VisitorPage {
  id: string;
  url: string;
  visitors: number;
  views: number;
}

export const mockVisitorPages: VisitorPage[] = [
  { id: '1', url: '/home', visitors: 3420, views: 8560 },
  { id: '2', url: '/products', visitors: 2890, views: 5780 },
  { id: '3', url: '/pricing', visitors: 2156, views: 4312 },
  { id: '4', url: '/blog', visitors: 1890, views: 6540 },
  { id: '5', url: '/contact', visitors: 987, views: 1456 },
  { id: '6', url: '/about', visitors: 876, views: 1234 },
  { id: '7', url: '/features', visitors: 765, views: 1089 },
  { id: '8', url: '/docs', visitors: 654, views: 987 },
  { id: '9', url: '/api', visitors: 543, views: 876 },
  { id: '10', url: '/careers', visitors: 432, views: 654 },
  { id: '11', url: '/support', visitors: 321, views: 543 },
  { id: '12', url: '/faq', visitors: 234, views: 432 },
];

// Referrer data
export interface Referrer {
  id: string;
  source: string;
  visitors: number;
}

export const mockReferrers: Referrer[] = [
  { id: '1', source: 'google.com', visitors: 12560 },
  { id: '2', source: 'twitter.com', visitors: 4532 },
  { id: '3', source: 'linkedin.com', visitors: 3210 },
  { id: '4', source: 'facebook.com', visitors: 2890 },
  { id: '5', source: 'direct', visitors: 8765 },
  { id: '6', source: 'reddit.com', visitors: 2345 },
  { id: '7', source: 'youtube.com', visitors: 1987 },
  { id: '8', source: 'github.com', visitors: 1654 },
  { id: '9', source: 'producthunt.com', visitors: 1432 },
  { id: '10', source: 'hackernews', visitors: 1234 },
  { id: '11', source: 'medium.com', visitors: 987 },
  { id: '12', source: 'dev.to', visitors: 765 },
];

// Country data
export interface Country {
  id: string;
  country: string;
  code: string;
  visitors: number;
}

export const mockCountries: Country[] = [
  { id: '1', country: 'United States', code: 'US', visitors: 18540 },
  { id: '2', country: 'United Kingdom', code: 'GB', visitors: 8920 },
  { id: '3', country: 'Germany', code: 'DE', visitors: 5640 },
  { id: '4', country: 'Canada', code: 'CA', visitors: 4320 },
  { id: '5', country: 'Australia', code: 'AU', visitors: 3210 },
  { id: '6', country: 'France', code: 'FR', visitors: 2980 },
  { id: '7', country: 'Netherlands', code: 'NL', visitors: 2456 },
  { id: '8', country: 'India', code: 'IN', visitors: 2234 },
  { id: '9', country: 'Brazil', code: 'BR', visitors: 1987 },
  { id: '10', country: 'Japan', code: 'JP', visitors: 1765 },
  { id: '11', country: 'Spain', code: 'ES', visitors: 1543 },
  { id: '12', country: 'Italy', code: 'IT', visitors: 1321 },
];

// Device data
export interface Device {
  id: string;
  device: string;
  visitors: number;
}

export const mockDevices: Device[] = [
  { id: '1', device: 'Desktop', visitors: 25670 },
  { id: '2', device: 'Mobile', visitors: 15430 },
  { id: '3', device: 'Tablet', visitors: 4792 },
  { id: '4', device: 'Smart TV', visitors: 1234 },
  { id: '5', device: 'Gaming Console', visitors: 876 },
  { id: '6', device: 'Wearable', visitors: 543 },
];

// LLM Analytics data
export interface LLMAnalytics {
  liveBots: number;
  botPageviews: number;
}

export const mockLLMAnalytics: LLMAnalytics = {
  liveBots: 23,
  botPageviews: 34567,
};

// Bot data
export type BotType = 'training' | 'search_indexing' | 'user_action' | 'search_optimization';

export interface Bot {
  id: string;
  name: string;
  count: number;
  purpose: string;
  type: BotType;
  icon?: string;
}

export const mockBots: Bot[] = [
  { id: '1', name: 'Googlebot', count: 137085, purpose: 'Google search indexing', type: 'search_indexing', icon: 'google' },
  { id: '2', name: 'Generic Bot', count: 93631, purpose: 'Various crawling purposes', type: 'search_indexing', icon: 'generic' },
  { id: '3', name: 'AhrefsBot', count: 19421, purpose: 'SEO analysis and backlink tracking', type: 'search_indexing', icon: 'ahrefs' },
  { id: '4', name: 'Bingbot', count: 17351, purpose: 'Bing search indexing', type: 'search_indexing', icon: 'bing' },
  { id: '5', name: 'Bytespider', count: 15195, purpose: 'TikTok/ByteDance crawler', type: 'training', icon: 'bytedance' },
  { id: '6', name: 'OAI-SearchBot', count: 12870, purpose: 'OpenAI search indexing', type: 'search_indexing', icon: 'openai' },
  { id: '7', name: 'ChatGPT-User', count: 10933, purpose: 'User-initiated ChatGPT queries', type: 'user_action', icon: 'chatgpt' },
  { id: '8', name: 'GPTBot', count: 8800, purpose: 'ChatGPT training and inference', type: 'training', icon: 'openai' },
  { id: '9', name: 'ClaudeBot', count: 6420, purpose: 'Claude AI training', type: 'training', icon: 'claude' },
  { id: '10', name: 'Claude-SearchBot', count: 5230, purpose: 'Claude search optimization', type: 'search_optimization', icon: 'claude' },
  { id: '11', name: 'Claude-User', count: 4890, purpose: 'User-initiated Claude queries', type: 'user_action', icon: 'claude' },
  { id: '12', name: 'PerplexityBot', count: 4120, purpose: 'Perplexity search indexing', type: 'search_indexing', icon: 'perplexity' },
  { id: '13', name: 'Perplexity-User', count: 3540, purpose: 'User-initiated Perplexity queries', type: 'user_action', icon: 'perplexity' },
];

// Bot type labels and colors
export const botTypeConfig: Record<BotType, { label: string; color: string; bgColor: string }> = {
  user_action: { label: 'User Action', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  training: { label: 'Training', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  search_indexing: { label: 'Search Indexing', color: 'text-green-700', bgColor: 'bg-green-100' },
  search_optimization: { label: 'Search Optimization', color: 'text-purple-700', bgColor: 'bg-purple-100' },
};

// Bot page data
export interface BotPage {
  id: string;
  url: string;
  visitors: number;
  views: number;
}

export const mockBotPages: BotPage[] = [
  { id: '1', url: '/', visitors: 842, views: 10022 },
  { id: '2', url: '/error', visitors: 289, views: 1325 },
  { id: '3', url: '/remote-web3-jobs', visitors: 202, views: 816 },
  { id: '4', url: '/web3-internships', visitors: 145, views: 472 },
  { id: '5', url: '/remote/smart-contract-jobs', visitors: 127, views: 325 },
  { id: '6', url: '/remote/devops-jobs', visitors: 127, views: 295 },
  { id: '7', url: '/remote/rust', visitors: 124, views: 324 },
  { id: '8', url: '/remote/full-stack-jobs', visitors: 121, views: 283 },
  { id: '9', url: '/blog/ai-guide', visitors: 89, views: 245 },
  { id: '10', url: '/documentation', visitors: 67, views: 187 },
  { id: '11', url: '/api-reference', visitors: 56, views: 165 },
  { id: '12', url: '/features', visitors: 45, views: 154 },
  { id: '13', url: '/pricing', visitors: 34, views: 132 },
];

// Chart data for analytics
export interface ChartDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
}

export const mockChartData: ChartDataPoint[] = [
  { date: 'Jan 1', visitors: 1200, pageViews: 3400 },
  { date: 'Jan 2', visitors: 1350, pageViews: 3800 },
  { date: 'Jan 3', visitors: 1100, pageViews: 3200 },
  { date: 'Jan 4', visitors: 1450, pageViews: 4100 },
  { date: 'Jan 5', visitors: 1600, pageViews: 4500 },
  { date: 'Jan 6', visitors: 1400, pageViews: 3900 },
  { date: 'Jan 7', visitors: 1550, pageViews: 4300 },
  { date: 'Jan 8', visitors: 1700, pageViews: 4800 },
  { date: 'Jan 9', visitors: 1500, pageViews: 4200 },
  { date: 'Jan 10', visitors: 1800, pageViews: 5100 },
  { date: 'Jan 11', visitors: 1650, pageViews: 4600 },
  { date: 'Jan 12', visitors: 1900, pageViews: 5400 },
  { date: 'Jan 13', visitors: 1750, pageViews: 4900 },
  { date: 'Jan 14', visitors: 2000, pageViews: 5700 },
];

// Bot request data for bar chart
export interface BotRequestData {
  date: string;
  chatgpt: number;
  claude: number;
  perplexity: number;
  gemini: number;
  others: number;
}

export const mockBotRequestData: BotRequestData[] = [
  { date: 'Mon', chatgpt: 450, claude: 320, perplexity: 180, gemini: 120, others: 90 },
  { date: 'Tue', chatgpt: 520, claude: 380, perplexity: 210, gemini: 145, others: 110 },
  { date: 'Wed', chatgpt: 480, claude: 340, perplexity: 190, gemini: 130, others: 95 },
  { date: 'Thu', chatgpt: 590, claude: 420, perplexity: 240, gemini: 160, others: 125 },
  { date: 'Fri', chatgpt: 550, claude: 390, perplexity: 220, gemini: 150, others: 115 },
  { date: 'Sat', chatgpt: 320, claude: 230, perplexity: 130, gemini: 90, others: 70 },
  { date: 'Sun', chatgpt: 280, claude: 200, perplexity: 110, gemini: 75, others: 60 },
];

// Live visitor details
export interface LiveVisitorDetail {
  id: string;
  page: string;
  referrer: string;
  country: string;
  device: string;
}

export const mockLiveVisitors: LiveVisitorDetail[] = [
  { id: '1', page: '/pricing', referrer: 'google.com', country: 'US', device: 'Desktop' },
  { id: '2', page: '/features', referrer: 'twitter.com', country: 'UK', device: 'Mobile' },
  { id: '3', page: '/blog/ai-guide', referrer: 'linkedin.com', country: 'DE', device: 'Desktop' },
  { id: '4', page: '/home', referrer: 'direct', country: 'CA', device: 'Tablet' },
  { id: '5', page: '/contact', referrer: 'facebook.com', country: 'AU', device: 'Mobile' },
];

// Filter options
export const filterGroups = [
  { value: 'all', label: 'All Groups' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'support', label: 'Support' },
];

export const filterLLMs = [
  { value: 'all', label: 'All LLMs' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'claude', label: 'Claude' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'perplexity', label: 'Perplexity' },
];

export const filterLocations = [
  { value: 'all', label: 'All Locations' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'eu', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
];

export const filterDateRanges = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'all', label: 'All Time' },
];

// Generated Content History
export type ContentType = 'blog' | 'landing' | 'faq' | 'product';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface GeneratedContent {
  id: string;
  keyword: string;
  contentType: ContentType;
  title: string;
  excerpt: string;
  content: string;
  aiModels: string[];
  wordCount: number;
  createdAt: string;
  status: ContentStatus;
  seoScore: number;
  readabilityScore: number;
}

export const contentTypeLabels: Record<ContentType, string> = {
  blog: 'Blog Post',
  landing: 'Landing Page',
  faq: 'FAQ Section',
  product: 'Product Page',
};

export const mockGeneratedContent: GeneratedContent[] = [
  {
    id: '1',
    keyword: 'best AI tools for marketing',
    contentType: 'blog',
    title: '10 Best AI Tools for Marketing in 2024: A Complete Guide',
    excerpt: 'Discover the top AI-powered marketing tools that can transform your campaigns and boost ROI...',
    content: `# 10 Best AI Tools for Marketing in 2024

Marketing has evolved dramatically with the rise of artificial intelligence. Today's AI tools can help you create better content, understand your audience, and optimize your campaigns like never before.

## Why AI Tools Matter for Marketing

AI-powered tools are no longer a luxury—they're a necessity for competitive marketing teams. Here's why:

- **Efficiency**: Automate repetitive tasks and focus on strategy
- **Personalization**: Deliver tailored experiences at scale
- **Data-Driven Insights**: Make decisions backed by AI analysis
- **Cost Reduction**: Do more with less resources

## Top AI Marketing Tools

### 1. ChatGPT for Content Creation
ChatGPT has revolutionized content creation, helping marketers generate ideas, write copy, and edit content faster than ever.

### 2. Jasper AI
Jasper specializes in marketing copy, from blog posts to ad copy, with templates specifically designed for marketers.

### 3. Midjourney for Visual Content
Create stunning visuals for your campaigns without a design team.

## Conclusion

Embracing AI tools is essential for modern marketing success. Start with one tool and gradually expand your AI toolkit.`,
    aiModels: ['ChatGPT', 'Claude'],
    wordCount: 1245,
    createdAt: '2024-12-18T10:30:00Z',
    status: 'published',
    seoScore: 92,
    readabilityScore: 88,
  },
  {
    id: '2',
    keyword: 'how to improve website SEO',
    contentType: 'landing',
    title: 'Boost Your Website SEO - Professional Optimization Services',
    excerpt: 'Get your website to the top of search results with our proven SEO strategies...',
    content: `# Transform Your Online Visibility

## Is Your Website Invisible to Search Engines?

You've built a great website, but no one can find it. Sound familiar? We help businesses like yours climb to the top of search results.

### What We Offer

✅ **Technical SEO Audit**
Complete analysis of your website's technical health

✅ **Content Optimization**
AI-powered content that ranks and converts

✅ **Link Building**
High-quality backlinks from authoritative sources

✅ **Performance Tracking**
Monthly reports showing your progress

### Results That Speak

- 156% average increase in organic traffic
- 3x more leads from search
- Page 1 rankings in 90 days

## Ready to Get Started?

[Schedule a Free Consultation]`,
    aiModels: ['ChatGPT'],
    wordCount: 856,
    createdAt: '2024-12-17T14:20:00Z',
    status: 'draft',
    seoScore: 85,
    readabilityScore: 91,
  },
  {
    id: '3',
    keyword: 'web3 job platforms',
    contentType: 'faq',
    title: 'Frequently Asked Questions About Web3 Jobs',
    excerpt: 'Everything you need to know about finding and landing your dream Web3 job...',
    content: `# Web3 Jobs FAQ

## General Questions

### What is a Web3 job?
Web3 jobs are positions in companies and projects building decentralized applications, blockchain technology, cryptocurrencies, and related technologies.

### Do I need blockchain experience for Web3 jobs?
Not always! Many Web3 companies hire for traditional roles (marketing, design, operations) and teach the blockchain-specific aspects.

### What skills are most in-demand for Web3?
- Solidity development
- Smart contract auditing
- DeFi knowledge
- Community management
- Token economics

## Job Search

### Where can I find Web3 jobs?
Popular platforms include Web3 Career, CryptoJobsList, and specialized Discord communities.

### Are Web3 jobs remote-friendly?
Yes! Most Web3 companies are fully remote and hire globally.

### What's the typical salary range?
Salaries vary widely, but developers often earn $150K-$400K+ depending on experience and role.

## Getting Started

### How do I prepare for Web3 interviews?
Build projects, contribute to open source, and stay active in the community. Knowledge of DAOs, DeFi, and NFTs is helpful.`,
    aiModels: ['Claude', 'Perplexity'],
    wordCount: 678,
    createdAt: '2024-12-16T09:15:00Z',
    status: 'published',
    seoScore: 78,
    readabilityScore: 94,
  },
  {
    id: '4',
    keyword: 'AI productivity software',
    contentType: 'product',
    title: 'AI Productivity Suite - Work Smarter, Not Harder',
    excerpt: 'The all-in-one AI platform that automates your workflow and boosts team productivity...',
    content: `# AI Productivity Suite

## Your Personal AI Assistant for Work

Transform how you work with our comprehensive AI productivity platform.

### Key Features

**Smart Task Management**
Let AI prioritize your tasks based on deadlines, importance, and your work patterns.

**AI Writing Assistant**
Draft emails, reports, and documents in seconds with AI that understands your style.

**Meeting Intelligence**
Automatic transcription, summaries, and action item extraction from all your meetings.

**Workflow Automation**
Connect your tools and let AI handle repetitive tasks.

### Pricing

| Plan | Price | Features |
|------|-------|----------|
| Starter | $19/mo | Basic AI features |
| Pro | $49/mo | Advanced automation |
| Enterprise | Custom | Full suite + support |

### Integration Partners
Works with Slack, Notion, Google Workspace, Microsoft 365, and 50+ more tools.

[Start Free Trial] [Book Demo]`,
    aiModels: ['ChatGPT', 'Gemini'],
    wordCount: 543,
    createdAt: '2024-12-15T16:45:00Z',
    status: 'archived',
    seoScore: 81,
    readabilityScore: 86,
  },
];

// Prompt Analysis Data
export interface PromptAnalysis {
  id: string;
  prompt: string;
  lastUpdated: string;
  visibilityScore: number;
  topPerformingLLM: string;
  presenceByLLM: {
    llm: string;
    percentage: number;
    mentioned: boolean;
  }[];
  visibilityHistory: {
    date: string;
    score: number;
  }[];
  activityTimeline: {
    date: string;
    perplexity: number;
    gemini: number;
    chatgpt: number;
  }[];
  aiResponse: {
    sections: {
      title: string;
      content: string;
      sources: { name: string; url: string }[];
    }[];
  };
  brandMentions: {
    llm: string;
    mentioned: boolean;
  }[];
}

export const mockPromptAnalysis: Record<string, PromptAnalysis> = {
  '1': {
    id: '1',
    prompt: 'Best project management tools for startups',
    lastUpdated: '2025-12-18',
    visibilityScore: 57.47,
    topPerformingLLM: 'Perplexity',
    presenceByLLM: [
      { llm: 'ChatGPT', percentage: 96.55, mentioned: true },
      { llm: 'Perplexity', percentage: 37.93, mentioned: true },
      { llm: 'Gemini', percentage: 37.93, mentioned: true },
      { llm: 'Claude', percentage: 0, mentioned: false },
      { llm: 'Bing AI', percentage: 0, mentioned: false },
    ],
    visibilityHistory: [
      { date: '21 Nov', score: 45 },
      { date: '25 Nov', score: 52 },
      { date: '29 Nov', score: 48 },
      { date: '3 Dec', score: 65 },
      { date: '7 Dec', score: 55 },
      { date: '11 Dec', score: 72 },
      { date: '17 Dec', score: 57 },
    ],
    activityTimeline: [
      { date: 'Dec 1', perplexity: 3, gemini: 2, chatgpt: 4 },
      { date: 'Dec 5', perplexity: 5, gemini: 3, chatgpt: 6 },
      { date: 'Dec 10', perplexity: 4, gemini: 5, chatgpt: 3 },
      { date: 'Dec 15', perplexity: 6, gemini: 4, chatgpt: 5 },
      { date: 'Dec 18', perplexity: 7, gemini: 3, chatgpt: 4 },
    ],
    aiResponse: {
      sections: [
        {
          title: 'Dedicated project management tools',
          content: 'These platforms focus specifically on project management for startups and are usually the best starting point.',
          sources: [
            { name: 'asana.com', url: 'https://asana.com' },
            { name: 'monday.com', url: 'https://monday.com' },
          ],
        },
        {
          title: 'All-in-one workspace tools',
          content: 'Startup-specific boards such as Notion, Coda, and ClickUp combine project management with documentation, making them ideal for small teams.',
          sources: [
            { name: 'notion.so', url: 'https://notion.so' },
            { name: 'clickup.com', url: 'https://clickup.com' },
          ],
        },
      ],
    },
    brandMentions: [
      { llm: 'Perplexity', mentioned: true },
      { llm: 'Gemini 2.5 Flash', mentioned: true },
      { llm: 'ChatGPT', mentioned: true },
    ],
  },
  '2': {
    id: '2',
    prompt: 'How to improve team productivity',
    lastUpdated: '2025-12-18',
    visibilityScore: 72.31,
    topPerformingLLM: 'Claude',
    presenceByLLM: [
      { llm: 'Claude', percentage: 89.12, mentioned: true },
      { llm: 'ChatGPT', percentage: 67.45, mentioned: true },
      { llm: 'Perplexity', percentage: 45.23, mentioned: true },
      { llm: 'Gemini', percentage: 32.11, mentioned: true },
      { llm: 'Bing AI', percentage: 12.5, mentioned: false },
    ],
    visibilityHistory: [
      { date: '21 Nov', score: 68 },
      { date: '25 Nov', score: 71 },
      { date: '29 Nov', score: 69 },
      { date: '3 Dec', score: 75 },
      { date: '7 Dec', score: 72 },
      { date: '11 Dec', score: 74 },
      { date: '17 Dec', score: 72 },
    ],
    activityTimeline: [
      { date: 'Dec 1', perplexity: 4, gemini: 3, chatgpt: 5 },
      { date: 'Dec 5', perplexity: 6, gemini: 4, chatgpt: 7 },
      { date: 'Dec 10', perplexity: 5, gemini: 6, chatgpt: 4 },
      { date: 'Dec 15', perplexity: 7, gemini: 5, chatgpt: 6 },
      { date: 'Dec 18', perplexity: 8, gemini: 4, chatgpt: 5 },
    ],
    aiResponse: {
      sections: [
        {
          title: 'Communication tools',
          content: 'Effective team communication is the foundation of productivity. Tools like Slack and Microsoft Teams help streamline communication.',
          sources: [
            { name: 'slack.com', url: 'https://slack.com' },
            { name: 'teams.microsoft.com', url: 'https://teams.microsoft.com' },
          ],
        },
      ],
    },
    brandMentions: [
      { llm: 'Claude', mentioned: true },
      { llm: 'ChatGPT', mentioned: true },
      { llm: 'Perplexity', mentioned: true },
    ],
  },
  '3': {
    id: '3',
    prompt: 'Best CRM software for small business',
    lastUpdated: '2025-12-18',
    visibilityScore: 68.42,
    topPerformingLLM: 'Perplexity',
    presenceByLLM: [
      { llm: 'Perplexity', percentage: 82.33, mentioned: true },
      { llm: 'ChatGPT', percentage: 54.21, mentioned: true },
      { llm: 'Gemini', percentage: 41.87, mentioned: true },
      { llm: 'Claude', percentage: 28.65, mentioned: false },
      { llm: 'Bing AI', percentage: 15.22, mentioned: false },
    ],
    visibilityHistory: [
      { date: '21 Nov', score: 62 },
      { date: '25 Nov', score: 65 },
      { date: '29 Nov', score: 67 },
      { date: '3 Dec', score: 70 },
      { date: '7 Dec', score: 68 },
      { date: '11 Dec', score: 69 },
      { date: '17 Dec', score: 68 },
    ],
    activityTimeline: [
      { date: 'Dec 1', perplexity: 5, gemini: 2, chatgpt: 3 },
      { date: 'Dec 5', perplexity: 7, gemini: 3, chatgpt: 4 },
      { date: 'Dec 10', perplexity: 6, gemini: 4, chatgpt: 3 },
      { date: 'Dec 15', perplexity: 8, gemini: 3, chatgpt: 5 },
      { date: 'Dec 18', perplexity: 9, gemini: 4, chatgpt: 4 },
    ],
    aiResponse: {
      sections: [
        {
          title: 'Top CRM solutions',
          content: 'For small businesses, CRM tools like HubSpot, Salesforce Essentials, and Pipedrive offer the best balance of features and pricing.',
          sources: [
            { name: 'hubspot.com', url: 'https://hubspot.com' },
            { name: 'salesforce.com', url: 'https://salesforce.com' },
          ],
        },
      ],
    },
    brandMentions: [
      { llm: 'Perplexity', mentioned: true },
      { llm: 'ChatGPT', mentioned: true },
      { llm: 'Gemini', mentioned: true },
    ],
  },
  '4': {
    id: '4',
    prompt: 'AI tools for content creation',
    lastUpdated: '2025-12-18',
    visibilityScore: 91.23,
    topPerformingLLM: 'ChatGPT',
    presenceByLLM: [
      { llm: 'ChatGPT', percentage: 98.45, mentioned: true },
      { llm: 'Claude', percentage: 87.32, mentioned: true },
      { llm: 'Perplexity', percentage: 76.54, mentioned: true },
      { llm: 'Gemini', percentage: 65.21, mentioned: true },
      { llm: 'Bing AI', percentage: 42.11, mentioned: true },
    ],
    visibilityHistory: [
      { date: '21 Nov', score: 85 },
      { date: '25 Nov', score: 88 },
      { date: '29 Nov', score: 87 },
      { date: '3 Dec', score: 92 },
      { date: '7 Dec', score: 90 },
      { date: '11 Dec', score: 93 },
      { date: '17 Dec', score: 91 },
    ],
    activityTimeline: [
      { date: 'Dec 1', perplexity: 8, gemini: 6, chatgpt: 10 },
      { date: 'Dec 5', perplexity: 10, gemini: 7, chatgpt: 12 },
      { date: 'Dec 10', perplexity: 9, gemini: 8, chatgpt: 11 },
      { date: 'Dec 15', perplexity: 11, gemini: 7, chatgpt: 13 },
      { date: 'Dec 18', perplexity: 12, gemini: 8, chatgpt: 14 },
    ],
    aiResponse: {
      sections: [
        {
          title: 'AI writing assistants',
          content: 'AI-powered writing tools like Jasper, Copy.ai, and Writesonic can help create marketing copy, blog posts, and social media content.',
          sources: [
            { name: 'jasper.ai', url: 'https://jasper.ai' },
            { name: 'copy.ai', url: 'https://copy.ai' },
          ],
        },
      ],
    },
    brandMentions: [
      { llm: 'ChatGPT', mentioned: true },
      { llm: 'Claude', mentioned: true },
      { llm: 'Perplexity', mentioned: true },
    ],
  },
  '5': {
    id: '5',
    prompt: 'where to find web3 jobs',
    lastUpdated: '2025-12-18',
    visibilityScore: 57.47,
    topPerformingLLM: 'Perplexity',
    presenceByLLM: [
      { llm: 'ChatGPT', percentage: 96.55, mentioned: true },
      { llm: 'Perplexity', percentage: 37.93, mentioned: true },
      { llm: 'Gemini', percentage: 37.93, mentioned: true },
      { llm: 'Claude', percentage: 0, mentioned: false },
      { llm: 'Bing AI', percentage: 0, mentioned: false },
    ],
    visibilityHistory: [
      { date: '21 Nov', score: 45 },
      { date: '25 Nov', score: 52 },
      { date: '29 Nov', score: 48 },
      { date: '3 Dec', score: 65 },
      { date: '7 Dec', score: 55 },
      { date: '11 Dec', score: 72 },
      { date: '17 Dec', score: 57 },
    ],
    activityTimeline: [
      { date: 'Dec 1', perplexity: 3, gemini: 2, chatgpt: 4 },
      { date: 'Dec 5', perplexity: 5, gemini: 3, chatgpt: 6 },
      { date: 'Dec 10', perplexity: 4, gemini: 5, chatgpt: 3 },
      { date: 'Dec 15', perplexity: 6, gemini: 4, chatgpt: 5 },
      { date: 'Dec 18', perplexity: 7, gemini: 3, chatgpt: 4 },
    ],
    aiResponse: {
      sections: [
        {
          title: 'Dedicated Web3 job boards',
          content: 'These platforms focus specifically on crypto, blockchain, and Web3 roles and are usually the best starting point.',
          sources: [
            { name: 'beincrypto.com', url: 'https://beincrypto.com' },
            { name: 'remote3.co', url: 'https://remote3.co' },
            { name: 'findweb3.com', url: 'https://findweb3.com' },
          ],
        },
        {
          title: 'General job sites and startup hubs',
          content: 'Mainstream job platforms also have a growing number of Web3 listings. LinkedIn, Indeed, and Glassdoor show thousands of "Web3", "crypto", "blockchain", and "smart contract" roles worldwide.',
          sources: [
            { name: 'wellfound.com', url: 'https://wellfound.com' },
            { name: 'linkedin.com', url: 'https://linkedin.com' },
          ],
        },
        {
          title: 'Communities and networking',
          content: 'Many strong Web3 opportunities are shared first inside communities before hitting boards. Join Discords and Telegram groups of major protocols, DAOs, and ecosystems.',
          sources: [
            { name: 'beincrypto.com', url: 'https://beincrypto.com' },
          ],
        },
        {
          title: 'Freelance and bounties',
          content: 'If you are open to contract work, short-term tasks can be a good entry point. Freelance platforms such as Upwork and Fiverr increasingly list Web3-related gigs.',
          sources: [
            { name: 'cryptojobs.com', url: 'https://cryptojobs.com' },
          ],
        },
        {
          title: 'How to search effectively',
          content: 'Targeted searches and a strong profile make a big difference in response rates. Use specific keywords and tailor your profile to highlight Web3-relevant skills.',
          sources: [
            { name: 'web3.career', url: 'https://web3.career' },
            { name: 'wellfound.com', url: 'https://wellfound.com' },
          ],
        },
      ],
    },
    brandMentions: [
      { llm: 'Perplexity', mentioned: true },
      { llm: 'Gemini 2.5 Flash', mentioned: true },
      { llm: 'ChatGPT', mentioned: true },
    ],
  },
};
