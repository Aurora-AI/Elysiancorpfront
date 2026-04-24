/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				// Base
				white: '#FFFFFF',
				'off-white': '#F8F7F3',
				fog: '#F2F1ED',
				stone: '#E8E7E2',
				
				// Dark
				obsidian: '#000000',
				'obsidian-deep': '#0A0A0A',
				'obsidian-technical': '#0D0D0D',
				smoke: '#1A1A1A',
				
				// Accent
				emerald: {
					DEFAULT: '#10B981',
					hover: '#059669',
					muted: 'rgba(16, 185, 129, 0.08)',
				},
				
				// System
				ink: '#0A0A0A',
				'parchment-text': '#F2F2F2',
				'dim-text': 'rgba(242, 242, 242, 0.6)',
			},
			fontFamily: {
				display: ['"Plus Jakarta Sans"', 'Söhne', 'system-ui', 'sans-serif'],
				body: ['"Plus Jakarta Sans"', 'Söhne', 'system-ui', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'monospace'],
			},
			transitionTimingFunction: {
				monumental: 'cubic-bezier(0.85, 0, 0.15, 1)',
			},
		},
	},
	plugins: [],
};
