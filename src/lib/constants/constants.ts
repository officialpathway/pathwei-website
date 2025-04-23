// lib/constants.ts
import { Product } from "@/app/[locale]/landing/Grid/ProductCard";

export const teamMembers = [
  {
    name: "Alvaro Rios",
    role: "Chief Executive Officer",
    color: "cyan",
    specialty: "STRATEGIC SYNTHESIS",
    imgSrc: "/images/team-portraits/ceo.png",
    id: "ceo",
    title: "FOUNDER & CEO",
    bio: "Former neural interface researcher turned tech entrepreneur. Spearheads our quantum leap into human-AI symbiosis.",
    status: "ONLINE",
    connections: ["NeuroTech Inc", "Quantum Leap Ventures", "Future Humanity Fund"]
  },
  {
    name: "Rayan Chairi",
    role: "Chief Technology Officer",
    color: "pink",
    specialty: "NEURAL OPTIMIZATION",
    imgSrc: "/images/team-portraits/cto.jpeg",
    id: "cto",
    title: "CHIEF TECHNOLOGY OFFICER",
    bio: "Ex-Google DeepMind lead engineer. Built the first self-evolving AI architecture at age 23.",
    status: "IN LAB",
    connections: ["MIT Synthetic Intelligence", "OpenNeuro Collective", "The Turing Guild"]
  },
  {
    name: "Maria Victoria Sanchez",
    role: "Chief Marketing Officer",
    color: "purple",
    specialty: "COGNITIVE ADOPTION",
    imgSrc: "/images/team-portraits/cmo.jpeg",
    id: "cmo",
    title: "CHIEF MARKETING OFFICER",
    bio: "Digital consciousness marketing pioneer. Formerly grew NeuroLink to 50M users in 12 months.",
    status: "IN LAB",
    connections: ["Hologram Advertising", "MindShare Collective", "The Viral Cortex"]
  }
];

export const investors = [
  {
    name: 'NEURAL CAPITAL',
    type: 'LEAD INVESTOR',
    investment: 'Series A - $42M',
    focus: 'Human-AI convergence technologies',
    color: 'neon-green'
  },
  {
    name: 'QUANTUM VENTURES',
    type: 'STRATEGIC PARTNER',
    investment: 'Seed - $15M',
    focus: 'Disruptive neurotech',
    color: 'neon-cyan'
  },
  {
    name: 'FUTURE HORIZON FUND',
    type: 'GROWTH INVESTOR',
    investment: 'Series B - $75M',
    focus: 'Consciousness expansion platforms',
    color: 'neon-yellow'
  }
];

export const supporters = [
  {
    name: 'THE TURING INSTITUTE',
    role: 'RESEARCH PARTNER',
    contribution: 'AI ethics framework development',
    color: 'neon-aqua'
  },
  {
    name: 'NEUROTECH FOUNDATION',
    role: 'OPEN SOURCE SUPPORTER',
    contribution: 'Core algorithm contributions',
    color: 'neon-violet'
  },
  {
    name: 'DIGITAL HUMANITY COUNCIL',
    role: 'ADVISORY BOARD',
    contribution: 'Policy guidance',
    color: 'neon-red'
  }
];

export const apps = [
  {
    id: 'pathway',
    title: 'PATHWAY',
    subtitle: 'Your Progress Partner',
    description: 'Track and achieve your goals with Pathway, the productivity neural-net designed to optimize your human potential.',
    keywords: ['productivity', 'goals', 'progress', 'social web', 'self-improvement'],
    color: 'neon-green',
    features: [
      'Neural goal tracking',
      'Social accountability networks',
      'AI-powered progress predictions',
      'Biometric integration',
      'Blockchain achievement tokens'
    ],
    status: 'ONLINE'
  },
  {
    id: 'neuroforge',
    title: 'NEUROFORGE',
    subtitle: 'Cognitive Enhancement Suite',
    description: 'Augment your mental capabilities with our AI-driven neuro-enhancement platform.',
    keywords: ['brain training', 'focus', 'memory', 'cognitive'],
    color: 'neon-blue',
    features: [
      'Real-time neural optimization',
      'Adaptive learning algorithms',
      'EEG integration',
      'Neurochemical balancing',
      'Dreamstate programming'
    ],
    status: 'BETA'
  },
  {
    id: 'quantumlink',
    title: 'QUANTUMLINK',
    subtitle: 'Decentralized Thought Network',
    description: 'The first truly decentralized AI-human consciousness sharing platform.',
    keywords: ['blockchain', 'AI', 'neural', 'decentralized'],
    color: 'neon-purple',
    features: [
      'Quantum encrypted messaging',
      'Hive-mind knowledge pools',
      'Neural NFT marketplace',
      'Consensus reality builder',
      'Temporal communication channels'
    ],
    status: 'ALPHA'
  },
  {
    id: 'biocore',
    title: 'BIOCORE',
    subtitle: 'Organic-Digital Interface',
    description: 'Bridging the gap between biological and artificial intelligence systems.',
    keywords: ['biotech', 'implants', 'augmentation', 'cybernetics'],
    color: 'neon-pink',
    features: [
      'DNA-based authentication',
      'Nanite health monitoring',
      'Synaptic cloud backup',
      'Biological API endpoints',
      'Regenerative firmware'
    ],
    status: 'PROTOTYPE'
  }
];

export const products: Product[] = [
  {
    name: 'Pathway',
    description: 'Productivity companion that enhances focus while protecting digital wellbeing',
    stats: '↑ 89% task completion | ↓ 62% screen fatigue',
    color: 'neon-cyan'
  },
  {
    name: 'ContentForge',
    description: 'AI-powered creative suite that organizes and generates content ideas',
    stats: '3.1x output speed | 40% better engagement',
    color: 'neon-pink'
  },
  {
    name: 'NeuroLink',
    description: 'Coming soon: Neural interface for thought-to-text workflows',
    stats: 'Patent pending',
    color: 'neon-purple'
  },
  {
    name: 'Chronos',
    description: 'Coming soon: Time optimization engine for creative professionals',
    stats: 'Beta testing Q3 2024',
    color: 'neon-green'
  }
];

export const features = [
  {
    id: 1,
    message: "YOUR GOALS, POWERED BY AI",
    subMessage: "We built this because we watched dreams get buried under busywork. Our AI maps personalized paths to success—helping 530K+ users stay focused on what matters.",
    borderColor: "cyan" as const,
    position: "left",
    top: "10%",
    left: "15%",
    delay: 0.2
  },
  {
    id: 2,
    message: "HUMANS FIRST, ALWAYS",
    subMessage: "Unlike tools that replace you, ours amplify you. 84% of users report achieving goals faster while feeling *more* creative and in control.",
    borderColor: "purple" as const,
    position: "right",
    top: "20%",
    right: "15%",
    delay: 0.4
  },
  {
    id: 3,
    message: "THE FUTURE OF WORK IS HERE",
    subMessage: "We saw the demand for AI that adapts to *you*—not the other way around. Our tech learns your habits, predicts blockers, and course-corrects in real time.",
    borderColor: "pink" as const,
    position: "left",
    top: "35%",
    left: "15%",
    delay: 0.6
  },
  {
    id: 4,
    message: "PROVEN TO WORK",
    subMessage: "Users complete 3.2x more weekly priorities. Founders credit us for hitting milestones 6 months early. Therapists use it to help clients build life-changing habits.",
    borderColor: "green" as const,
    position: "right",
    top: "50%",
    right: "15%",
    delay: 0.8
  },
  {
    id: 5,
    message: "ETHICS BUILT IN",
    subMessage: "We reject surveillance-style productivity. Your data trains *your* AI—never sold or used to manipulate you. (Certified compliant with GDPR and CCPA.)",
    borderColor: "cyan" as const,
    position: "left",
    top: "65%",
    left: "15%",
    delay: 1.0
  },
  {
    id: 6,
    message: "JOIN THE MOVEMENT",
    subMessage: "Over 2,000 teams now use our tools to align work with purpose. From indie creators to Fortune 500s, we’re rewriting how humans and AI collaborate.",
    borderColor: "purple" as const,
    position: "right",
    top: "80%",
    right: "15%",
    delay: 1.2
  },
  {
    id: 7,
    message: "WHAT'S NEXT?",
    subMessage: "We're prototyping AI co-pilots that sense burnout before you do, and tools that turn procrastination patterns into productivity breakthroughs.",
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