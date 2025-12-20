// ===================================
// CONVITSA COMPONENT LIBRARY
// ===================================
// This file exports all reusable components
// organized by category for easy importing.
//
// Usage:
// import { Button, Card, Toggle, Badge } from '@/components';
//
// Or import from specific categories:
// import { Toggle, Select } from '@/components/forms';
// import { Badge, ProgressBar } from '@/components/data-display';

// ===================================
// UI COMPONENTS (Basic Primitives)
// ===================================
export { default as Button } from './ui/Button';
export { default as Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
export { default as Input } from './ui/Input';
export { default as Modal } from './ui/Modal';
export { default as Loader } from './ui/Loader';
export { default as Toast, useToast } from './ui/Toast';
export { default as DataTable } from './ui/DataTable';
export type { Column } from './ui/DataTable';
export { default as StatCard } from './ui/StatCard';
export { default as FilterBar } from './ui/FilterBar';
export { default as LiveIndicator } from './ui/LiveIndicator';
export { default as Sidebar } from './ui/Sidebar';
export { default as CommandPalette } from './ui/CommandPalette';

// ===================================
// FORM COMPONENTS
// ===================================
export { Toggle, Select, SearchInput } from './forms';
export type { SelectOption } from './forms';

// ===================================
// DATA DISPLAY COMPONENTS
// ===================================
export { Badge, StatusBadge, MentionBadge, ProgressBar, RankingBar, EmptyState } from './data-display';

// ===================================
// NAVIGATION COMPONENTS
// ===================================
export { Tabs } from './navigation';
export type { TabItem } from './navigation';

// ===================================
// LAYOUT COMPONENTS
// ===================================
export { SliderPanel, InfoBox, GrayInfoBox, PageHeader } from './layout';

// ===================================
// FEEDBACK COMPONENTS
// ===================================
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonStats, SkeletonChart } from './feedback';

// ===================================
// ICON COMPONENTS
// ===================================
export {
  ChatGPTIcon,
  ClaudeIcon,
  GeminiIcon,
  PerplexityIcon,
  BingAIIcon,
  MetaAIIcon,
  YouAIIcon,
  AIIcon,
  getAIColor,
} from './icons';

// ===================================
// MOTION COMPONENTS
// ===================================
export {
  FadeIn,
  FadeInUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  PageTransition,
  MotionCard,
  MotionButton,
  AnimatedProgressBar,
  Pulse,
  Spin,
  Float,
  Shake,
  ModalBackdrop,
  ModalContent,
  SlideToggle,
} from './motion';

