import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Info, Play, ExternalLink } from 'lucide-react';

interface AssetCardProps {
    id: string;
    name: string;
    category: string;
    techniques: string[];
    children: React.ReactNode;
}

export const AssetCard: React.FC<AssetCardProps> = ({ id, name, category, techniques, children }) => {
    const [view, setView] = useState<'preview' | 'info'>('preview');

    return (
        <div className="group relative border border-white/5 bg-white/[0.02] rounded-sm overflow-hidden flex flex-col aspect-[16/10] transition-colors hover:border-white/10">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/5 z-20 bg-abyss/40 backdrop-blur-xl">
                <div>
                    <p className="font-mono text-[10px] opacity-40 uppercase tracking-tighter">{category} // {id}</p>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">{name}</h3>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setView('preview')}
                        className={`p-1.5 rounded-full transition-all duration-500 ${view === 'preview' ? 'bg-[#F4F1EA] text-[#0A0A0A]' : 'opacity-40 hover:opacity-100'}`}
                    >
                        <Play size={12} fill={view === 'preview' ? 'currentColor' : 'none'} />
                    </button>
                    <button 
                        onClick={() => setView('info')}
                        className={`p-1.5 rounded-full transition-all duration-500 ${view === 'info' ? 'bg-[#F4F1EA] text-[#0A0A0A]' : 'opacity-40 hover:opacity-100'}`}
                    >
                        <Info size={12} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative flex-grow overflow-hidden bg-black">
                <AnimatePresence mode="wait">
                    {view === 'preview' ? (
                        <motion.div 
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full h-full relative"
                        >
                            {children}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="info"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                            className="w-full h-full p-8 flex flex-col justify-center gap-6"
                        >
                            <div>
                                <h4 className="font-mono text-[10px] text-[#D4AF37] mb-3 uppercase tracking-widest opacity-80">Techniques_Deployed</h4>
                                <div className="flex flex-wrap gap-2">
                                    {techniques.map(tech => (
                                        <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 text-[9px] font-mono opacity-60 uppercase transition-colors hover:bg-white/10 hover:opacity-100">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:bg-[#F4F1EA] hover:text-[#0A0A0A] text-[9px] font-mono transition-all duration-500 uppercase tracking-widest">
                                    <Code size={10} /> Copy_Import
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-[9px] font-mono transition-all duration-500 uppercase tracking-widest opacity-50 hover:opacity-100">
                                    <ExternalLink size={10} /> Source
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Subtle interactive overlays */}
            <div className="absolute inset-0 pointer-events-none border border-[#F4F1EA]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
};
