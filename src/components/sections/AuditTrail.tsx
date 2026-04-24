import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAnimationDefaults } from '../../lib/animations';

gsap.registerPlugin(ScrollTrigger);

export const AuditTrail: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const anim = getAnimationDefaults();

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                }
            });

            tl.from(".audit-element", {
                opacity: 0,
                y: 20,
                duration: anim.duration,
                ease: "power2.out",
                stagger: 0.1
            });

            // Animate the "log lines"
            tl.from(".log-line", {
                width: 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power3.out"
            }, "-=0.5");

        }, sectionRef);

        return () => ctx.revert();
    }, [anim.duration]);

    const auditLogs = [
        { id: "LOG-482-X", status: "VERIFIED", hash: "sha256:8f3c...2a1b", label: "Kernel Integrity" },
        { id: "LOG-483-X", status: "VERIFIED", hash: "sha256:1d9e...5f4c", label: "Memory Isolation" },
        { id: "LOG-484-X", status: "VERIFIED", hash: "sha256:9a2b...7e8d", label: "Data Persistence" },
        { id: "LOG-485-X", status: "VERIFIED", hash: "sha256:3c4d...1f0e", label: "Network Handshake" },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative min-h-[80dvh] bg-[#0D0D0D] py-32 px-[6vw] overflow-hidden flex flex-col font-sans text-white/90"
        >
            {/* GRID OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                
                {/* LEFT: TECHNICAL CONTEXT */}
                <div className="lg:col-span-5 space-y-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 audit-element">
                            <span className="text-[10px] tracking-[0.4em] uppercase text-white/30 font-mono">
                                02 // Audit Trail
                            </span>
                            <div className="h-[1px] w-12 bg-white/10" />
                        </div>
                        
                        <h2 className="audit-element font-serif text-5xl md:text-7xl text-white leading-[0.95] tracking-tighter">
                            Transparência <br />
                            <span className="italic opacity-70">Radical</span>
                        </h2>
                    </div>

                    <div className="space-y-6 max-w-sm audit-element">
                        <p className="text-[13px] leading-relaxed text-white/50 font-sans">
                            Every state transition is cryptographically anchored. No probabilistic shortcuts. No opaque layers. 
                            The audit trail provides deterministic proof of integrity for every operation in the Elysian stack.
                        </p>
                        
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-mono">System Health</span>
                                <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-500 font-mono">Nominal</span>
                            </div>
                            <div className="w-full bg-white/5 h-[1px]">
                                <div className="bg-white/20 h-full w-full animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: DATA GRID (ESTRUTURA E) */}
                <div className="lg:col-span-7">
                    <div className="border border-white/10 rounded-sm overflow-hidden audit-element">
                        {/* HEADER */}
                        <div className="bg-white/5 px-6 py-4 border-b border-white/10 grid grid-cols-12 gap-4">
                            <div className="col-span-3 text-[9px] tracking-[0.3em] uppercase text-white/30 font-mono">ID</div>
                            <div className="col-span-3 text-[9px] tracking-[0.3em] uppercase text-white/30 font-mono">Status</div>
                            <div className="col-span-6 text-[9px] tracking-[0.3em] uppercase text-white/30 font-mono">Audit Hash</div>
                        </div>

                        {/* LOG ENTRIES */}
                        <div className="divide-y divide-white/5 font-mono">
                            {auditLogs.map((log) => (
                                <div key={log.id} className="px-6 py-5 grid grid-cols-12 gap-4 hover:bg-white/[0.02] transition-colors group">
                                    <div className="col-span-3 text-[11px] text-white/60">{log.id}</div>
                                    <div className="col-span-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-[10px] text-emerald-500/80 tracking-wider uppercase">{log.status}</span>
                                    </div>
                                    <div className="col-span-6 text-[10px] text-white/30 group-hover:text-white/50 transition-colors truncate">
                                        {log.hash}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER METRICS */}
                        <div className="bg-white/[0.02] p-8 grid grid-cols-2 gap-8 border-t border-white/10">
                            <div className="space-y-1">
                                <div className="text-[24px] font-serif text-white tracking-tight">0.000s</div>
                                <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-mono">Latency Jitter</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[24px] font-serif text-white tracking-tight">2^256</div>
                                <div className="text-[9px] tracking-[0.2em] uppercase text-white/30 font-mono">Entropy Resistance</div>
                            </div>
                        </div>
                    </div>

                    {/* DECORATIVE TERMINAL DECORATION */}
                    <div className="mt-8 flex justify-between items-end audit-element">
                        <div className="space-y-2">
                            <div className="text-[9px] text-white/20 font-mono uppercase tracking-[0.4em]">System Output // T-01</div>
                            <div className="flex gap-1">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="log-line w-2 h-[2px] bg-white/10" />
                                ))}
                            </div>
                        </div>
                        <div className="text-[10px] text-white/20 font-mono uppercase tracking-[0.2em]">
                            ELYSIAN-TRUSTWARE-PROTOCOL-V2
                        </div>
                    </div>
                </div>

            </div>

            {/* BACKGROUND METADATA */}
            <div className="absolute bottom-12 right-12 opacity-10 pointer-events-none hidden lg:block">
                <pre className="text-[8px] font-mono leading-tight text-white uppercase tracking-widest">
                    {`[SECURITY_AUDIT_MODE]
[STATUS: ACTIVE]
[INTEGRITY: 100%]
[SOURCE: DISPERSED_LEDGER]`}
                </pre>
            </div>
        </section>
    );
};
