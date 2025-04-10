// components/Hero/Terminal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { COMMANDS } from '@/src/lib/constants/constants'

interface TerminalProps {
  compactMode?: boolean;
  width?: string;
  height?: string;
  borderColor?: string;
  accentColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
}

export default function Terminal({ 
  compactMode = false,
  width = "100%",
  height = "100%",
  borderColor = "var(--neon-electric)",
  accentColor = "var(--neon-electric)",
  secondaryColor = "var(--neon-fuchsia)",
  tertiaryColor = "var(--neon-aqua)",
}: TerminalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [showModules, setShowModules] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalContentRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom when output changes
  useEffect(() => {
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [cmd, ...args] = input.toLowerCase().trim().split(' ');
    
    if (cmd === 'clear') {
      setOutput([]);
      setShowModules(false);
    } 
    else {
      const commandOutput = typeof COMMANDS[cmd as keyof typeof COMMANDS] === 'function'
        ? (COMMANDS[cmd as keyof typeof COMMANDS] as (args: string[]) => string)(args)
        : COMMANDS[cmd as keyof typeof COMMANDS] || 'Command not found';
      setOutput(prev => [...prev, `> ${input}`, commandOutput as string]);
      
      // Set showModules flag separately based on command
      if (cmd === 'ls') {
        setShowModules(true);
      }
    }
    
    setInput('');
  };

  // Calculate terminal content height based on whether modules are shown
  const terminalContentHeight = showModules 
    ? 'calc(60% - 40px)' 
    : 'calc(100% - 80px)';

  return (
    <div 
      className={`font-mono ${compactMode ? 'text-xs' : 'text-sm'} 
        border-2 rounded-lg p-6 bg-white bg-opacity-90 backdrop-blur-sm shadow-lg flex flex-col`}
      style={{ 
        width, 
        height,
        borderColor 
      }}
    >
      {/* Terminal header - white with electric colors */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tertiaryColor }} />
        <div className="font-mono text-sm ml-2" style={{ color: accentColor }}>
          AI_HAVEN_TERMINAL
        </div>
      </div>

      {/* Terminal content - with fixed height */}
      <div 
        ref={terminalContentRef}
        className="font-mono text-gray-800 overflow-y-auto mb-4 terminal-scroll flex-grow" 
        style={{ height: terminalContentHeight, maxHeight: terminalContentHeight }}
      >
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-2">
            {line}
          </div>
        ))}

        <form onSubmit={handleSubmit} className="flex items-center">
          <span className="mr-2" style={{ color: secondaryColor }}>{'>'}</span>
          <input
            title='Terminal Input'
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-transparent border-none outline-none text-gray-800 font-mono w-full"
            style={{ caretColor: accentColor }}
            spellCheck={false}
          />
          <span className="animate-pulse" style={{ color: accentColor }}>|</span>
        </form>

        {/* Guiding message */}
        <div className="mt-4" style={{ color: accentColor }}>
          Try typing <span style={{ color: secondaryColor }}>&apos;help&apos;</span> and then try any other command.
        </div>
      </div>

      {/* Module display - in a fixed area */}
      {showModules && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2"
          style={{ height: '35%', overflow: 'hidden' }}
        >
          <TerminalModule 
            name="PATHWAY"
            description="AI conversational agent"
            color={`border-2`}
            borderColor={accentColor}
          />
          <TerminalModule 
            name="IMAGE ENGINE"
            description="Generative art system"
            color={`border-2`}
            borderColor={tertiaryColor}
          />
          <TerminalModule 
            name="CODE AI"
            description="ML-powered refactoring"
            color={`border-2`}
            borderColor={secondaryColor}
          />
        </motion.div>
      )}
    </div>
  );
}

function TerminalModule({ 
  name, 
  description, 
  color, 
  borderColor 
}: { 
  name: string; 
  description: string; 
  color: string;
  borderColor: string;
}) {
  return (
    <motion.div 
      className={`p-3 ${color} cursor-pointer transition-colors bg-white bg-opacity-70 rounded-lg flex flex-col justify-between`}
      style={{ borderColor, height: '100%' }}
      whileHover={{ y: -5 }}
    >
      <div>
        <h3 className="text-lg font-bold mb-1 text-gray-800">{name}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      <div className="text-xs" style={{ color: borderColor }}>[CLICK TO LAUNCH]</div>
    </motion.div>
  );
}