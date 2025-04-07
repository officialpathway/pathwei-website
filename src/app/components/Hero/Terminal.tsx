// components/Hero/Terminal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

  roadmap: `Future plans:
  - Q4 2025: Launch NEXUS-8
  - Q1 2026: Expand neural interface capabilities
  - Q2 2026: Collaborate with global AI networks`,

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
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [cmd, ...args] = input.toLowerCase().trim().split(' ');
    
    if (cmd === 'clear') {
      setOutput([]);
    } 
    else {
      const commandOutput = typeof COMMANDS[cmd as keyof typeof COMMANDS] === 'function'
        ? (COMMANDS[cmd as keyof typeof COMMANDS] as (args: string[]) => string)(args)
        : COMMANDS[cmd as keyof typeof COMMANDS] || 'Command not found';
      setOutput(prev => [...prev, `> ${input}`, commandOutput as string]);
    }
    
    setInput('');
  };

  return (
    <div className={`h-full font-mono ${compactMode ? 'text-xs' : 'text-sm'} 
      w-full max-w-3xl mx-auto border-2 border-[var(--neon-electric)] 
      rounded-lg p-6 bg-white bg-opacity-90 backdrop-blur-sm shadow-lg`}
    >

      {/* Terminal header - white with electric colors */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-[var(--neon-electric)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--neon-fuchsia)]" />
        <div className="w-3 h-3 rounded-full bg-[var(--neon-aqua)]" />
        <div className="text-[var(--neon-violet)] font-mono text-sm ml-2">
          AI_HAVEN_TERMINAL
        </div>
      </div>

      {/* Terminal content */}
      <div className="font-mono text-gray-800 h-96 overflow-y-auto mb-4 terminal-scroll">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-2">
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="text-[var(--neon-fuchsia)] mr-2">{'>'}</span>
          <input
            title='Terminal Input'
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-800 font-mono w-full caret-[var(--neon-electric)]"
            spellCheck={false}
          />
          <span className="text-[var(--neon-electric)] animate-pulse">|</span>
        </form>

        {/* Guiding message */}
        <div className="text-[var(--neon-violet)] mt-4">
          Try typing <span className="text-[var(--neon-fuchsia)]">&apos;help&apos;</span> and then try any other command.
        </div>
      </div>

      {/* Module display */}
      {output.some(o => o.includes('ls')) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
          <TerminalModule 
            name="PATHWAY"
            description="AI conversational agent"
            color="border-[var(--neon-violet)]"
          />
          <TerminalModule 
            name="IMAGE ENGINE"
            description="Generative art system"
            color="border-[var(--neon-aqua)]"
          />
          <TerminalModule 
            name="CODE AI"
            description="ML-powered refactoring"
            color="border-[var(--neon-fuchsia)]"
          />
        </motion.div>
      )}
    </div>
  );
}

function TerminalModule({ name, description, color }: { name: string; description: string; color: string }) {
  return (
    <motion.div 
      className={`p-4 border-2 ${color} cursor-pointer transition-colors bg-white bg-opacity-70 rounded-lg`}
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-bold mb-2 text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <div className="mt-3 text-xs text-[var(--neon-electric)]">[CLICK TO LAUNCH]</div>
    </motion.div>
  );
}