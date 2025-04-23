// components/Hero/Terminal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { COMMANDS } from '@/lib/constants/constants'
import Link from 'next/link';

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
    inputRef.current?.focus({ preventScroll: true });
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
      
      if (cmd === 'ls') {
        setShowModules(true);
      }
    }
    
    setInput('');
  };

  const terminalContentHeight = showModules 
    ? 'calc(60% - 40px)' 
    : 'calc(100% - 80px)';

  return (
    <div 
      className={`font-mono ${compactMode ? 'text-xs' : 'text-sm'} 
        border-2 rounded-lg p-6 bg-black bg-opacity-90 backdrop-blur-sm shadow-lg flex flex-col
        border-opacity-50`}
      style={{ 
        width, 
        height,
        borderColor,
        boxShadow: `0 0 15px ${borderColor}33`
      }}
    >
      {/* Terminal header - dark with neon accents */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: secondaryColor }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tertiaryColor }} />
        <div className="font-mono text-sm ml-2 text-gray-300">
          AI_HAVEN_TERMINAL
        </div>
      </div>

      {/* Terminal content - dark theme */}
      <div 
        ref={terminalContentRef}
        className="font-mono text-gray-300 overflow-y-auto mb-4 terminal-scroll flex-grow
                  scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" 
        style={{ 
          height: terminalContentHeight, 
          maxHeight: terminalContentHeight,
          textShadow: '0 0 5px rgba(0, 242, 255, 0.3)'
        }}
      >
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap mb-2">
            {line.includes('>') ? (
              <span style={{ color: secondaryColor }}>{line}</span>
            ) : line.includes('ERROR') ? (
              <span style={{ color: '#ff5555' }}>{line}</span>
            ) : (
              <span style={{ color: tertiaryColor }}>{line}</span>
            )}
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
            className="bg-transparent border-none outline-none text-gray-300 font-mono w-full
                      placeholder-gray-500"
            style={{ 
              caretColor: accentColor,
              textShadow: '0 0 5px rgba(0, 242, 255, 0.3)'
            }}
            spellCheck={false}
            placeholder="type command..."
          />
          <span className="animate-pulse" style={{ color: accentColor }}>|</span>
        </form>

        {/* Guiding message */}
        <div className="mt-4 text-gray-400 text-xs">
          Try typing <span style={{ color: secondaryColor }}>&apos;help&apos;</span> and then try any other command.
        </div>
      </div>

      {/* Module display - dark version */}
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
            link='/suite/pathway'
          />
          <TerminalModule 
            name="IMAGE ENGINE"
            description="Generative art system"
            color={`border-2`}
            borderColor={tertiaryColor}
            link='#'
          />
          <TerminalModule 
            name="CODE AI"
            description="ML-powered refactoring"
            color={`border-2`}
            borderColor={secondaryColor}
            link='#'
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
  borderColor,
  link
}: { 
  name: string; 
  description: string; 
  color: string;
  borderColor: string;
  link: string;
}) {
  return (
    <motion.div 
      className={`p-3 ${color} cursor-pointer transition-all bg-gray-900 bg-opacity-70 rounded-lg flex flex-col justify-between
                hover:bg-opacity-90`}
      style={{ 
        borderColor, 
        height: '100%',
        boxShadow: `0 0 10px ${borderColor}33`
      }}
      whileHover={{ 
        y: -5,
        boxShadow: `0 0 15px ${borderColor}`
      }}
    >
      <div>
        <h3 className="text-lg font-bold mb-1" style={{ color: borderColor }}>{name}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <Link 
        href={link} 
        className="text-xs text-gray-500 hover:text-gray-300 transition-colors block"
        onClick={(e) => {
          if (link === '#') {
            e.preventDefault();
            alert('Module coming soon!');
          }
        }}
      >
        [CLICK TO LAUNCH]
      </Link>
    </motion.div>
  );
}