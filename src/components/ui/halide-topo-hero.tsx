import { cn } from "@/lib/utils";
import { useState } from "react";

export const HalideTopoHero = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-4xl font-mono font-bold text-orange-500">{count}</h2>
      <div className="flex gap-4">
        <button 
            onClick={() => setCount((prev) => prev - 1)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
        >-</button>
        <button 
            onClick={() => setCount((prev) => prev + 1)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
        >+</button>
      </div>
    </div>
  );
};
