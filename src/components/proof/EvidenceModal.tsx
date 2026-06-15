import { useEffect, useRef } from 'react';
import type { Provenance } from '@/data/evidence.types';

interface Props {
  open: boolean;
  title: string;
  excerpt: string;
  provenance: Provenance;
  onClose: () => void;
}

export function EvidenceModal({ open, title, excerpt, provenance, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = 'auto'; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-parchment-ink/90 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative bg-sovereign-bg border border-sovereign-ink w-full max-w-2xl mx-fib-21 p-fib-34 shadow-2xl"
      >
        <button type="button" onClick={onClose} aria-label="Close"
          className="absolute top-fib-21 right-fib-21 text-sovereign-ink/50 hover:text-sovereign-ink">✕</button>
        <div className="font-technical-sm text-technical-sm text-elysian-moss-light mb-fib-21 uppercase tracking-widest">
          Provenance Metadata
        </div>
        <h4 className="font-headline-md text-headline-md text-sovereign-ink mb-fib-34 border-b border-sovereign-ink/20 pb-fib-21">
          {title}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-fib-34">
          <pre className="border border-sovereign-ink/20 bg-sovereign-ink/5 p-fib-13 font-technical-sm text-[11px] text-sovereign-ink/70 leading-relaxed overflow-x-auto whitespace-pre-wrap">{excerpt}</pre>
          <dl className="flex flex-col gap-fib-13">
            {[
              ['Commit SHA', provenance.commit],
              ['Source', provenance.sourcePath],
              ['SHA-256', provenance.sha256.slice(0, 16) + '…'],
              ['Timestamp', provenance.timestamp.slice(0, 10)],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-sovereign-ink/20 pb-fib-8 flex justify-between gap-fib-8">
                <dt className="font-technical-sm text-technical-sm text-sovereign-ink/50">{k}</dt>
                <dd className="font-technical-sm text-technical-sm text-sovereign-ink text-right break-all">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
