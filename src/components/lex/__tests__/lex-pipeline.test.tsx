import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const gsapMocks = vi.hoisted(() => {
  const tl = { to: vi.fn().mockReturnThis(), kill: vi.fn(), scrollTrigger: { kill: vi.fn() } };
  return { set: vi.fn(), registerPlugin: vi.fn(), timeline: vi.fn(() => tl) };
});

const reducedMotionMock = vi.hoisted(() => ({ value: false }));
vi.mock('framer-motion', async (importOriginal: () => Promise<typeof import('framer-motion')>) => {
  const actual = await importOriginal();
  return { ...actual, useReducedMotion: () => reducedMotionMock.value };
});

vi.mock('gsap', () => ({
  default: {
    registerPlugin: gsapMocks.registerPlugin,
    set: gsapMocks.set,
    timeline: gsapMocks.timeline,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { getAll: vi.fn(() => []) },
}));

import { LexPipeline } from '../LexPipeline';

describe('LexPipeline', () => {
  afterEach(() => {
    reducedMotionMock.value = false;
    gsapMocks.timeline.mockClear();
  });

  it('renders all 5 stage labels (EN)', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getByText('Raw document')).toBeInTheDocument();
    expect(screen.getByText('Detokenization (final output)')).toBeInTheDocument();
  });

  it('renders the document plaintext (e.g. the client name) somewhere', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getAllByText(/João Carlos da Silva/).length).toBeGreaterThan(0);
  });

  it('keeps legal stopwords visible as plain text', () => {
    render(<LexPipeline lang="en" />);
    expect(screen.getByText(/Justiça Federal/)).toBeInTheDocument();
  });

  it('creates a GSAP timeline when motion is allowed', () => {
    reducedMotionMock.value = false;
    render(<LexPipeline lang="en" />);
    expect(gsapMocks.timeline).toHaveBeenCalled();
  });

  it('in reduced-motion mode, no GSAP timeline is created', () => {
    reducedMotionMock.value = true;
    render(<LexPipeline lang="en" />);
    expect(gsapMocks.timeline).not.toHaveBeenCalled();
  });
});
