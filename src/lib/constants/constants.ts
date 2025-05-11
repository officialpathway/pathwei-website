// utils/constants/constants.ts
import { createTranslator } from 'next-intl';

import type { Messages } from 'next-intl';

// Actualizado para reflejar la nueva estructura JSON
type PathwayMessages = Messages & {
  meta: {
    name: string;
    description: string;
  };
  feedback: {
    user_opinions: {
      gamification: { title: string; content: string; user: string };
      productivity: { title: string; content: string; user: string };
      social: { title: string; content: string; user: string };
      general: { title: string; content: string; user: string };
    }
  };
  content: {
    categories: {
      exercise: {
        name: string;
        goals: {
          marathon: string;
          yoga: string;
        };
      };
      learning: {
        name: string;
        goals: {
          data_science: string;
          japanese: string;
        };
      };
      career: {
        name: string;
        goals: {
          business: string;
          public_speaking: string;
        };
      };
      creativity: {
        name: string;
        goals: {
          novel: string;
          digital_art: string;
          web_design: string;
        };
      };
      wellness: {
        name: string;
        goals: {
          meditation: string;
          stress: string;
          habits: string;
        };
      };
    };
    steps: {
      exercise: {
        marathon: string[];
        yoga: string[];
      };
      learning: {
        data_science: string[];
        japanese: string[];
        piano: {
          questions: {
            symbol: { question: string; answer: string };
            keys: { question: string; answer: string };
            chord: { question: string; answer: string };
            position: { question: string; answer: string };
            pedal: { question: string; answer: string };
          };
        };
      };
      career: {
        business: string[];
        public_speaking: string[];
      };
      creativity: {
        novel: string[];
        digital_art: string[];
        web_design: string[];
      };
      wellness: {
        meditation: string[];
        stress: string[];
        habits: string[];
      };
    };
  };
};

export const getPathwayConstants = (t: ReturnType<typeof createTranslator<PathwayMessages>>) => ({
  APP: {
    NAME: t('meta.name'),
    DESCRIPTION: t('meta.description')
  },
  
  FEEDBACK: [
    {
      title: t('feedback.user_opinions.gamification.title'),
      content: t('feedback.user_opinions.gamification.content'),
      user: t('feedback.user_opinions.gamification.user')
    },
    {
      title: t('feedback.user_opinions.productivity.title'),
      content: t('feedback.user_opinions.productivity.content'),
      user: t('feedback.user_opinions.productivity.user')
    },
    {
      title: t('feedback.user_opinions.social.title'),
      content: t('feedback.user_opinions.social.content'),
      user: t('feedback.user_opinions.social.user')
    },
    {
      title: t('feedback.user_opinions.general.title'),
      content: t('feedback.user_opinions.general.content'),
      user: t('feedback.user_opinions.general.user')
    }
  ],

  CATEGORIES: [
    {
      name: t('content.categories.exercise.name'),
      icon: "🏃‍♂️",
      color: "from-blue-500 to-cyan-400",
      textColor: "text-blue-800",
      goals: [
        t('content.categories.exercise.goals.marathon'),
        t('content.categories.exercise.goals.yoga'),
      ]
    },
    {
      name: t('content.categories.learning.name'),
      icon: "🧠",
      color: "from-purple-500 to-pink-400",
      textColor: "text-purple-800",
      goals: [
        t('content.categories.learning.goals.data_science'),
        t('content.categories.learning.goals.japanese'),
      ]
    },
    {
      name: t('content.categories.career.name'),
      icon: "💼",
      color: "from-amber-500 to-orange-400",
      textColor: "text-amber-800",
      goals: [
        t('content.categories.career.goals.business'),
        t('content.categories.career.goals.public_speaking'),
      ]
    },
    {
      name: t('content.categories.creativity.name'),
      icon: "🎨",
      color: "from-green-500 to-emerald-400",
      textColor: "text-green-800",
      goals: [
        t('content.categories.creativity.goals.novel'),
        t('content.categories.creativity.goals.digital_art'),
        t('content.categories.creativity.goals.web_design'),
      ]
    },
    {
      name: t('content.categories.wellness.name'),
      icon: "🧘",
      color: "from-red-500 to-rose-400",
      textColor: "text-red-800",
      goals: [
        t('content.categories.wellness.goals.meditation'),
        t('content.categories.wellness.goals.stress'),
        t('content.categories.wellness.goals.habits'),
      ]
    }
  ],

  /*QUESTIONS: [
    {
      question: t('content.steps.learning.piano.questions.symbol.question'),
      answer: t('content.steps.learning.piano.questions.symbol.answer'),
      isCorrect: true
    },
    {
      question: t('content.steps.learning.piano.questions.keys.question'),
      answer: t('content.steps.learning.piano.questions.keys.answer'),
      isCorrect: true
    },
    {
      question: t('content.steps.learning.piano.questions.chord.question'),
      answer: t('content.steps.learning.piano.questions.chord.answer'),
      isCorrect: true
    },
    {
      question: t('content.steps.learning.piano.questions.position.question'),
      answer: t('content.steps.learning.piano.questions.position.answer'),
      isCorrect: true
    },
    {
      question: t('content.steps.learning.piano.questions.pedal.question'),
      answer: t('content.steps.learning.piano.questions.pedal.answer'),
      isCorrect: false
    }
  ],*/

  STEPS: {
    [t('content.categories.exercise.name')]: {
      [t('content.categories.exercise.goals.marathon')]: [
        t('content.steps.exercise.marathon.0'),
        t('content.steps.exercise.marathon.1'),
        t('content.steps.exercise.marathon.2'),
        t('content.steps.exercise.marathon.3'),
        t('content.steps.exercise.marathon.4')
      ],
      [t('content.categories.exercise.goals.yoga')]: [
        t('content.steps.exercise.yoga.0'),
        t('content.steps.exercise.yoga.1'),
        t('content.steps.exercise.yoga.2'),
        t('content.steps.exercise.yoga.3'),
        t('content.steps.exercise.yoga.4')
      ]
    },
    [t('content.categories.learning.name')]: {
      [t('content.categories.learning.goals.data_science')]: [
        t('content.steps.learning.data_science.0'),
        t('content.steps.learning.data_science.1'),
        t('content.steps.learning.data_science.2'),
        t('content.steps.learning.data_science.3'),
        t('content.steps.learning.data_science.4')
      ],
      [t('content.categories.learning.goals.japanese')]: [
        t('content.steps.learning.japanese.0'),
        t('content.steps.learning.japanese.1'),
        t('content.steps.learning.japanese.2'),
        t('content.steps.learning.japanese.3'),
        t('content.steps.learning.japanese.4')
      ]
    },
    [t('content.categories.career.name')]: {
      [t('content.categories.career.goals.business')]: [
        t('content.steps.career.business.0'),
        t('content.steps.career.business.1'),
        t('content.steps.career.business.2'),
        t('content.steps.career.business.3'),
        t('content.steps.career.business.4')
      ],
      [t('content.categories.career.goals.public_speaking')]: [
        t('content.steps.career.public_speaking.0'),
        t('content.steps.career.public_speaking.1'),
        t('content.steps.career.public_speaking.2'),
        t('content.steps.career.public_speaking.3'),
        t('content.steps.career.public_speaking.4')
      ]
    },
    [t('content.categories.creativity.name')]: {
      [t('content.categories.creativity.goals.novel')]: [
        t('content.steps.creativity.novel.0'),
        t('content.steps.creativity.novel.1'),
        t('content.steps.creativity.novel.2'),
        t('content.steps.creativity.novel.3'),
        t('content.steps.creativity.novel.4')
      ],
      [t('content.categories.creativity.goals.digital_art')]: [
        t('content.steps.creativity.digital_art.0'),
        t('content.steps.creativity.digital_art.1'),
        t('content.steps.creativity.digital_art.2'),
        t('content.steps.creativity.digital_art.3'),
        t('content.steps.creativity.digital_art.4')
      ],
      [t('content.categories.creativity.goals.web_design')]: [
        t('content.steps.creativity.web_design.0'),
        t('content.steps.creativity.web_design.1'),
        t('content.steps.creativity.web_design.2'),
        t('content.steps.creativity.web_design.3'),
        t('content.steps.creativity.web_design.4')
      ]
    },
    [t('content.categories.wellness.name')]: {
      [t('content.categories.wellness.goals.meditation')]: [
        t('content.steps.wellness.meditation.0'),
        t('content.steps.wellness.meditation.1'),
        t('content.steps.wellness.meditation.2'),
        t('content.steps.wellness.meditation.3'),
        t('content.steps.wellness.meditation.4')
      ],
      [t('content.categories.wellness.goals.stress')]: [
        t('content.steps.wellness.stress.0'),
        t('content.steps.wellness.stress.1'),
        t('content.steps.wellness.stress.2'),
        t('content.steps.wellness.stress.3'),
        t('content.steps.wellness.stress.4')
      ],
      [t('content.categories.wellness.goals.habits')]: [
        t('content.steps.wellness.habits.0'),
        t('content.steps.wellness.habits.1'),
        t('content.steps.wellness.habits.2'),
        t('content.steps.wellness.habits.3'),
        t('content.steps.wellness.habits.4')
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