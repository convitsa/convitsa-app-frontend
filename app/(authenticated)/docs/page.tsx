'use client';

import React, { useState } from 'react';
import {
  Search,
  Book,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  Info,
  Code,
  Copy,
  Check,
  Play,
  FileText,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/store/hooks/useToast';

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  content: string;
}

const docSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Play,
    articles: [
      { id: '1', title: 'Quick Start Guide', content: '' },
      { id: '2', title: 'Creating Your Account', content: '' },
      { id: '3', title: 'Adding Your First Domain', content: '' },
    ],
  },
  {
    id: 'domain-verification',
    title: 'Domain Verification',
    icon: FileText,
    articles: [
      { id: '4', title: 'DNS Verification Methods', content: '' },
      { id: '5', title: 'CNAME Record Setup', content: '' },
      { id: '6', title: 'TXT Record Setup', content: '' },
      { id: '7', title: 'Troubleshooting Verification', content: '' },
    ],
  },
  {
    id: 'ai-optimization',
    title: 'AI Optimization Guide',
    icon: Book,
    articles: [
      { id: '8', title: 'Understanding AI Visibility', content: '' },
      { id: '9', title: 'llms.txt Best Practices', content: '' },
      { id: '10', title: 'Structured Data Implementation', content: '' },
      { id: '11', title: 'Content Optimization Tips', content: '' },
    ],
  },
  {
    id: 'content-management',
    title: 'Content Management',
    icon: FileText,
    articles: [
      { id: '12', title: 'Creating Content Files', content: '' },
      { id: '13', title: 'Using the Editor', content: '' },
      { id: '14', title: 'AI Content Generation', content: '' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Code,
    articles: [
      { id: '15', title: 'Google Search Console', content: '' },
      { id: '16', title: 'WordPress Integration', content: '' },
      { id: '17', title: 'Webhooks Setup', content: '' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: Code,
    articles: [
      { id: '18', title: 'Authentication', content: '' },
      { id: '19', title: 'Endpoints Overview', content: '' },
      { id: '20', title: 'Rate Limits', content: '' },
    ],
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircle,
    articles: [
      { id: '21', title: 'Common Questions', content: '' },
      { id: '22', title: 'Billing Questions', content: '' },
      { id: '23', title: 'Technical Questions', content: '' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: AlertCircle,
    articles: [
      { id: '24', title: 'Common Issues', content: '' },
      { id: '25', title: 'Error Messages', content: '' },
      { id: '26', title: 'Getting Support', content: '' },
    ],
  },
];

const selectedArticleContent = `
# Understanding AI Visibility

AI visibility refers to how well your website's content can be discovered, understood, and cited by AI systems like ChatGPT, Claude, Gemini, and other large language models.

## Why AI Visibility Matters

As AI-powered search and assistants become more prevalent, ensuring your content is optimized for these systems is crucial for:

- **Brand Visibility**: Get mentioned in AI-generated responses
- **Traffic Generation**: Drive referral traffic from AI citations
- **Authority Building**: Establish expertise in your field
- **Future-Proofing**: Stay ahead of the shift to AI-first search

## Key Factors Affecting AI Visibility

### 1. Content Structure

AI systems prefer well-structured content with clear headings, concise paragraphs, and logical organization.

\`\`\`markdown
# Main Topic
## Subtopic 1
Brief explanation...

## Subtopic 2
Brief explanation...
\`\`\`

### 2. llms.txt File

This file helps AI crawlers understand your website's purpose and content structure.

\`\`\`text
# Example llms.txt
name: Your Company Name
description: Brief description of your business
services:
  - Service 1
  - Service 2
\`\`\`

### 3. Structured Data

Implementing Schema.org markup helps AI systems understand your content context.

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com"
}
\`\`\`

## Best Practices

1. **Be Concise**: AI systems prefer clear, direct information
2. **Use Headings**: Structure content with proper H1-H6 hierarchy
3. **Include Facts**: Verifiable data improves citation likelihood
4. **Update Regularly**: Fresh content is prioritized by AI crawlers
5. **Optimize Metadata**: Ensure meta descriptions are accurate and helpful

> **Pro Tip**: Use the Convitsa AI Assistant to analyze your content and get personalized optimization recommendations.

## Measuring Your Progress

Track your AI visibility score in the Analytics dashboard to see how your optimizations are improving your rankings over time.

---

*Need help? Contact our support team or use the AI Assistant for personalized guidance.*
`;

export default function DocsPage() {
  const { success: showSuccess } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('ai-optimization');
  const [selectedArticle, setSelectedArticle] = useState('8');
  const [copied, setCopied] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    showSuccess('Code copied!');
  };

  const handleFeedback = (type: 'helpful' | 'not-helpful') => {
    setFeedback(type);
    showSuccess(type === 'helpful' ? 'Thanks for your feedback!' : 'We\'ll work on improving this article');
  };

  const renderContent = (content: string) => {
    // Simple markdown-like rendering
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let codeBlockId = 0;

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          const currentId = `code-${codeBlockId++}`;
          elements.push(
            <div key={index} className="relative my-4 rounded-xl bg-gray-900 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                <span className="text-xs text-gray-400">{codeLanguage || 'code'}</span>
                <button
                  onClick={() => copyCode(codeContent, currentId)}
                  className="p-1 hover:bg-gray-700 rounded transition-colors"
                >
                  {copied === currentId ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-100">{codeContent}</code>
              </pre>
            </div>
          );
          codeContent = '';
          inCodeBlock = false;
        } else {
          // Start code block
          codeLanguage = line.slice(3);
          inCodeBlock = true;
        }
      } else if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line;
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith('> ')) {
        elements.push(
          <div key={index} className="my-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl">
            <p className="text-blue-800">{line.slice(2)}</p>
          </div>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*: (.+)/);
        if (match) {
          elements.push(
            <li key={index} className="ml-4 my-1">
              <strong className="text-gray-900">{match[1]}</strong>: {match[2]}
            </li>
          );
        }
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ')) {
        elements.push(
          <li key={index} className="ml-4 my-1 text-gray-600">
            {line.slice(3)}
          </li>
        );
      } else if (line.startsWith('---')) {
        elements.push(<hr key={index} className="my-8 border-gray-200" />);
      } else if (line.startsWith('*') && line.endsWith('*')) {
        elements.push(
          <p key={index} className="text-sm text-gray-500 italic my-2">
            {line.slice(1, -1)}
          </p>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={index} className="text-gray-600 my-2 leading-relaxed">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)] pt-12 lg:pt-0">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 flex-shrink-0 overflow-y-auto">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search docs... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {docSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() => setSelectedSection(selectedSection === section.id ? '' : section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  selectedSection === section.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium flex-1">{section.title}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedSection === section.id ? 'rotate-90' : ''}`} />
              </button>
              
              {selectedSection === section.id && (
                <div className="ml-7 mt-1 space-y-1">
                  {section.articles.map((article) => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article.id)}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                        selectedArticle === article.id 
                          ? 'bg-primary text-white' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {article.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Card className="min-h-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <span>Docs</span>
            <ChevronRight className="w-4 h-4" />
            <span>AI Optimization Guide</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">Understanding AI Visibility</span>
          </div>

          {/* Article Content */}
          <div className="prose prose-gray max-w-none">
            {renderContent(selectedArticleContent)}
          </div>

          {/* Feedback */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Was this helpful?</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleFeedback('helpful')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'helpful' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleFeedback('not-helpful')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'not-helpful' ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500 mb-2">Need more help?</p>
                <Button variant="outline" leftIcon={<HelpCircle className="w-4 h-4" />}>
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar - Table of Contents */}
      <div className="w-48 flex-shrink-0 hidden xl:block">
        <div className="sticky top-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">On this page</p>
          <nav className="space-y-2">
            {['Why AI Visibility Matters', 'Key Factors', 'Content Structure', 'llms.txt File', 'Structured Data', 'Best Practices', 'Measuring Progress'].map((item) => (
              <a
                key={item}
                href="#"
                className="block text-sm text-gray-500 hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}


