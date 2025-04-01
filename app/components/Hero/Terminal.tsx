// components/Hero/Terminal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScreenContext } from '@/app/context/ScreenContext';
import { ANIMATION_PRESETS } from '@/lib/animationPresets';

const COMMANDS = {
  // Core commands
  help: `Available commands: 
  [CORE] help, clear, exit
  [INFO] ls, about, team, roadmap, social, date, uptime, whoami
  [INTERACT] echo, neofetch, hack, scan, encrypt, bio`,

  ls: `System modules:
  - pathway (v2.3.1)
  - image-engine (v1.8.4)
  - code-ai (beta)
  /secret/classified`,

  about: `AI Haven Labs [v3.1.4]
  >> Specializing in neural interfaces
  >> Est. 2023 | Security Level: 5`,

  contact: `Encrypted channels only:
  Email: officialpathwayapp@gmail.com
  PGP Key: *********AF3B`,

  clear: '',
  exit: 'Terminating session...',

  // Team info
  team: `Core Team:
  - Álvaro Ríos Rodríguez [CEO] | ID: AR-724
  - Rayan Chairi Ben Yamna Boulaich [CTO] | ID: RC-881
  - Maria Victoria Sánchez Serrano [CMO] | ID: MV-309
  
  AI Systems:
  - NEXUS-7 (Primary Neural Network)`,

  // System commands
  date: `System time: ${new Date().toLocaleString()}
  Network time sync: ACTIVE`,

  uptime: `System status:
  Uptime: ${Math.floor(Math.random() * 100)} days, ${Math.floor(Math.random() * 24)} hours
  Load: ${(Math.random() * 100).toFixed(1)}%`,

  whoami: `User: guest
  Access: LEVEL 1
  Last login: ${new Date().toLocaleString()}`,

  neofetch: `AI Haven Labs Terminal
  OS: NeuroLink v3.1
  Shell: zsh 5.9
  CPU: Quantum Q-9000
  Memory: 128TB/256TB`,

  // Interactive commands
  echo: (args: string[]) => args.join(' ') || 'Error: No input detected',

  hack: `Initiating penetration test...
  Firewall detected: ICE v4.2
  Bypassing security... [23%]
  [SIMULATION TERMINATED]`,

  scan: `Network scan results:
  █ 192.168.7.1 - ROUTER
  █ 192.168.7.15 - NEXUS-7
  █ 192.168.7.42 - UNKNOWN DEVICE`,

  encrypt: (args: string[]) => 
    args.length 
      ? `Ciphertext: ${btoa(args.join(' '))}`
      : 'Usage: encrypt [message]',

  bio: `User biometrics:
  Neural activity: ${Math.floor(Math.random() * 100)}%
  Stress levels: ${Math.floor(Math.random() * 30)}%
  Focus: ${Math.floor(70 + Math.random() * 30)}%`,
};

interface TerminalProps {
  compactMode?: boolean;
}

export default function Terminal({ compactMode = false }: TerminalProps) {

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
    <div className={`h-full font-mono ${compactMode ? 'text-xs' : 'text-sm'} w-full max-w-3xl mx-auto bg-black/80 border border-neon-cyan p-6 shadow-lg shadow-neon-cyan/30`}>

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