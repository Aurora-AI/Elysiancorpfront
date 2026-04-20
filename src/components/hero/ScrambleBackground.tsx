import { useEffect, useRef } from 'react';

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
  '∅◊§⌬≡∞∂αβγδεζθλμπσφψωΣΔΦΨΩ!@#$%+-=/|\\[]{}~<>?_:;.,';

const WORDS = [
  'ELYSIAN', 'LEX', 'AURORA', 'MAD LAB AURORA',
  'DETERMINISMO', 'TRUSTWARE', 'AUDITORIA', 'CONTROLE',
];

const G_R = 10;
const G_G = 10;
const G_B = 10;

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
    let spawnClock = -0.8; // Silence Rule: Start with negative clock to enforce initial rest

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
        }))
      );
      events = [];
    }

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

      spawnClock += dt;
      const activeCount = events.filter(e => e.active).length;
      if (spawnClock > 0.4 + Math.random() * 0.5 || activeCount < 5) {
        spawnClock = 0;
        spawnEvent();
        if (activeCount < 4) spawnEvent();
      }

      for (const ev of events) {
        if (!ev.active) continue;
        ev.phaseT += dt;

        if (ev.phase === 'forming') {
          for (let i = 0; i < ev.word.length; i++) {
            const slot = ev.slots[i];
            const charStart = i * 0.07;
            const elapsed = ev.phaseT - charStart;
            if (elapsed < 0) continue;

            if (!slot.locked) {
              slot.scrambleT += dt;
              if (slot.scrambleT > 0.025) {
                slot.scrambleT = 0;
                slot.displayChar = rchar();
              }
              slot.opacity = Math.min(0.65, 0.15 + elapsed * 2.5);
              if (elapsed >= 0.25) {
                slot.locked = true;
                slot.displayChar = ev.word[i];
                slot.opacity = 0.88;
              }
            } else {
              slot.opacity = 0.82 + Math.sin(now * 0.002 + i * 0.7) * 0.06;
            }
          }
          if (ev.slots.every(s => s.locked)) {
            ev.phase = 'hold';
            ev.phaseT = 0;
          }
        } else if (ev.phase === 'hold') {
          for (let i = 0; i < ev.word.length; i++) {
            ev.slots[i].opacity = 0.80 + Math.sin(now * 0.0018 + i * 0.65) * 0.10;
          }
          if (ev.phaseT >= 0.9) {
            ev.phase = 'dissolving';
            ev.phaseT = 0;
            ev.slots.forEach(s => { s.locked = false; });
          }
        } else {
          for (let i = ev.word.length - 1; i >= 0; i--) {
            const slot = ev.slots[i];
            const charStart = (ev.word.length - 1 - i) * 0.05;
            const elapsed = ev.phaseT - charStart;
            if (elapsed < 0) continue;
            slot.scrambleT += dt;
            if (slot.scrambleT > 0.0375) {
              slot.scrambleT = 0;
              slot.displayChar = rchar();
            }
            slot.opacity = Math.max(0, 0.80 - elapsed * 2.5);
          }
          if (ev.phaseT > (ev.word.length - 1) * 0.05 + 0.35) {
            ev.active = false;
          }
        }
      }

      events = events.filter(ev => ev.active);

      const occMap = occupiedCells();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (!occMap.has(`${r},${c}`)) {
            const cell = grid[r][c];
            cell.timer += dt;
            if (cell.timer >= 1 / cell.speed) {
              cell.timer = 0;
              cell.char = rchar();
              const centerBias = 1 - Math.abs(r / rows - 0.5) * 0.45;
              cell.opacity = (0.04 + Math.random() * 0.16) * centerBias;
            }
          }
        }
      }

      draw();
      raf = requestAnimationFrame(step);
    }

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

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

      for (let r = 0; r < rows; r++) {
        const y = r * CELL_H + CELL_H - 3;
        for (let c = 0; c < cols; c++) {
          const key = `${r},${c}`;
          const wordCell = wordOverlay.get(key);
          const cell = grid[r][c];
          const posX = stripX + c * CELL_W;

          if (wordCell) {
            const sz = wordCell.isWord ? FONT_BASE + 1.5 : FONT_BASE;
            ctx.font = `${sz}px 'DM Mono', 'Courier New', monospace`;
            ctx.fillStyle = `rgba(${G_R},${G_G},${G_B},${wordCell.opacity.toFixed(3)})`;
            ctx.fillText(wordCell.char, posX, y);
          } else {
            if (cell.opacity < 0.02) continue;
            const sz = FONT_BASE + cell.sizeVar;
            ctx.font = `${sz}px 'DM Mono', 'Courier New', monospace`;
            ctx.fillStyle = `rgba(${G_R},${G_G},${G_B},${cell.opacity.toFixed(3)})`;
            ctx.fillText(cell.char, posX, y);
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
      }}
    />
  );
}
