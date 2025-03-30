// components/Hero/Terminal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';
import { ANIMATION_PRESETS } from '@/lib/animationPresets';

const COMMANDS = {
  help: 'Available commands: ls, about, contact, clear, team, roadmap, social, date, uptime, whoami, echo',
  ls: 'Available modules:\n- pathway\n- image-engine\n- code-ai',
  about: 'AI Haven Labs - Building the future of human-AI interaction',
  contact: 'Reach us at: officialpathwayapp@gamil.com',
  clear: '',
  team: `Core Team:
  - Álvaro Ríos Rodríguez (CEO)
  - Rayan Chairi Ben Yamna Boulaich (CTO)
  - Maria Victoria Sánchez Serrano (CMO)`,
  roadmap: `2025 Roadmap:
  Q3: Pathway v2.0 release
  Q4: Image Engine mobile launch
  2025: AI hardware integration`,
  social: `Follow us:
  Instagram: @pathwayapp
  TikTok: @pathwayapp`,
  date: `Current date and time: ${new Date().toLocaleString()}`,
  uptime: 'System uptime: 42 days, 3 hours, 22 minutes',
  echo: (args: string[]) => args.join(' '),
  whoami: 'User: guest',
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startTransition } = useScreenContext();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Typewriter effect for initial prompt
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPrompt(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [cmd, ...args] = input.toLowerCase().trim().split(' ');
    
    if (cmd === 'clear') {
      setOutput([]);
    } 
    else if (cmd === 'about') {
      startTransition('about', { 
        ...ANIMATION_PRESETS.CYBERPUNK,
        duration: 800 // Shorter duration for faster transition
      }, { particles: true });
      setOutput(prev => [...prev, `> ${input}`, COMMANDS.about]);
    }
    else {
      // Handle other commands normally
      const commandOutput = typeof COMMANDS[cmd as keyof typeof COMMANDS] === 'function'
        ? (COMMANDS[cmd as keyof typeof COMMANDS] as (args: string[]) => string)(args)
        : COMMANDS[cmd as keyof typeof COMMANDS] || 'Command not found';
      setOutput(prev => [...prev, `> ${input}`, commandOutput as string]);
    }
    
    setInput('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-black/80 border border-neon-cyan p-6 shadow-lg shadow-neon-cyan/30">
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-neon-red" />
        <div className="w-3 h-3 rounded-full bg-neon-yellow" />
        <div className="w-3 h-3 rounded-full bg-neon-green" />
        <div className="text-neon-purple font-mono text-sm ml-2">
          AI_HAVEN_TERMINAL
        </div>
      </div>

      {/* Terminal content */}
      <div className="font-mono text-neon-green h-96 overflow-y-auto mb-4 terminal-scroll">
        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <TypewriterText 
                text="Welcome to AI Haven Labs. Type 'help' for available commands."
                speed={30}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-2">
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-neon-pink mr-2">{'>'}</span>
          <input
            title='Terminal Input'
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-neon-green font-mono w-full caret-neon-cyan"
            spellCheck={false}
          />
          <span className="text-neon-cyan animate-pulse">|</span>
        </form>

        {/* Guiding message */}
        <div className="text-neon-yellow mt-4">
          Try typing <span className="text-neon-pink">&apos;help&apos;</span> and then try any other command.
        </div>
      </div>

      {/* Module display when 'ls' is entered */}
      {output.some(o => o.includes('ls')) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <TerminalModule 
            name="PATHWAY"
            description="AI conversational agent"
            color="border-neon-purple"
          />
          <TerminalModule 
            name="IMAGE ENGINE"
            description="Generative art system"
            color="border-neon-green"
          />
          <TerminalModule 
            name="CODE AI"
            description="ML-powered refactoring"
            color="border-neon-pink"
          />
        </motion.div>
      )}
    </div>
  );
}

// Helper components
function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setDisplayed(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typing);
      }
    }, speed);

    return () => clearInterval(typing);
  }, [text, speed]);

  return <>{displayed}</>;
}

function TerminalModule({ name, description, color }: { name: string; description: string; color: string }) {
  return (
    <motion.div 
      className={`p-4 border-2 ${color} bg-black/50 hover:bg-black/70 cursor-pointer transition-colors`}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-sm text-gray-400">{description}</p>
      <div className="mt-3 text-xs text-neon-yellow">[CLICK TO LAUNCH]</div>
    </motion.div>
  );
}