import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface StickyHeaderProps {
  title: string;
  onBack?: () => void;
  subtitle?: ReactNode;
  right?: ReactNode;
}

export default function StickyHeader({ title, onBack, subtitle, right }: StickyHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Geri"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">{title}</h1>
        </div>
        {subtitle && <div className="shrink-0 text-xs font-semibold text-slate-600">{subtitle}</div>}
        {right}
      </div>
    </header>
  );
}
