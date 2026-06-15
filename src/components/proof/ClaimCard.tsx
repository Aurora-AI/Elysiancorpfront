import type { Claim } from '@/data/evidence.types';

interface Props {
  claim: Claim;
  lang: 'en' | 'pt';
  onOpen: (id: string) => void;
}

// Static so Tailwind sees each literal class.
const SPAN: Record<number, string> = {
  4: 'md:col-span-4', 5: 'md:col-span-5', 6: 'md:col-span-6',
  7: 'md:col-span-7', 8: 'md:col-span-8', 12: 'md:col-span-12',
};

export function ClaimCard({ claim, lang, onOpen }: Props) {
  const badge = claim.status === 'OK'
    ? 'border-elysian-moss-light text-elysian-moss-light'
    : 'border-sovereign-ink/50 text-sovereign-ink/80';
  return (
    <button
      type="button"
      onClick={() => onOpen(claim.id)}
      className={`${SPAN[claim.colSpan] ?? 'md:col-span-6'} hover-invert-card text-left border border-sovereign-ink/20 p-fib-34 flex flex-col justify-between cursor-pointer`}
    >
      <span className="flex justify-between items-start mb-fib-55 w-full">
        <span className="font-technical-sm text-technical-sm text-sovereign-ink/40">{claim.index}</span>
        <span className="flex items-center gap-fib-8">
          <span className={`font-technical-sm text-[10px] px-2 py-1 border ${badge}`}>{claim.status}</span>
          <span className="font-technical-sm text-[10px] px-2 py-1 border border-sovereign-ink/30 text-sovereign-ink/60">{claim.source.label}</span>
        </span>
      </span>
      <span className="font-body-lg text-body-lg text-sovereign-ink">{claim.title[lang]}</span>
    </button>
  );
}
