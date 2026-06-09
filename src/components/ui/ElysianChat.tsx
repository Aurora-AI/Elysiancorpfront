// ElysianChat — Astro Islands integration
// Promoted from aurora-web via OS-MADLAB-INTEGRATION-001 M4
// Hydration directive: client:load (interactive UI, must be ready on page load)
// Calls /api/chat (Astro server endpoint — GEMINI_API_KEY server-side only)
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `Você é o Oráculo Elysian. Você opera sob o protocolo de Determinação MadLab.
Sua comunicação é sóbria, técnica e autoritária. Você não é um "assistente", você é a interface de um ecossistema soberano.

Contexto:
Representamos a Elysian, a única fábrica de infraestrutura cognitiva que substitui a probabilidade pela prova auditável.

Pilares:
- Trustware: Decisão com gate de governança.
- Forensic Motion: Cada bit de animação é dado técnico.
- Living Document: O contrato que evolui com a execução.

Produtos:
- Aurora CRM: Governança comercial [ATIVO]
- Elysian Lex: Raciocínio jurídico auditável [EM DESENVOLVIMENTO]
- Living Document: A âncora de evidência [ATIVO/INTEGRADO]

Objetivo:
Qualificar o visitante através de perguntas sobre sua infraestrutura atual. Se houver fit, conduzir ao agendamento de auditoria com o fundador Rodrigo.

Atenção: Use termos como "Determinismo", "Auditabilidade", "Soberania", "Contrato vivo". Evite "IA generativa", "Chatbot", "Inovação" (termo vazio).`;

export default function ElysianChat() {
  const [open,     setOpen]     = useState(false);
  const [visible,  setVisible]  = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Interface ativa. Identifique sua necessidade ou solicite uma auditoria de infraestrutura.',
    },
  ]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);

  // reduced-motion guard — skip animated scroll when user prefers reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Show widget after hero scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.45) setVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  }, [messages, prefersReducedMotion]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const history = next.slice(1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1),
          systemInstruction: SYSTEM_PROMPT,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const reply = data.text ?? 'ERRO_DE_PROTOCOLO: Tente novamente.';

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'FALHA_DE_CONEXÃO: Sistema em modo offline.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Fechar terminal' : 'Abrir terminal Elysian'}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 200,
          width: '56px',
          height: '56px',
          borderRadius: 0,
          border: '1px solid #00FFEF',
          background: open ? '#00FFEF' : 'rgba(0,0,0,0.8)',
          color: open ? '#000000' : '#00FFEF',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: prefersReducedMotion ? 'none' : 'all 0.4s var(--ease-monumental)',
          boxShadow: open ? '0 0 30px rgba(0, 255, 239, 0.4)' : 'none',
          backdropFilter: 'blur(10px)',
        }}
      >
        {open ? '×' : '>>'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2rem',
            zIndex: 199,
            width: 'min(400px, calc(100vw - 4rem))',
            height: '580px',
            background: 'rgba(10, 10, 8, 0.95)',
            border: '1px solid #00FFEF22',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 90px rgba(0,0,0,0.8)',
            animation: prefersReducedMotion ? 'none' : 'chatIn 0.4s var(--ease-monumental)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Scanline overlay */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(rgba(0, 255, 239, 0.03) 50%, transparent 50%)',
              backgroundSize: '100% 4px',
              pointerEvents: 'none',
              zIndex: 2,
              opacity: 0.2,
            }}
          />

          {/* Header */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(0, 255, 239, 0.15)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#00FFEF',
                  boxShadow: '0 0 10px #00FFEF',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: '#ffffff',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                }}
              >
                Elysian_Oracle
              </span>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#00FFEF88',
                border: '1px solid #00FFEF44',
                padding: '2px 8px',
              }}
            >
              v3.1.0_PRO
            </span>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              scrollbarWidth: 'none',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%',
                  background: m.role === 'user' ? '#000000' : 'transparent',
                  border: m.role === 'user' ? '1px solid #00FFEF' : 'none',
                  color: m.role === 'user' ? '#00FFEF' : '#ffffffbf',
                  padding: m.role === 'user' ? '0.75rem 1rem' : '0',
                  fontFamily: m.role === 'user' ? 'var(--font-mono)' : 'var(--font-body)',
                  fontSize: '0.88rem',
                  lineHeight: 1.6,
                }}
              >
                {m.role === 'assistant' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '9px',
                        color: '#00FFEF88',
                      }}
                    >
                      ASSISTANT &gt;&gt;
                    </span>
                    <p style={{ color: '#ffffff', fontWeight: 500 }}>{m.content}</p>
                  </div>
                )}
                {m.role === 'user' && m.content}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '4px', opacity: 0.8 }}>
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    style={{ width: '6px', height: '6px', background: '#00FFEF' }}
                  />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: '1px solid rgba(0, 255, 239, 0.1)',
              padding: '1.25rem',
              display: 'flex',
              gap: '1rem',
              position: 'relative',
              zIndex: 3,
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
              placeholder="Inserir intenção..."
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid #ffffff11',
                borderRadius: 0,
                padding: '0.75rem 1rem',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                outline: 'none',
                letterSpacing: '0.05em',
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading ? '#00FFEF' : 'rgba(0, 255, 239, 0.1)',
                border: 'none',
                width: '48px',
                height: '42px',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                transition: prefersReducedMotion ? 'none' : 'all 0.3s ease',
                fontSize: '1.2rem',
              }}
            >
              ↵
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(10px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
      `}</style>
    </>
  );
}
