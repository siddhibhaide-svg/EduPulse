import { Loader2 } from 'lucide-react';

export default function ChartPlaceholder() {
  return (
    <div className="flex h-64 items-center justify-center text-slate-400">
      <Loader2 className="h-6 w-6 animate-spin" />
    </div>
  );
}
