/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Base
				white: '#FFFFFF',
				'off-white': '#F9F8F6',
				fog: '#F1EFEA',
				border: '#E5E3DF',
				stone: '#E8E7E2',
				
				// Dark
				obsidian: '#000000',
				'obsidian-deep': '#0A0A0A',
				'obsidian-technical': '#0D0D0D',
				smoke: '#1A1A1A',
				
				moss: {
					DEFAULT: '#4E5B4B',
					muted: 'rgba(78, 91, 75, 0.1)',
				},
				
				// System
				ink: '#0A0A0A',
				'parchment-text': '#F2F2F2',
				'dim-text': 'rgba(242, 242, 242, 0.6)',
			},
			fontFamily: {
				brand: ['Lanche', 'Instrument Serif', 'serif'],
				display: ['"Instrument Serif"', 'serif'],
				body: ['"Public Sans"', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'monospace'],
				serif: ['"Crimson Pro"', 'serif'],
			},
			transitionTimingFunction: {
				monumental: 'cubic-bezier(0.85, 0, 0.15, 1)',
			},
		},
	},
	plugins: [],
};
