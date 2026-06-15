import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceModal } from '../EvidenceModal';

const prov = {
  sourcePath: 'pkg/gate.py', sha256: 'a'.repeat(64), commit: 'abc1234',
  timestamp: '2026-06-10T00:00:00Z', asset: '/evidence/c1.txt', kind: 'code' as const,
};

describe('EvidenceModal', () => {
  it('renders provenance + claim title + excerpt', () => {
    render(<EvidenceModal open title="No mutation without a gate." excerpt="def gate(): return True" provenance={prov} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('abc1234')).toBeInTheDocument();
    expect(screen.getByText('pkg/gate.py')).toBeInTheDocument();
    expect(screen.getByText(/def gate/)).toBeInTheDocument();
  });
  it('closes on Escape', () => {
    const onClose = vi.fn();
    render(<EvidenceModal open title="t" excerpt="" provenance={prov} onClose={onClose} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
  it('renders nothing when closed', () => {
    render(<EvidenceModal open={false} title="t" excerpt="" provenance={prov} onClose={() => {}} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
