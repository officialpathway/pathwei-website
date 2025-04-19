// utils/constants.ts
export const APP_NAME = 'Pathway';
export const APP_DESCRIPTION = 'Transforma tu productividad con IA, gamificación y redes sociales.';

export const feedbackData = [
  {
    title: "Opinión sobre Gamificación",
    content:
      "Los sistemas de gamificación han cambiado la forma en la que alcanzo mis metas. Pero a veces la competencia puede ser abrumadora.",
    user: "GameMaster92",
  },
  {
    title: "Opinión sobre Aplicaciones de Productividad",
    content:
      "Las aplicaciones me han ayudado a mantenerme organizado, pero encuentro que algunas son difíciles de usar.",
    user: "TaskWizard88",
  },
  {
    title: "Opinión sobre Redes Sociales",
    content:
      "Compartir mis logros en redes sociales me motiva, aunque no quiero que mi privacidad se vea comprometida.",
    user: "SocialStar07",
  },
  {
    title: "Opinión General",
    content:
      "Una combinación de gamificación, productividad y redes sociales es ideal, pero debe ser equilibrada y fácil de usar.",
    user: "BalancedGuru",
  },
];

export const goalCategories = [
  {
    category: "Ejercicio",
    icon: "🏃‍♂️",
    color: "from-blue-500 to-cyan-400",
    textColor: "text-blue-800",
    goals: [
      "Correr un maratón",
      "Dominar el yoga",
      "Desarrollar fuerza muscular",
      "Mejorar la flexibilidad",
      "Aprender kickboxing"
    ]
  },
  {
    category: "Aprendizaje",
    icon: "🧠",
    color: "from-purple-500 to-pink-400",
    textColor: "text-purple-800",
    goals: [
      "Aprender piano",
      "Dominar ciencia de datos",
      "Hablar japonés",
      "Comprender física cuántica",
      "Estudiar historia del arte"
    ]
  },
  {
    category: "Carrera",
    icon: "💼",
    color: "from-amber-500 to-orange-400",
    textColor: "text-amber-800",
    goals: [
      "Empezar un negocio",
      "Obtener un ascenso",
      "Cambiar de carrera",
      "Mejorar habilidades de oratoria",
      "Construir una red profesional"
    ]
  },
  {
    category: "Creatividad",
    icon: "🎨",
    color: "from-green-500 to-emerald-400",
    textColor: "text-green-800",
    goals: [
      "Escribir una novela",
      "Aprender pintura digital",
      "Crear un cortometraje",
      "Diseñar un sitio web",
      "Dominar la fotografía"
    ]
  },
  {
    category: "Bienestar",
    icon: "🧘",
    color: "from-red-500 to-rose-400",
    textColor: "text-red-800",
    goals: [
      "Practicar meditación",
      "Mejorar la calidad del sueño",
      "Reducir el estrés",
      "Desarrollar hábitos saludables",
      "Encontrar un equilibrio entre trabajo y vida"
    ]
  }
];

export const questions = [
  {
    question: "¿Qué significa el símbolo 'p' en una partitura?",
    answer: "Tocar suavemente (piano)",
    isCorrect: true
  },
  {
    question: "¿Cuántas teclas blancas tiene un piano estándar?",
    answer: "52",
    isCorrect: true
  },
  {
    question: "¿Qué notas componen un acorde de Do mayor?",
    answer: "Do, Mi, Sol",
    isCorrect: true
  },
  {
    question: "¿Cuál es la posición correcta de los dedos para una escala de Do?",
    answer: "Pulgar en Do, índice en Re, medio en Mi",
    isCorrect: true
  },
  {
    question: "¿Qué hace el pedal de la derecha?",
    answer: "Hace que el sonido sea más fuerte",
    isCorrect: false
  }
];

export const stepTexts: Record<string, Record<string, string[]>> = {
  "Ejercicio": {
    "Correr un maratón": [
      "Comienza con un plan de entrenamiento para 5K",
      "Construye resistencia con carreras largas semanales",
      "Practica una nutrición e hidratación adecuadas",
      "Completa un medio maratón"
    ],
    "Dominar el yoga": [
      "Aprende posturas y respiración básicas",
      "Practica diariamente durante 30 minutos",
      "Estudia diferentes estilos de yoga",
      "Únete a un taller avanzado de yoga"
    ],
    "Desarrollar fuerza muscular": [
      "Crea un plan de entrenamiento equilibrado",
      "Aprende la técnica adecuada para levantar pesas",
      "Incrementa progresivamente el peso",
      "Optimiza la ingesta de proteínas y la recuperación"
    ],
    "Mejorar la flexibilidad": [
      "Comienza una rutina diaria de estiramientos",
      "Mantén cada estiramiento durante 30 segundos",
      "Agrega estiramientos dinámicos antes de entrenar",
      "Practica ejercicios avanzados de flexibilidad"
    ],
    "Aprender kickboxing": [
      "Domina la postura y movimiento básicos",
      "Practica golpes fundamentales",
      "Añade técnicas de patadas a la rutina",
      "Combina movimientos en combinaciones efectivas"
    ]
  },
  "Aprendizaje": {
    "Aprender piano": [
      "Aprende las notas básicas y posiciones de los dedos",
      "Practica escalas y canciones simples diariamente",
      "Estudia fundamentos de teoría musical",
      "Toca una pieza completa sin errores"
    ],
    "Dominar ciencia de datos": [
      "Aprende los conceptos básicos de programación en Python",
      "Estudia estadística y probabilidad",
      "Practica visualización de datos",
      "Construye modelos de aprendizaje automático"
    ],
    "Hablar japonés": [
      "Domina hiragana y katakana",
      "Amplía tu vocabulario (500 palabras)",
      "Aprende patrones básicos de gramática",
      "Practica conversaciones con hablantes nativos"
    ],
    "Comprender física cuántica": [
      "Estudia fundamentos de física clásica",
      "Aprende los requisitos matemáticos",
      "Estudia la dualidad onda-partícula",
      "Explora conceptos de entrelazamiento cuántico"
    ],
    "Estudiar historia del arte": [
      "Explora arte prehistórico hasta medieval",
      "Estudia períodos del Renacimiento y Barroco",
      "Aprende sobre movimientos de arte moderno",
      "Analiza tendencias de arte contemporáneo"
    ]
  },
  "Carrera": {
    "Empezar un negocio": [
      "Realiza investigación y validación de mercado",
      "Crea un plan de negocios detallado",
      "Asegura financiamiento inicial",
      "Lanza un producto mínimo viable"
    ],
    "Obtener un ascenso": [
      "Define los requisitos para la promoción",
      "Supera las expectativas de tu rol actual",
      "Desarrolla habilidades de liderazgo",
      "Solicita una evaluación de desempeño"
    ],
    "Cambiar de carrera": [
      "Identifica habilidades transferibles",
      "Adquiere nuevas calificaciones relevantes",
      "Construye una red en la industria objetivo",
      "Aplica para puestos en el nuevo campo"
    ],
    "Mejorar habilidades de oratoria": [
      "Únete a un club de oratoria",
      "Practica discursos improvisados",
      "Domina la comunicación no verbal",
      "Presenta frente a una audiencia numerosa"
    ],
    "Construir una red profesional": [
      "Optimiza tu perfil de LinkedIn",
      "Asiste a eventos de la industria mensualmente",
      "Agenda reuniones informales con contactos",
      "Contribuye en comunidades profesionales"
    ]
  },
  "Creatividad": {
    "Escribir una novela": [
      "Desarrolla personajes y un esquema de trama",
      "Escribe el primer borrador (1000 palabras al día)",
      "Revisa y edita el manuscrito",
      "Envía el manuscrito a lectores beta para recibir comentarios"
    ],
    "Aprender pintura digital": [
      "Domina las herramientas y pinceles básicos",
      "Estudia teoría del color y composición",
      "Practica una rutina diaria de bocetos",
      "Completa tu primera obra detallada"
    ],
    "Crear un cortometraje": [
      "Escribe el guión y crea un storyboard",
      "Consigue equipo y personal",
      "Realiza la fotografía principal",
      "Edita el corte final con sonido y efectos"
    ],
    "Diseñar un sitio web": [
      "Aprende los conceptos básicos de HTML y CSS",
      "Estudia principios de diseño UI/UX",
      "Crea wireframes y mockups",
      "Construye un prototipo funcional responsivo"
    ],
    "Dominar la fotografía": [
      "Aprende configuraciones de cámara y exposición",
      "Practica técnicas de composición",
      "Desarrolla habilidades de edición fotográfica",
      "Crea un portafolio temático"
    ]
  },
  "Bienestar": {
    "Practicar meditación": [
      "Empieza con sesiones diarias de 5 minutos",
      "Aprende diferentes técnicas de meditación",
      "Avanza hasta prácticas de 20 minutos",
      "Integra la atención plena en tu día"
    ],
    "Mejorar la calidad del sueño": [
      "Establece un horario de sueño constante",
      "Crea una rutina relajante antes de acostarte",
      "Optimiza tu entorno de sueño",
      "Elimina el uso de pantallas antes de dormir"
    ],
    "Reducir el estrés": [
      "Identifica los principales desencadenantes del estrés",
      "Implementa prácticas diarias de relajación",
      "Aprende técnicas de reestructuración cognitiva",
      "Crea límites entre trabajo y vida personal"
    ],
    "Desarrollar hábitos saludables": [
      "Rastrea tus hábitos diarios actuales",
      "Establece metas específicas de hábitos",
      "Crea disparadores ambientales",
      "Construye consistencia durante 30 días"
    ],
    "Encontrar equilibrio entre trabajo y vida": [
      "Audita el uso del tiempo durante una semana",
      "Establece límites firmes en el trabajo",
      "Programa actividades de ocio regularmente",
      "Practica decir no a compromisos excesivos"
    ]
  }
};
