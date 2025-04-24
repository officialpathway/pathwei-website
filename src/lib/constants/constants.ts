// lib/constants.ts
import { Product } from "@/app/[locale]/landing/Grid/ProductCard";
import { createTranslator } from 'next-intl';
import type { Messages } from 'next-intl';

// Define the messages interface to include all our translation keys
type aiHavenLabsMessages = Messages & {
  team: {
    members: {
      [key: string]: {
        name: string;
        role: string;
        specialty: string;
        title: string;
        bio: string;
        status: string;
        connections: string[];
      }
    }
  },
  app: {
    name: string;
    subtitle: string;
    description: string;
    keywords: string[];
    features: string[];
    status: string;
  },
  products: {
    [key: string]: {
      name: string;
      description: string;
      stats: string;
    }
  },
  features: {
    [key: string]: {
      message: string;
      subMessage: string;
    }
  }
}

// Update teamMembers to use translations
export const teamMembers = (t: ReturnType<typeof createTranslator<aiHavenLabsMessages>>) => [
  {
    name: t('team.members.ceo.name'),
    role: t('team.members.ceo.role'),
    color: "cyan",
    specialty: t('team.members.ceo.specialty'),
    imgSrc: "/images/team-portraits/ceo.png",
    id: "ceo",
    title: t('team.members.ceo.title'),
    bio: t('team.members.ceo.bio'),
    status: t('team.members.ceo.status'),
    // Use t.raw to get the original array
    connections: t.raw('team.members.ceo.connections') as string[]
  },
  {
    name: t('team.members.cto.name'),
    role: t('team.members.cto.role'),
    color: "pink",
    specialty: t('team.members.cto.specialty'),
    imgSrc: "/images/team-portraits/cto.jpeg",
    id: "cto",
    title: t('team.members.cto.title'),
    bio: t('team.members.cto.bio'),
    status: t('team.members.cto.status'),
    // Use t.raw to get the original array
    connections: t.raw('team.members.cto.connections') as string[]
  },
  {
    name: t('team.members.cmo.name'),
    role: t('team.members.cmo.role'),
    color: "purple",
    specialty: t('team.members.cmo.specialty'),
    imgSrc: "/images/team-portraits/cmo.jpeg",
    id: "cmo",
    title: t('team.members.cmo.title'),
    bio: t('team.members.cmo.bio'),
    status: t('team.members.cmo.status'),
    // Use t.raw to get the original array
    connections: t.raw('team.members.cmo.connections') as string[]
  }
];

// Update apps to use translations
export const apps = (t: ReturnType<typeof createTranslator<aiHavenLabsMessages>>) => ([
  {
    id: t('app.name'),
    title: t('app.name'),
    subtitle: t('app.subtitle'),
    description: t('app.description'),
    // Use t.raw to get the original array instead of a string
    keywords: t.raw('app.keywords') as string[],
    color: 'neon-green',
    // Use t.raw to get the original array instead of a string
    features: t.raw('app.features') as string[],
    status: t('app.status')
  }
]);

// Update products to use translations
export const products = (t: ReturnType<typeof createTranslator<aiHavenLabsMessages>>): Product[] => [
  {
    name: t('products.pathway.name'),
    description: t('products.pathway.description'),
    stats: t('products.pathway.stats'),
    color: 'neon-cyan'
  },
  {
    name: t('products.contentForge.name'),
    description: t('products.contentForge.description'),
    stats: t('products.contentForge.stats'),
    color: 'neon-pink'
  },
  {
    name: t('products.neuroLink.name'),
    description: t('products.neuroLink.description'),
    stats: t('products.neuroLink.stats'),
    color: 'neon-purple'
  },
  {
    name: t('products.chronos.name'),
    description: t('products.chronos.description'),
    stats: t('products.chronos.stats'),
    color: 'neon-green'
  }
];

// Update features to use translations
export const features = (t: ReturnType<typeof createTranslator<aiHavenLabsMessages>>) => [
  {
    id: 1,
    message: t('features.1.message'),
    subMessage: t('features.1.subMessage'),
    borderColor: "cyan" as const,
    position: "left",
    top: "10%",
    left: "15%",
    delay: 0.2
  },
  {
    id: 2,
    message: t('features.2.message'),
    subMessage: t('features.2.subMessage'),
    borderColor: "purple" as const,
    position: "right",
    top: "20%",
    right: "15%",
    delay: 0.4
  },
  {
    id: 3,
    message: t('features.3.message'),
    subMessage: t('features.3.subMessage'),
    borderColor: "pink" as const,
    position: "left",
    top: "35%",
    left: "15%",
    delay: 0.6
  },
  {
    id: 4,
    message: t('features.4.message'),
    subMessage: t('features.4.subMessage'),
    borderColor: "green" as const,
    position: "right",
    top: "50%",
    right: "15%",
    delay: 0.8
  },
  {
    id: 5,
    message: t('features.5.message'),
    subMessage: t('features.5.subMessage'),
    borderColor: "cyan" as const,
    position: "left",
    top: "65%",
    left: "15%",
    delay: 1.0
  },
  {
    id: 6,
    message: t('features.6.message'),
    subMessage: t('features.6.subMessage'),
    borderColor: "purple" as const,
    position: "right",
    top: "80%",
    right: "15%",
    delay: 1.2
  },
  {
    id: 7,
    message: t('features.7.message'),
    subMessage: t('features.7.subMessage'),
    borderColor: "pink" as const,
    position: "left",
    top: "95%",
    left: "15%",
    delay: 1.4
  }
];

export const COMMANDS = {
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