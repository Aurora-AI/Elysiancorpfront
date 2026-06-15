export type NodeKind = 'loop' | 'principle';
export type NodeStatus = 'live' | 'roadmap';
export type PhaseLabel = 'F1' | 'F2' | 'F3';

export interface Bilingual { en: string; pt: string; }

export interface MeshNode {
  id: string;
  label: Bilingual;
  description?: Bilingual;
  kind: NodeKind;
  status: NodeStatus;
  phase?: PhaseLabel;
  evidenceRef?: string;  // repo-relative path; REQUIRED when status === 'live'
  governs?: string;      // principle → loop node id it satellites
}

export interface MeshEdge {
  from: string;
  to: string;
  kind: 'loop' | 'governs';
}

export function isMeshNode(v: unknown): v is MeshNode {
  if (!v || typeof v !== 'object') return false;
  const n = v as MeshNode;
  if (typeof n.id !== 'string') return false;
  if (!n.label || typeof n.label.en !== 'string' || typeof n.label.pt !== 'string') return false;
  if (n.kind !== 'loop' && n.kind !== 'principle') return false;
  if (n.status !== 'live' && n.status !== 'roadmap') return false;
  if (n.status === 'live' && typeof n.evidenceRef !== 'string') return false;
  return true;
}
