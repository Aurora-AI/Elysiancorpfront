import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClaimCard } from '../ClaimCard';
import type { Claim } from '@/data/evidence.types';

const claim: Claim = {
  id: 'deterministic-gate', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
  title: { en: 'No critical mutation without a gate.', pt: 'Sem gate, sem mutação.' },
  source: { path: 'CRM/libs/trustware', label: 'lib/trustware' },
};

describe('ClaimCard', () => {
  it('renders index, EN title and badge label', () => {
    render(<ClaimCard claim={claim} lang="en" onOpen={() => {}} />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText(/No critical mutation/)).toBeInTheDocument();
    expect(screen.getByText('lib/trustware')).toBeInTheDocument();
  });
  it('renders PT title when lang=pt', () => {
    render(<ClaimCard claim={claim} lang="pt" onOpen={() => {}} />);
    expect(screen.getByText(/Sem gate/)).toBeInTheDocument();
  });
  it('calls onOpen with the claim id when activated', () => {
    const onOpen = vi.fn();
    render(<ClaimCard claim={claim} lang="en" onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onOpen).toHaveBeenCalledWith('deterministic-gate');
  });
});
