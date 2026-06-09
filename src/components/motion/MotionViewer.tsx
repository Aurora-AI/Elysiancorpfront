import React from 'react';
// @ts-ignore
import { Player } from "@remotion/player";
import { ForensicOpening } from "./ForensicOpening";

export const MotionViewer: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px] bg-black rounded-lg overflow-hidden border border-white/5 shadow-2xl relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl pointer-events-none" />
      
      <Player
        component={ForensicOpening}
        durationInFrames={150}
        compositionWidth={800}
        compositionHeight={450}
        fps={30}
        loop
        autoPlay
        style={{
          width: "100%",
          height: "100%",
        }}
        controls={false}
      />
    </div>
  );
};

export default MotionViewer;
