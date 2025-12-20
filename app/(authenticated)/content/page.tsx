'use client';

import React, { useState } from 'react';
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Sparkles,
  Trash2,
  Save,
  Eye,
  Code,
  Clock,
  ChevronRight,
  X,
  FileText,
  Database,
  Settings,
  Copy,
  Check,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { RotatingTextLoader } from '@/components/ui/Loader';
import { useToast } from '@/lib/store/hooks/useToast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileItem[];
  lastModified?: string;
}

const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'llms.txt',
    type: 'file',
    content: `# Convitsa AI Information

## About
Convitsa is an AI Engine Optimization (AIEO) platform that helps websites optimize their content for AI search engines and language models.

## Services
- AI Visibility Analysis
- Competitor Benchmarking
- Automated Content Optimization
- Structured Data Implementation

## Contact
- Website: https://convitsa.com
- Email: support@convitsa.com`,
    lastModified: '2 hours ago',
  },
  {
    id: '2',
    name: 'Markdown Files',
    type: 'folder',
    children: [
      {
        id: '2-1',
        name: 'about.md',
        type: 'file',
        content: `# About Our Company

We are a leading provider of AI optimization solutions...`,
        lastModified: '1 day ago',
      },
      {
        id: '2-2',
        name: 'services.md',
        type: 'file',
        content: `# Our Services

## AI Engine Optimization
Comprehensive optimization for AI visibility...`,
        lastModified: '3 days ago',
      },
    ],
  },
  {
    id: '3',
    name: 'Structured Data',
    type: 'folder',
    children: [
      {
        id: '3-1',
        name: 'organization.json',
        type: 'file',
        content: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Your Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://twitter.com/company",
    "https://linkedin.com/company"
  ]
}`,
        lastModified: '5 days ago',
      },
    ],
  },
  {
    id: '4',
    name: 'Metadata',
    type: 'folder',
    children: [
      {
        id: '4-1',
        name: 'meta-tags.json',
        type: 'file',
        content: `{
  "title": "Your Company - AI Optimized",
  "description": "Leading provider of innovative solutions",
  "keywords": ["AI", "optimization", "technology"]
}`,
        lastModified: '1 week ago',
      },
    ],
  },
];

const aiGenerationTexts = [
  'Understanding your request...',
  'Analyzing content structure...',
  'Generating optimized content...',
  'Adding AI-friendly formatting...',
  'Finalizing output...',
];

export default function ContentPage() {
  const { success: showSuccess, error: showError, info: showInfo } = useToast();
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(initialFiles[0]);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['2', '3', '4']));
  const [editorContent, setEditorContent] = useState(initialFiles[0].content || '');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleFolder = (folderId: string) => {
    const newOpenFolders = new Set(openFolders);
    if (newOpenFolders.has(folderId)) {
      newOpenFolders.delete(folderId);
    } else {
      newOpenFolders.add(folderId);
    }
    setOpenFolders(newOpenFolders);
  };

  const selectFile = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedFile(file);
      setEditorContent(file.content || '');
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    showSuccess('File saved successfully!');
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Mock generated content
    const generated = `# AI Generated Content

Based on your request: "${aiPrompt}"

## Overview
This is AI-optimized content generated specifically for your needs.

## Key Points
- Point 1: Relevant information
- Point 2: Important details
- Point 3: Additional context

## Summary
This content has been optimized for AI readability and search engine visibility.`;
    
    setGeneratedContent(generated);
    setIsGenerating(false);
  };

  const insertGeneratedContent = () => {
    setEditorContent(prev => prev + '\n\n' + generatedContent);
    setShowAIModal(false);
    setAiPrompt('');
    setGeneratedContent('');
    showSuccess('Content inserted!');
  };

  const handleNewFile = () => {
    if (!newFileName.trim()) return;
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: newFileName,
      type: 'file',
      content: '',
      lastModified: 'Just now',
    };
    setFiles([...files, newFile]);
    setSelectedFile(newFile);
    setEditorContent('');
    setShowNewFileModal(false);
    setNewFileName('');
    showSuccess('File created!');
  };

  const handleDelete = () => {
    if (!selectedFile) return;
    setFiles(files.filter(f => f.id !== selectedFile.id));
    setSelectedFile(null);
    setEditorContent('');
    setShowDeleteModal(false);
    showSuccess('File deleted!');
  };

  const copyContent = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <button
          onClick={() => item.type === 'folder' ? toggleFolder(item.id) : selectFile(item)}
          className={`
            w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors
            ${selectedFile?.id === item.id ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-700'}
          `}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {item.type === 'folder' ? (
            <>
              <ChevronRight className={`w-4 h-4 transition-transform ${openFolders.has(item.id) ? 'rotate-90' : ''}`} />
              {openFolders.has(item.id) ? (
                <FolderOpen className="w-4 h-4 text-amber-500" />
              ) : (
                <Folder className="w-4 h-4 text-amber-500" />
              )}
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileText className="w-4 h-4 text-gray-400" />
            </>
          )}
          <span className="text-sm font-medium truncate">{item.name}</span>
        </button>
        {item.type === 'folder' && item.children && openFolders.has(item.id) && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 mt-1">Edit and manage your AI-optimized content</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowNewFileModal(true)}
          >
            New File
          </Button>
          <Button
            variant="outline"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => setShowAIModal(true)}
          >
            Generate with AI
          </Button>
          {selectedFile && (
            <Button
              variant="outline"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* File Tree Sidebar */}
        <Card className="w-64 flex-shrink-0 overflow-hidden" padding="none">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Files</h3>
          </div>
          <div className="p-2 overflow-y-auto h-[calc(100%-57px)]">
            {renderFileTree(files)}
          </div>
        </Card>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedFile ? (
            <>
              {/* Tabs */}
              <div className="flex items-center justify-between bg-white rounded-t-xl border border-b-0 border-gray-200 px-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">{selectedFile.name}</span>
                  </div>
                  {selectedFile.lastModified && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      Last edited {selectedFile.lastModified}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyContent}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 text-gray-500'}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <Button
                    size="sm"
                    leftIcon={<Save className="w-4 h-4" />}
                    isLoading={isSaving}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Editor and Preview */}
              <div className="flex-1 flex border border-gray-200 rounded-b-xl overflow-hidden bg-white">
                {/* Code Editor */}
                <div className={`${showPreview ? 'w-1/2 border-r border-gray-200' : 'w-full'} flex flex-col`}>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <Code className="w-4 h-4 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">Editor</span>
                  </div>
                  <textarea
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    className="flex-1 p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none"
                    placeholder="Start typing or generate content with AI..."
                    spellCheck={false}
                  />
                </div>

                {/* Preview */}
                {showPreview && (
                  <div className="w-1/2 flex flex-col">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Preview</span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                        {editorContent || 'Preview will appear here...'}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No file selected</h3>
                <p className="text-gray-500 mb-4">Select a file from the sidebar or create a new one</p>
                <Button onClick={() => setShowNewFileModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                  Create New File
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* New File Modal */}
      <Modal isOpen={showNewFileModal} onClose={() => setShowNewFileModal(false)} title="Create New File">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Name</label>
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="e.g., content.md"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowNewFileModal(false)}>Cancel</Button>
            <Button onClick={handleNewFile}>Create File</Button>
          </div>
        </div>
      </Modal>

      {/* AI Generation Modal */}
      <Modal isOpen={showAIModal} onClose={() => setShowAIModal(false)} title="Generate with AI" size="lg">
        {isGenerating ? (
          <div className="py-12">
            <RotatingTextLoader texts={aiGenerationTexts} interval={1000} />
          </div>
        ) : generatedContent ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">{generatedContent}</pre>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => { setGeneratedContent(''); setAiPrompt(''); }}>
                Regenerate
              </Button>
              <Button onClick={insertGeneratedContent}>Insert Content</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe what content you need...
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Write an AI-optimized description of our company's services..."
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowAIModal(false)}>Cancel</Button>
              <Button onClick={handleAIGenerate} leftIcon={<Sparkles className="w-4 h-4" />}>
                Generate
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete File">
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{selectedFile?.name}</span>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete File
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


