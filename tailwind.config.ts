import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './components/styles/*.{html,js,css}'
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff2a6d',
          blue: '#05d9e8',
          purple: '#d300c5',
          cyan: '#00f1ff',
          green: '#00ff85',
          yellow: '#f9f002',
          red: '#ff1a1a',
        },
        // Glow effects
        'glow-cyan': '0 0 10px rgba(0, 241, 255, 0.8)',
        'glow-pink': '0 0 10px rgba(255, 42, 109, 0.8)',
        'glow-blue': '0 0 10px rgba(5, 217, 232, 0.8)',
        'glow-purple': '0 0 10px rgba(211, 0, 197, 0.8)',
        'glow-green': '0 0 10px rgba(0, 255, 133, 0.8)',
        'glow-yellow': '0 0 10px rgba(249, 240, 2, 0.8)'
      },
      boxShadow: {
        'glow-cyan': '0 0 10px rgba(0, 241, 255, 0.8)',
        'glow-pink': '0 0 10px rgba(255, 42, 109, 0.8)',
        'glow-blue': '0 0 10px rgba(5, 217, 232, 0.8)',
        'glow-purple': '0 0 10px rgba(211, 0, 197, 0.8)',
        'glow-green': '0 0 10px rgba(0, 255, 133, 0.8)',
        'glow-yellow': '0 0 10px rgba(249, 240, 2, 0.8)'
      },
      fontFamily: {
        sans: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Orbitron', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

    },
  },
  plugins: [],
}

export default config;