import { useState } from 'react';
import { CLAIMS, HEADER, PRODUCTS } from '@/data/evidence';
import provData from '@/data/evidence.provenance.json';
import type { Provenance } from '@/data/evidence.types';
import { ClaimCard } from './ClaimCard';
import { EvidenceModal } from './EvidenceModal';
import { KineticBlocksBackground } from './KineticBlocksBackground';

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
    <section id="evidence-ledger" className="relative w-full bg-black text-white py-fib-89 px-fib-34 min-h-screen overflow-hidden">
      <KineticBlocksBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-fib-89 flex flex-col gap-fib-21">
          <div className="flex justify-between items-center">
            <span className="font-technical-sm text-technical-sm text-white/60 tracking-widest uppercase">{HEADER.label}</span>
            <span className="flex gap-fib-8 font-technical-sm text-technical-sm">
              <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} className={lang === 'en' ? 'text-white' : 'text-white/40'}>EN</button>
              <span className="text-white/20">/</span>
              <button type="button" aria-pressed={lang === 'pt'} onClick={() => setLang('pt')} className={lang === 'pt' ? 'text-white' : 'text-white/40'}>PT</button>
            </span>
          </div>
          <p className="font-body text-[16px] text-white/60 max-w-3xl leading-relaxed">{HEADER.preamble[lang]}</p>
          <h2 className="font-display-lg text-display-lg md:text-[72px] md:leading-[0.95] max-w-4xl text-white">{HEADER.title[lang]}</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-fib-21 md:gap-fib-34 mb-fib-89">
          {primary.map(c => <ClaimCard key={c.id} claim={c} lang={lang} onOpen={open} />)}
        </div>

        {secondary && (
          <div className="flex flex-col md:flex-row items-center gap-fib-21 border border-white/20 p-fib-21 mb-fib-55">
            <span className="font-technical-sm text-technical-sm px-3 py-1 bg-white text-black uppercase tracking-widest shrink-0">Data Privacy</span>
            <p className="font-body-md text-body-md text-white/80">{secondary.title[lang]}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-fib-13 border-t border-white/20 pt-fib-34">
          {PRODUCTS.map(p => (
            <span key={p.id} className="flex items-center gap-fib-8 border border-white/20 px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="font-technical-sm text-technical-sm text-white uppercase tracking-wider">{p.label}</span>
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
