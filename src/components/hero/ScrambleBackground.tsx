import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  '∅◊§⌬≡∞∂αβγδεζθλμπσφψωΣΔΦΨΩ!@#$%+-=/|\\[]{}~<>?_:;.,';

const WORDS = [
  'ELYSIAN', 'LEX', 'AURORA', 'MAD LAB AURORA',
  'DETERMINISMO', 'TRUSTWARE', 'AUDITORIA', 'CONTROLE',
];

const G_R = 196;
const G_G = 158;
const G_B = 38;

const STRIP_RATIO = 0.92;
const CELL_W = 9;
const CELL_H = 16;
const FONT_BASE = 10.5;

// Per-character state within a forming/dissolving word
interface CharSlot {
  locked: boolean;   // true = shows target char at high opacity
  scrambleT: number; // scramble timer (changes random char)
  displayChar: string;
  opacity: number;
}

interface WordEvent {
  word: string;
  row: number;
  col: number;
  slots: CharSlot[];
  phase: 'forming' | 'hold' | 'dissolving';
  phaseT: number;
  active: boolean;
}

interface Cell {
  char: string;
  opacity: number;
  sizeVar: number;
  speed: number;
  timer: number;
  // Semantic reativity
  offX: number;
  offY: number;
}

export function ScrambleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let cols = 0, rows = 0;
    let stripX = 0, stripW = 0;
    let grid: Cell[][] = [];
    let events: WordEvent[] = [];
    let raf = 0;
    let lastT = 0;
    let spawnClock = 2.4;

    // Dual-zone physics constants
    const INNER_R = 50;
    const OUTER_R = 260;
    const INNER_FORCE = 8.0;
    const OUTER_FORCE = 5.0;
    const FRICTION = 0.78;
    const MAX_OFFSET = 18;

    function rchar(): string {
      return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }

    function initGrid(W: number, H: number) {
      stripW = Math.floor(W * STRIP_RATIO);
      stripX = Math.floor((W - stripW) / 2);
      cols = Math.max(1, Math.floor(stripW / CELL_W));
      rows = Math.max(1, Math.floor(H / CELL_H) + 2);

      grid = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          char: rchar(),
          opacity: 0.05 + Math.random() * 0.18,
          sizeVar: Math.random() * 3 - 1.5,
          speed: 0.7 + Math.random() * 2.2,
          timer: Math.random(),
          offX: 0,
          offY: 0,
        }))
      );
      events = [];
    }

    // Returns set of (row, col) occupied by active events — avoid overlaps
    function occupiedCells(): Set<string> {
      const s = new Set<string>();
      for (const ev of events) {
        if (!ev.active) continue;
        for (let i = 0; i < ev.word.length; i++) {
          s.add(`${ev.row},${ev.col + i}`);
        }
      }
      return s;
    }

    function spawnEvent() {
      const word = WORDS[Math.floor(Math.random() * WORDS.length)];
      if (word.length > cols - 4) return;

      const col = 2 + Math.floor(Math.random() * (cols - word.length - 3));
      const row = 1 + Math.floor(Math.random() * (rows - 3));

      // Avoid overlapping with existing events
      const occ = occupiedCells();
      for (let i = 0; i < word.length; i++) {
        if (occ.has(`${row},${col + i}`)) return;
      }

      const slots: CharSlot[] = word.split('').map(() => ({
        locked: false,
        scrambleT: 0,
        displayChar: rchar(),
        opacity: 0.1,
      }));

      events.push({ word, row, col, slots, phase: 'forming', phaseT: 0, active: true });
    }

    function step(now: number) {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // Spawn words — agressivo para manter 5+ simultâneos
      spawnClock += dt;
      const activeCount = events.filter(e => e.active).length;
      if (spawnClock > 0.4 + Math.random() * 0.5 || activeCount < 5) {
        spawnClock = 0;
        spawnEvent();
        // Spawn extra se ainda abaixo de 5
        if (activeCount < 4) spawnEvent();
      }

      // --- Update events ---
      const SCRAMBLE_RATE = 0.025; // rapidez do flip de glifos
      const LOCK_STAGGER  = 0.07;  // stagger entre chars travando
      const FORM_SCRAMBLE = 0.25;  // tempo de scramble antes de travar
      const HOLD_DUR      = 0.9;   // tempo visível
      const DISS_STAGGER  = 0.05;  // stagger do dissolve

      for (const ev of events) {
        if (!ev.active) continue;
        ev.phaseT += dt;

        if (ev.phase === 'forming') {
          for (let i = 0; i < ev.word.length; i++) {
            const slot = ev.slots[i];
            // Time at which this char starts forming
            const charStart = i * LOCK_STAGGER;
            const elapsed = ev.phaseT - charStart;

            if (elapsed < 0) continue;

            if (!slot.locked) {
              // Scramble phase: update char rapidly
              slot.scrambleT += dt;
              if (slot.scrambleT > SCRAMBLE_RATE) {
                slot.scrambleT = 0;
                slot.displayChar = rchar();
              }
              // Opacity sobe rápido enquanto scramble
              slot.opacity = Math.min(0.65, 0.15 + elapsed * 2.5);

              // Lock once scrambled long enough
              if (elapsed >= FORM_SCRAMBLE) {
                slot.locked = true;
                slot.displayChar = ev.word[i];
                slot.opacity = 0.88;
              }
            } else {
              // Locked: gentle breathing
              slot.opacity = 0.82 + Math.sin(now * 0.002 + i * 0.7) * 0.06;
            }
          }

          // Transition to hold when all chars locked
          const allLocked = ev.slots.every(s => s.locked);
          if (allLocked) {
            ev.phase = 'hold';
            ev.phaseT = 0;
          }
        } else if (ev.phase === 'hold') {
          // Breathing pulse across all slots
          for (let i = 0; i < ev.word.length; i++) {
            ev.slots[i].opacity = 0.80 + Math.sin(now * 0.0018 + i * 0.65) * 0.10;
          }

          if (ev.phaseT >= HOLD_DUR) {
            ev.phase = 'dissolving';
            ev.phaseT = 0;
            // Unlock for dissolve
            ev.slots.forEach(s => { s.locked = false; });
          }
        } else {
          // Dissolving — chars scatter right-to-left
          for (let i = ev.word.length - 1; i >= 0; i--) {
            const slot = ev.slots[i];
            const charStart = (ev.word.length - 1 - i) * DISS_STAGGER;
            const elapsed = ev.phaseT - charStart;
            if (elapsed < 0) continue;

            slot.scrambleT += dt;
            if (slot.scrambleT > SCRAMBLE_RATE * 1.5) {
              slot.scrambleT = 0;
              slot.displayChar = rchar();
            }
            slot.opacity = Math.max(0, 0.80 - elapsed * 2.5);
          }

          // Done when last char faded
          const lastStart = (ev.word.length - 1) * DISS_STAGGER;
          if (ev.phaseT > lastStart + 0.35) {
            ev.active = false;
          }
        }
      }

      events = events.filter(ev => ev.active);

      // --- Update background noise cells ---
      const occ = occupiedCells();

      for (let r = 0; r < rows; r++) {
        const cellY = r * CELL_H + CELL_H / 2;
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];

          // 1. Flicker Logic (Restored)
          if (!occ.has(`${r},${c}`)) {
            cell.timer += dt;
            if (cell.timer >= 1 / cell.speed) {
              cell.timer = 0;
              cell.char = rchar();
              const centerBias = 1 - Math.abs(r / rows - 0.5) * 0.45;
              cell.opacity = (0.04 + Math.random() * 0.16) * centerBias;
            }
          }

          // 2. Dual-zone physics
          const cellX = stripX + c * CELL_W + CELL_W / 2;
          const dx = cellX - mouseState.x;
          const dy = cellY - mouseState.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < OUTER_R && dist > 0) {
            const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
            const velMult = Math.min(1 + speed * 0.12, 2.5);
            const angle = Math.atan2(dy, dx);

            if (dist < INNER_R) {
              // Attraction: pull toward cursor
              const force = INNER_FORCE * (1 - dist / INNER_R) * velMult;
              cell.offX -= Math.cos(angle) * force;
              cell.offY -= Math.sin(angle) * force;
            } else {
              // Repulsion: push away with falloff
              const t = (dist - INNER_R) / (OUTER_R - INNER_R);
              const force = OUTER_FORCE * (1 - t) * velMult;
              cell.offX += Math.cos(angle) * force;
              cell.offY += Math.sin(angle) * force;
            }
          }

          // Return force (Elasticity) + cap
          cell.offX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, cell.offX * FRICTION));
          cell.offY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, cell.offY * FRICTION));
        }
      }

      draw(now);
      raf = requestAnimationFrame(step);
    }

    function draw(now: number) {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Build word overlay map for rendering
      const wordOverlay = new Map<string, { char: string; opacity: number; isWord: boolean }>();
      for (const ev of events) {
        if (!ev.active) continue;
        for (let i = 0; i < ev.word.length; i++) {
          const slot = ev.slots[i];
          if (slot.opacity < 0.01) continue;
          wordOverlay.set(`${ev.row},${ev.col + i}`, {
            char: slot.displayChar,
            opacity: slot.opacity,
            isWord: slot.locked,
          });
        }
      }

      // Draw all cells
      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H + CELL_H - 3;
        for (let c = 0; c < cols; c++) {
          const key = `${r},${c}`;
          const wordCell = wordOverlay.get(key);
          const cell = grid[r][c];
          
          const posX = stripX + c * CELL_W + cell.offX;
          const posY = y + cell.offY;

          if (wordCell) {
            const sz = wordCell.isWord ? FONT_BASE + 1.5 : FONT_BASE;
            ctx.font = `${sz}px 'DM Mono', 'Courier New', monospace`;
            ctx.fillStyle = `rgba(${G_R},${G_G},${G_B},${wordCell.opacity.toFixed(3)})`;
            ctx.fillText(wordCell.char, posX, posY);
          } else {
            if (cell.opacity < 0.02) continue;
            const sz = FONT_BASE + cell.sizeVar;
            ctx.font = `${sz}px 'DM Mono', 'Courier New', monospace`;
            ctx.fillStyle = `rgba(${G_R},${G_G},${G_B},${cell.opacity.toFixed(3)})`;
            ctx.fillText(cell.char, posX, posY);
          }
        }
      }

    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initGrid(canvas.width, canvas.height);
    }

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        filter: 'blur(0.3px)',
      }}
    />
  );
}
