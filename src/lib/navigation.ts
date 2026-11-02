import { BookOpen, Layers, LayoutDashboard, NotebookPen, type LucideIcon } from 'lucide-react';

export type AppView = 'dashboard' | 'cards' | 'notes' | 'methods';

export const NAV_ITEMS: { view: AppView; label: string; icon: LucideIcon }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'cards', label: 'Cards', icon: Layers },
  { view: 'notes', label: 'Notes', icon: NotebookPen },
  { view: 'methods', label: 'Methods', icon: BookOpen },
];
