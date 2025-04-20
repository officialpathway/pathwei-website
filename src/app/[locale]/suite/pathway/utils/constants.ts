// utils/constants.ts
import { createTranslator } from 'next-intl';

import type { Messages } from 'next-intl';

type PathwayMessages = Messages & {
  app: {
    name: string;
    description: string;
  };
  feedback: {
    gamification: { title: string; content: string; user: string };
    productivity: { title: string; content: string; user: string };
    social: { title: string; content: string; user: string };
    general: { title: string; content: string; user: string };
  };
  categories: {
    exercise: {
      name: string;
      goals: {
        marathon: string;
        yoga: string;
        strength: string;
        flexibility: string;
        kickboxing: string;
      };
    };
  };
  steps: {
    exercise: {
      marathon: string[];
    };
  };
};

export const getPathwayConstants = (t: ReturnType<typeof createTranslator<PathwayMessages>>) => ({
  APP: {
    NAME: t('app.name'),
    DESCRIPTION: t('app.description')
  },
  
  FEEDBACK: [
    {
      title: t('feedback.gamification.title'),
      content: t('feedback.gamification.content'),
      user: t('feedback.gamification.user')
    },
    {
      title: t('feedback.productivity.title'),
      content: t('feedback.productivity.content'),
      user: t('feedback.productivity.user')
    },
    {
      title: t('feedback.social.title'),
      content: t('feedback.social.content'),
      user: t('feedback.social.user')
    },
    {
      title: t('feedback.general.title'),
      content: t('feedback.general.content'),
      user: t('feedback.general.user')
    }
  ],

  CATEGORIES: [
    {
      name: t('categories.exercise.name'),
      icon: "🏃‍♂️",
      color: "from-blue-500 to-cyan-400",
      textColor: "text-blue-800",
      goals: [
        t('categories.exercise.goals.marathon'),
        t('categories.exercise.goals.yoga'),
      ]
    },
    {
      name: t('categories.learning.name'),
      icon: "🧠",
      color: "from-purple-500 to-pink-400",
      textColor: "text-purple-800",
      goals: [
        t('categories.learning.goals.data_science'),
        t('categories.learning.goals.japanese'),
      ]
    },
    {
      name: t('categories.career.name'),
      icon: "💼",
      color: "from-amber-500 to-orange-400",
      textColor: "text-amber-800",
      goals: [
        t('categories.career.goals.business'),
        t('categories.career.goals.public_speaking'),
      ]
    },
    {
      name: t('categories.creativity.name'),
      icon: "🎨",
      color: "from-green-500 to-emerald-400",
      textColor: "text-green-800",
      goals: [
        t('categories.creativity.goals.novel'),
        t('categories.creativity.goals.digital_art'),
        t('categories.creativity.goals.web_design'),
      ]
    },
    {
      name: t('categories.wellness.name'),
      icon: "🧘",
      color: "from-red-500 to-rose-400",
      textColor: "text-red-800",
      goals: [
        t('categories.wellness.goals.meditation'),
        t('categories.wellness.goals.stress'),
        t('categories.wellness.goals.habits'),
      ]
    }
  ],

  QUESTIONS: [
    {
      question: t('questions.piano.symbol'),
      answer: t('questions.piano.answer_soft'),
      isCorrect: true
    },
    {
      question: t('questions.piano.keys'),
      answer: t('questions.piano.answer_keys'),
      isCorrect: true
    },
    {
      question: t('questions.piano.chord'),
      answer: t('questions.piano.answer_chord'),
      isCorrect: true
    },
    {
      question: t('questions.piano.position'),
      answer: t('questions.piano.answer_position'),
      isCorrect: true
    },
    {
      question: t('questions.piano.pedal'),
      answer: t('questions.piano.answer_pedal'),
      isCorrect: false
    }
  ],

  STEPS: {
    [t('categories.exercise.name')]: {
      [t('categories.exercise.goals.marathon')]: [
        t('steps.exercise.marathon.0'),
        t('steps.exercise.marathon.1'),
        t('steps.exercise.marathon.2'),
        t('steps.exercise.marathon.3')
      ],
      [t('categories.exercise.goals.yoga')]: [
        t('steps.exercise.yoga.0'),
        t('steps.exercise.yoga.1'),
        t('steps.exercise.yoga.2'),
        t('steps.exercise.yoga.3')
      ]
    },
    [t('categories.learning.name')]: {
      [t('categories.learning.goals.data_science')]: [
        t('steps.learning.data_science.0'),
        t('steps.learning.data_science.1'),
        t('steps.learning.data_science.2'),
        t('steps.learning.data_science.3')
      ],
      [t('categories.learning.goals.japanese')]: [
        t('steps.learning.japanese.0'),
        t('steps.learning.japanese.1'),
        t('steps.learning.japanese.2'),
        t('steps.learning.japanese.3')
      ]
    },
    [t('categories.career.name')]: {
      [t('categories.career.goals.business')]: [
        t('steps.career.business.0'),
        t('steps.career.business.1'),
        t('steps.career.business.2'),
        t('steps.career.business.3')
      ],
      [t('categories.career.goals.public_speaking')]: [
        t('steps.career.public_speaking.0'),
        t('steps.career.public_speaking.1'),
        t('steps.career.public_speaking.2'),
        t('steps.career.public_speaking.3')
      ]
    },
    [t('categories.creativity.name')]: {
      [t('categories.creativity.goals.novel')]: [
        t('steps.creativity.novel.0'),
        t('steps.creativity.novel.1'),
        t('steps.creativity.novel.2'),
        t('steps.creativity.novel.3')
      ],
      [t('categories.creativity.goals.digital_art')]: [
        t('steps.creativity.digital_art.0'),
        t('steps.creativity.digital_art.1'),
        t('steps.creativity.digital_art.2'),
        t('steps.creativity.digital_art.3')
      ],
      [t('categories.creativity.goals.web_design')]: [
        t('steps.creativity.web_design.0'),
        t('steps.creativity.web_design.1'),
        t('steps.creativity.web_design.2'),
        t('steps.creativity.web_design.3')
      ]
    },
    [t('categories.wellness.name')]: {
      [t('categories.wellness.goals.meditation')]: [
        t('steps.wellness.meditation.0'),
        t('steps.wellness.meditation.1'),
        t('steps.wellness.meditation.2'),
        t('steps.wellness.meditation.3')
      ],
      [t('categories.wellness.goals.stress')]: [
        t('steps.wellness.stress.0'),
        t('steps.wellness.stress.1'),
        t('steps.wellness.stress.2'),
        t('steps.wellness.stress.3')
      ],
      [t('categories.wellness.goals.habits')]: [
        t('steps.wellness.habits.0'),
        t('steps.wellness.habits.1'),
        t('steps.wellness.habits.2'),
        t('steps.wellness.habits.3')
      ]
    }
  }
});

// Usage example in a component:
/*
import { useTranslations } from 'next-intl';
import { getPathwayConstants } from '@/utils/constants';

function MyComponent() {
  const t = useTranslations('Pathway');
  const constants = getPathwayConstants(t);
  // Use constants.APP_NAME, etc.
}
*/