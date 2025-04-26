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

  // Use a fixed-width random character
  const randomChar = () => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    return char === '_' ? '\u00A0' : char; // Replace _ with non-breaking space for better alignment
  };

  const scramble = (newText: string) => {
    const oldText = displayText;
    const length = Math.max(oldText.length, newText.length);
    
    queueRef.current = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 10);
      const end = start + Math.floor(Math.random() * 10);
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

  // Process the text to create words for better wrapping
  const processTextForDisplay = () => {
    // Split text into array of words and preserve spaces
    const words = displayText.split(/(\s+)/);
    
    return words.map((word, wordIndex) => {
      // If it's whitespace, return it as a span
      if (/^\s+$/.test(word)) {
        return <span key={`space-${wordIndex}`}>{word}</span>;
      }
      
      // Otherwise render each character in the word
      return (
        <span key={`word-${wordIndex}`} className="inline-flex flex-wrap">
          {word.split('').map((char, charIndex) => (
            <span 
              key={`char-${wordIndex}-${charIndex}`} 
              className="scramble-character inline-block"
              style={{ 
                minWidth: '0.6em',
                textAlign: 'center'
              }}
            >
              {char}
            </span>
          ))}
        </span>
      );
    });
  };

  return (
    <span 
      className={`inline-block font-mono ${className} break-words whitespace-normal`}
      onMouseEnter={() => scrambleOnHover && scramble(text)}
      onMouseLeave={() => scrambleOnHover && scramble(text)}
    >
      {processTextForDisplay()}
    </span>
  );
};