'use client';

import { useEffect, useState, useRef } from 'react';

const chars = "!<>-_\\/[]{}—=+*^?#________";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
}

export const TextScramble = ({
  text,
  className = '',
  scrambleOnHover = true,
}: TextScrambleProps) => {
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const queueRef = useRef<{ from: string; to: string; start: number; end: number; char?: string }[]>([]);

  const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

  const scramble = (newText: string) => {
    const oldText = displayText;
    const length = Math.max(oldText.length, newText.length);
    
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      queueRef.current.push({ from, to, start, end });
    }

    cancelAnimationFrame(animationRef.current!);
    frameRef.current = 0;
    update();
  };

  const update = () => {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = queueRef.current.length; i < n; i++) {
      const { from, to, start, end } = queueRef.current[i];
      let { char } = queueRef.current[i];
      
      if (frameRef.current >= end) {
        complete++;
        output += to;
      } else if (frameRef.current >= start) {
        if (!char || Math.random() < 0.28) {
          char = randomChar();
          queueRef.current[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }

    setDisplayText(output);

    if (complete === queueRef.current.length) {
      cancelAnimationFrame(animationRef.current!);
    } else {
      frameRef.current++;
      animationRef.current = requestAnimationFrame(update);
    }
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current!);
    };
  }, []);

  return (
    <span 
      className={`inline-block ${className}`}
      onMouseEnter={() => scrambleOnHover && scramble(text)}
      onMouseLeave={() => scrambleOnHover && scramble(text)}
    >
      {displayText}
    </span>
  );
};