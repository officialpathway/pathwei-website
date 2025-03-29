import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff2a6d',
        'neon-blue': '#05d9e8',
        'neon-purple': '#d300c5',
        'neon-cyan': '#00f1ff',
        'neon-green': '#00ff85',
        'neon-yellow': '#f9f002',
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config;