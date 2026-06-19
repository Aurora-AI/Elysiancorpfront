import { useRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LEX_DOCUMENT, STAGES, REDACTED_COUNT_LABEL, PII_SPANS } from '@/data/lex-pipeline';
import { isPiiSpan } from '@/data/lex-pipeline.types';
import { stageAt } from '@/lib/lex-stages';
import { TokenText, type SpanState } from './TokenText';

interface Props {
  lang?: 'en' | 'pt';
}

const SPAN_COUNT = PII_SPANS.length;

// Width of the amber "redacting" flash window before a span flips to its token,
// as a fraction of stage-1 local progress.
const REDACTING_WINDOW = 0.12;

// Derive a span's visual state from the current stage index, within-stage
// progress, and the span's ordinal position among PII spans.
function spanState(spanIndex: number, index: number, local: number): SpanState {
  const threshold = (spanIndex + 1) / (SPAN_COUNT + 1);
  if (index <= 0) return 'plaintext';
  if (index === 1) {
    if (local >= threshold) return 'token';
    if (local >= threshold - REDACTING_WINDOW) return 'redacting';
    return 'plaintext';
  }
  if (index >= 2 && index <= 3) return 'token';
  // index === 4 (detokenize)
  return local >= threshold ? 'restored' : 'token';
}

// How many PII spans are currently redacted/tokenized, for the counter.
function redactedCount(index: number, local: number): number {
  if (index <= 0) return 0;
  if (index === 1) {
    return PII_SPANS.filter((_, i) => local >= (i + 1) / (SPAN_COUNT + 1)).length;
  }
  return SPAN_COUNT;
}

export function LexPipeline({ lang = 'en' }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  // Final static state when reduced-motion: last stage, fully resolved.
  const [progress, setProgress] = useState(prefersReduced ? 1 : 0);

  useEffect(() => {
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const proxy = { p: 0 };
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 75%',
        end: 'bottom 30%',
        scrub: 1.2,
      },
    });
    tl.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: () => setProgress(proxy.p),
    });

    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, [prefersReduced]);

  const { index, local } = stageAt(progress);
  const sealed = index >= 3;
  const llmActive = index >= 2;
  const redacted = redactedCount(index, local);

  let spanCursor = -1;

  return (
    <div ref={rootRef} className="relative w-full text-white/80">
      {/* Stage rail */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2 mb-8 font-mono text-[11px] uppercase tracking-widest">
        {STAGES.map((s, i) => (
          <li
            key={s.id}
            data-active={i === index ? 'true' : undefined}
            className={i === index ? 'text-[#C9A86A]' : i < index ? 'text-[#4E5B4B]' : 'text-white/30'}
          >
            {s.label[lang]}
          </li>
        ))}
      </ol>

      {/* Document */}
      <p className="font-mono text-[15px] md:text-[18px] leading-loose max-w-3xl">
        {LEX_DOCUMENT.segments.map((seg, i) => {
          if (typeof seg === 'string' || !isPiiSpan(seg)) {
            return <span key={i}>{seg as string}</span>;
          }
          spanCursor += 1;
          return (
            <TokenText key={i} span={seg} state={spanState(spanCursor, index, local)} />
          );
        })}
      </p>

      {/* Telemetry: redacted counter + LLM node + seal */}
      <div className="flex flex-wrap items-center gap-6 mt-8 font-mono text-[11px] uppercase tracking-widest">
        <span className="text-white/50">
          {REDACTED_COUNT_LABEL[lang]}: <span className="text-[#4E5B4B]">{redacted}/{SPAN_COUNT}</span>
        </span>
        <span
          data-llm-active={llmActive ? 'true' : undefined}
          className={llmActive ? 'text-white/80' : 'text-white/25'}
        >
          reasoning · Claude Sonnet 4.6
        </span>
        {sealed && (
          <span data-sealed="true" className="px-2 py-0.5 border border-[#4E5B4B] text-[#4E5B4B]">
            SEALED
          </span>
        )}
      </div>
    </div>
  );
}
