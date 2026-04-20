import React from 'react';
import { WavePath } from "./wave-path";
import { cn } from '@/lib/utils';

export default function WaveDemo() {
	return (
		<div className="relative w-full flex min-h-screen flex-col items-center justify-center bg-black overflow-hidden">
			{/* Glow Effect */}
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>

			<div className="flex w-[70vw] flex-col items-end z-20">
				<WavePath className="mb-10 text-white" />
				<div className="flex w-full flex-col items-end">
					<div className="flex justify-end gap-12">
						<p className="text-zinc-500 mt-2 text-sm uppercase tracking-widest whitespace-nowrap">
							World of Art
						</p>
						<p className="text-zinc-200 w-3/4 text-2xl md:text-5xl font-light leading-tight text-right">
							Experience the emotions of artists through their works. Let the
							beauty of art inspire you and fill your soul.
						</p>
					</div>
				</div>
                
                {/* Decorative Image */}
                <div className="mt-12 w-full h-[40vh] relative grayscale hover:grayscale-0 transition-all duration-700 ease-in-out">
                    <img 
                        src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop" 
                        alt="Fine Art" 
                        className="w-full h-full object-cover rounded-sm opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                </div>
			</div>
		</div>
	);
}
