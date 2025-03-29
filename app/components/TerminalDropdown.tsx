'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';

const AI_APPS = [
  { name: 'NEURAL CHATBOT', id: 'chat', description: 'AI conversational agent', link: '/chat' },
  { name: 'IMAGE SYNTHESIS', id: 'image', description: 'Generative art engine', link: '/image-gen' },
  { name: 'CODE OPTIMIZER', id: 'code', description: 'ML-powered refactoring', link: '/code-ai' },
];

export default function TerminalDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleTerminal = () => {
    if (!isOpen) {
      // Open animation
      gsap.fromTo(dropdownRef.current, 
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
      gsap.to(dropdownRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        onComplete: () => setIsOpen(false)
      });
    }
  };

  return (
    <div className="relative">
      {/* Terminal Button */}
      <button 
        onClick={toggleTerminal}
        className="px-8 py-4 bg-transparent border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/20 transition-all duration-300 flex items-center group"
      >
        <span className="mr-2">{isOpen ? 'CLOSE TERMINAL' : 'ENTER TERMINAL'}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-90' : 'group-hover:translate-x-1'}`}>
          →
        </span>
      </button>

      {/* App Dropdown */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute left-0 mt-2 w-64 bg-black/90 border-2 border-neon-cyan overflow-hidden"
          style={{
            boxShadow: '0 0 15px rgba(0, 255, 255, 0.7)',
            backdropFilter: 'blur(5px)'
          }}
        >
          <div className="p-2 border-b border-neon-cyan/50 text-neon-green font-mono text-sm">
            {`>_ AVAILABLE MODULES`}
          </div>
          
          <ul className="divide-y divide-neon-cyan/20">
            {AI_APPS.map((app) => (
              <li key={app.id}>
                <a
                  href={app.link}
                  className="block px-4 py-3 hover:bg-neon-cyan/10 transition-colors group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-neon-purple font-bold">{app.name}</span>
                    <span className="text-xs text-neon-green/50 group-hover:text-neon-green">
                      {app.description}
                    </span>
                  </div>
                  <div className="mt-1 h-0.5 bg-gradient-to-r from-neon-purple/50 to-transparent" />
                </a>
              </li>
            ))}
          </ul>

          <div className="p-2 text-xs text-neon-green/50 font-mono text-right">
            SYSTEM_READY
          </div>
        </div>
      )}
    </div>
  );
}