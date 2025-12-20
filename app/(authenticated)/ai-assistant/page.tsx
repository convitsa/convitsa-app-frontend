'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Plus,
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  MessageSquare,
  Bot,
  User,
  Clock,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useToast } from '@/lib/store/hooks/useToast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const suggestedPrompts = [
  'How can I improve my AI visibility score?',
  'Analyze my competitors\' strategies',
  'Generate content ideas for my website',
  'What are the latest AI search trends?',
  'Help me optimize my llms.txt file',
  'Explain structured data best practices',
];

const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Score Improvement Tips',
    lastMessage: 'Here are 5 ways to improve your score...',
    timestamp: new Date(Date.now() - 3600000),
    messages: [],
  },
  {
    id: '2',
    title: 'Competitor Analysis',
    lastMessage: 'Based on my analysis of your competitors...',
    timestamp: new Date(Date.now() - 86400000),
    messages: [],
  },
  {
    id: '3',
    title: 'Content Strategy',
    lastMessage: 'For your industry, I recommend...',
    timestamp: new Date(Date.now() - 172800000),
    messages: [],
  },
];

export default function AIAssistantPage() {
  const { success: showSuccess, error: showError } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const responses: Record<string, string> = {
      'score': `Based on your current AI visibility score of 67/100, here are my recommendations:

## Key Areas for Improvement

1. **Implement llms.txt** - This file helps AI crawlers understand your content structure
2. **Add Structured Data** - Use JSON-LD markup for better comprehension
3. **Optimize Content Format** - Use clear headings, bullet points, and summaries
4. **Enhance Metadata** - Ensure all meta tags are AI-optimized
5. **Improve Page Speed** - Faster pages get crawled more efficiently

## Quick Wins

- Add a comprehensive \`llms.txt\` file to your root directory
- Include FAQ schema markup on relevant pages
- Create concise, AI-readable summaries for each page

Would you like me to help you implement any of these improvements?`,
      
      'competitor': `## Competitor Analysis Summary

I've analyzed your top 5 competitors. Here are the key findings:

| Competitor | Score | Key Strength |
|------------|-------|--------------|
| TechFlow Inc | 94 | Advanced structured data |
| DataPulse | 89 | Comprehensive llms.txt |
| CloudMind | 85 | Fast page loads |
| AI Nexus | 82 | Rich metadata |
| SmartSystems | 78 | Quality content |

### What They're Doing Right

1. **TechFlow Inc** uses extensive Schema.org markup with 15+ different types
2. **DataPulse** has a 500+ line llms.txt covering all services
3. **CloudMind** achieves <2s page loads on all pages

### Recommendations

Focus on structured data implementation - this is where you have the biggest gap compared to top competitors.`,

      'default': `Thank you for your question! I'd be happy to help.

Based on your query, here are some insights:

1. **Analysis**: I've reviewed your website's current state
2. **Recommendations**: There are several areas where you can improve
3. **Next Steps**: Let me know if you'd like to dive deeper into any specific area

Is there a particular aspect you'd like me to focus on?

---
*Feel free to ask follow-up questions or use the suggested prompts below for more specific guidance.*`,
    };

    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('score') || lowerMessage.includes('improve')) {
      return responses['score'];
    } else if (lowerMessage.includes('competitor') || lowerMessage.includes('analyze')) {
      return responses['competitor'];
    }
    return responses['default'];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(inputValue),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleNewChat = () => {
    setActiveSession(null);
    setMessages([]);
  };

  const copyMessage = (messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
    showSuccess('Copied to clipboard!');
  };

  const regenerateResponse = async (messageIndex: number) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newResponse = generateAIResponse(messages[messageIndex - 1]?.content || '');
    setMessages(prev => prev.map((msg, i) => 
      i === messageIndex ? { ...msg, content: newResponse, timestamp: new Date() } : msg
    ));
    setIsTyping(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex pt-12 lg:pt-0">
      {/* Sidebar - Chat History */}
      <div className="w-72 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <Button 
            className="w-full" 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleNewChat}
          >
            New Chat
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Chats</p>
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveSession(session)}
              className={`w-full text-left p-3 rounded-xl transition-colors ${
                activeSession?.id === session.id 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900 text-sm truncate">{session.title}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {session.timestamp.toLocaleDateString()}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Convitsa AI Assistant</h2>
              <p className="text-xs text-gray-500">Powered by advanced AI</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">How can I help you today?</h2>
              <p className="text-gray-500 mb-8 text-center max-w-md">
                Ask me anything about AI optimization, competitor analysis, or content strategy
              </p>
              
              {/* Suggested Prompts */}
              <div className="grid grid-cols-2 gap-3 max-w-2xl">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-4 text-left rounded-xl bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all group"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-primary">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-2xl ${message.role === 'user' ? 'order-1' : ''}`}>
                    <Card 
                      className={`${
                        message.role === 'user' 
                          ? 'bg-primary text-white' 
                          : 'bg-white'
                      }`}
                      padding="sm"
                    >
                      <div className={`prose prose-sm max-w-none ${message.role === 'user' ? 'prose-invert' : ''}`}>
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {message.content}
                        </pre>
                      </div>
                    </Card>
                    
                    <div className={`flex items-center gap-2 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                      {message.role === 'assistant' && (
                        <>
                          <button
                            onClick={() => copyMessage(message.id, message.content)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={() => regenerateResponse(index)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <Card padding="sm" className="bg-white">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}


