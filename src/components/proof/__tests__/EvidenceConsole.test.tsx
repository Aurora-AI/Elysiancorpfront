import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EvidenceConsole } from '../EvidenceConsole';

beforeEach(() => {
  // @ts-expect-error test stub
  global.fetch = vi.fn(() => Promise.resolve({ text: () => Promise.resolve('def gate(): return True') }));
});

describe('EvidenceConsole', () => {
  it('renders the header and all 6 primary claims', () => {
    render(<EvidenceConsole />);
    expect(screen.getByText('[ 02 // THE EVIDENCE LEDGER ]')).toBeInTheDocument();
    expect(screen.getByText(/We Show the Trace/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /No critical|Production promotion|persisted|adversarial|observable|Micro-step/i }).length).toBeGreaterThanOrEqual(6);
  });
  it('toggles language to PT', () => {
    render(<EvidenceConsole />);
    fireEvent.click(screen.getByRole('button', { name: 'PT' }));
    expect(screen.getByText(/Mostramos o rastro/)).toBeInTheDocument();
  });
  it('opens the modal with fetched excerpt on card click', async () => {
    render(<EvidenceConsole />);
    fireEvent.click(screen.getByRole('button', { name: /No critical/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/evidence/deterministic-gate.txt');
  });
});
