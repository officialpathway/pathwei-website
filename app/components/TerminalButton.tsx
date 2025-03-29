'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';

export default function TerminalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const apps = [
    { name: 'Pathway', id: 'chat', link: 'https://aihavenlabs.com/', color: 'text-neon-purple' },
    { name: 'IMAGE ENGINE', id: 'image', link: '/image', color: 'text-neon-green' },
    { name: 'CODE AI', id: 'code', link: '/code', color: 'text-neon-pink' },
  ];

  const toggleTerminal = () => {
    if (!isOpen) {
      // Open animation
      gsap.fromTo(terminalRef.current, 
        { height: 0, opacity: 0 },
        { 
          height: 'auto',
          opacity: 1,
          duration: 0.5,
          ease: 'power3.inOut',
          onStart: () => setIsOpen(true)
        }
      );
    } else {
      // Close animation
      gsap.to(terminalRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        onComplete: () => setIsOpen(false)
      });
    }
  };

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <button
        onClick={toggleTerminal}
        className="px-6 py-3 bg-black border-2 border-neon-blue text-neon-blue 
        hover:bg-neon-blue/10 transition-all flex items-center group"
      >
        <span className="mr-2 font-mono">{isOpen ? 'CLOSE_TERMINAL' : 'ACCESS_TERMINAL'}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
          ▸
        </span>
      </button>

      {/* Terminal Dropdown */}
      <div
        ref={terminalRef}
        className="absolute left-0 mt-1 w-72 bg-gray-900/95 border-2 border-neon-blue 
        overflow-hidden shadow-lg shadow-neon-blue/30 origin-top"
        style={{ display: isOpen ? 'block' : 'none' }}
      >
        {/* Terminal Header */}
        <div className="p-2 bg-black border-b border-neon-blue/50 font-mono 
        text-neon-green flex justify-between items-center">
          <span>AI_HAVEN_MODULES</span>
          <span className="text-xs">v2.4.1</span>
        </div>

        {/* App List */}
        <ul className="divide-y divide-neon-blue/20">
          {apps.map((app) => (
            <li key={app.id}>
              <a
                href={app.link}
                className={`block px-4 py-3 hover:bg-neon-blue/5 transition-colors ${app.color}`}
              >
                <div className="flex justify-between items-center font-mono">
                  <span>{app.name}</span>
                  <span className="text-xs text-white/50 hover:text-white">[LAUNCH]</span>
                </div>
                <div className="mt-1 h-px bg-gradient-to-r from-neon-blue to-transparent" />
              </a>
            </li>
          ))}
        </ul>

        {/* Terminal Footer */}
        <div className="p-2 bg-black border-t border-neon-blue/50 text-xs 
        text-neon-green/70 font-mono">
          SYSTEM_READY_
          <span className="animate-pulse">▋</span>
        </div>
      </div>
    </div>
  );
}