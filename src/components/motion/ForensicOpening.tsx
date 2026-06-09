import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const COLOR_BG = "#020202";
const COLOR_TEXT = "#A0A0A0";
const COLOR_GOLD = "#D4AF37";
const COLOR_OK = "#505050"; // Dimmer for the OK status as per image

const LOG_LINES = [
  { text: "INIT_SOVEREIGN_ID", time: "0.00ms" },
  { text: "SCAN_CORPUS_MAPPING", time: "1.24ms" },
  { text: "LOAD_TRUSTWARE_PROTOCOLS", time: "4.56ms" },
  { text: "ESTABLISHING_ZERO_TRUST_GATE", time: "8.12ms" },
  { text: "CIP_PIPELINE_ACTIVE", time: "12.44ms" },
];

export const ForensicOpening: React.FC = () => {
  const frame = useCurrentFrame();
  // Using default values if config is missing (for the player)

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_BG,
        color: COLOR_TEXT,
        fontFamily: "'JetBrains Mono', 'Courier New', monospace",
        padding: "40px",
        fontSize: "min(2vw, 16px)",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        border: "1px solid #1A1A1A",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)"
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: `1px solid ${COLOR_OK}`,
          paddingBottom: 10,
          marginBottom: 20,
          opacity: interpolate(frame, [0, 10], [0, 1]),
        }}
      >
        <div style={{ fontSize: 10, opacity: 0.5 }}>
          [ SYSTEM_AUTHORITY: DETERMINISTIC ]
        </div>
        <div style={{ 
          fontSize: 12, 
          letterSpacing: "0.1em",
          fontWeight: 700 
        }}>
          ELYSIANLEX_SOVEREIGN_VIEWER_V2.1
        </div>
      </div>

      {/* Initializing Text */}
      <div
        style={{
          marginBottom: 20,
          opacity: interpolate(frame, [10, 20], [0, 1]),
          color: COLOR_TEXT,
          display: "flex",
          alignItems: "center",
          fontSize: "14px"
        }}
      >
        <span style={{ marginRight: 10 }}>{">"}</span>
        <span>INITIALIZING FORENSIC_AUDIT_SEQUENCE...</span>
      </div>

      {/* Log Sequence */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LOG_LINES.map((line, index) => {
          const startFrame = 30 + index * 10;
          const opacity = interpolate(frame, [startFrame, startFrame + 5], [0, 1]);
          
          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                opacity,
                width: "100%",
                fontSize: "13px"
              }}
            >
              <div style={{ display: "flex", gap: 15 }}>
                <span style={{ color: COLOR_GOLD }}>[{line.time}]</span>
                <span style={{ letterSpacing: "0.05em" }}>{line.text}</span>
              </div>
              <div style={{ color: COLOR_OK, fontWeight: 700 }}>OK</div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status */}
      <div
        style={{
          marginTop: "auto",
          fontSize: 10,
          opacity: 0.3,
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <div>VAULT_SYNC: SECURED</div>
        <div>LATENCY: 0.0002ms</div>
      </div>

      {/* Scanline Effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)",
          backgroundSize: "100% 4px",
          opacity: 0.05
        }}
      />
    </AbsoluteFill>
  );
};
