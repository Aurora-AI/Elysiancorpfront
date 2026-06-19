import type { PiiSpan } from '@/data/lex-pipeline.types';

export type SpanState = 'plaintext' | 'redacting' | 'token' | 'restored';

interface Props {
  span: PiiSpan;
  state: SpanState;
}

const MOSS = '#4E5B4B';
const AMBER = '#C9A86A';

export function TokenText({ span, state }: Props) {
  const isToken = state === 'token' || state === 'redacting';
  const content = isToken ? `[${span.token}]` : span.text;

  const color = state === 'redacting' ? AMBER : isToken ? MOSS : '#FFFFFF';

  return (
    <span
      data-pii-type={span.type}
      data-state={state}
      data-redacting={state === 'redacting' ? 'true' : undefined}
      className="font-mono transition-colors duration-200"
      style={{
        color,
        textShadow: isToken ? `0 0 8px ${color}55` : undefined,
      }}
    >
      {content}
    </span>
  );
}
