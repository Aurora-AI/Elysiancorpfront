import { useState } from 'react';
import { CLAIMS, HEADER, PRODUCTS } from '@/data/evidence';
import provData from '@/data/evidence.provenance.json';
import type { Provenance } from '@/data/evidence.types';
import { ClaimCard } from './ClaimCard';
import { EvidenceModal } from './EvidenceModal';

const PROV = provData as Record<string, Provenance>;

export function EvidenceConsole() {
  const [lang, setLang] = useState<'en' | 'pt'>('en');
  const [openId, setOpenId] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState('');

  const open = async (id: string) => {
    const p = PROV[id];
    setOpenId(id);
    if (p?.kind === 'image') { setExcerpt(''); return; }
    try { setExcerpt(await (await fetch(p.asset)).text()); }
    catch { setExcerpt('// evidence unavailable'); }
  };

  const current = openId ? CLAIMS.find(c => c.id === openId) : null;
  const primary = CLAIMS.filter(c => c.tier === 'primary');
  const secondary = CLAIMS.find(c => c.tier === 'secondary');

  return (
    <section id="evidence-ledger" className="relative w-full bg-sovereign-bg text-sovereign-ink bg-halftone-grain py-fib-89 px-fib-34 min-h-screen border-t border-parchment-ink">
      <div className="max-w-7xl mx-auto">
        <header className="mb-fib-89 flex flex-col gap-fib-21">
          <div className="flex justify-between items-center">
            <span className="font-technical-sm text-technical-sm text-sovereign-ink/60 tracking-widest uppercase">{HEADER.label}</span>
            <span className="flex gap-fib-8 font-technical-sm text-technical-sm">
              <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} className={lang === 'en' ? 'text-elysian-moss-light' : 'text-sovereign-ink/40'}>EN</button>
              <span className="text-sovereign-ink/20">/</span>
              <button type="button" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')} className={lang === 'pt' ? 'text-elysian-moss-light' : 'text-sovereign-ink/40'}>PT</button>
            </span>
          </div>
          <h2 className="font-display-lg text-display-lg md:text-[72px] md:leading-[0.95] max-w-4xl text-sovereign-ink">{HEADER.title[lang]}</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-fib-21 md:gap-fib-34 mb-fib-89">
          {primary.map(c => <ClaimCard key={c.id} claim={c} lang={lang} onOpen={open} />)}
        </div>

        {secondary && (
          <div className="flex flex-col md:flex-row items-center gap-fib-21 border border-sovereign-ink/20 p-fib-21 mb-fib-55">
            <span className="font-technical-sm text-technical-sm px-3 py-1 bg-sovereign-ink text-sovereign-bg uppercase tracking-widest shrink-0">Data Privacy</span>
            <p className="font-body-md text-body-md text-sovereign-ink/80">{secondary.title[lang]}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-fib-13 border-t border-sovereign-ink/20 pt-fib-34">
          {PRODUCTS.map(p => (
            <span key={p.id} className="flex items-center gap-fib-8 border border-sovereign-ink/20 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-elysian-moss-light" />
              <span className="font-technical-sm text-technical-sm text-sovereign-ink uppercase tracking-wider">{p.label}</span>
            </span>
          ))}
        </div>
      </div>

      {current && PROV[current.id] && (
        <EvidenceModal
          open={!!openId}
          title={current.title[lang]}
          excerpt={excerpt}
          provenance={PROV[current.id]}
          onClose={() => setOpenId(null)}
        />
      )}
    </section>
  );
}
