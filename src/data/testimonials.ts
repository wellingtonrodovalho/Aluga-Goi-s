export interface Testimonial {
  id: string;
  author: string;
  origin: string;
  stayDate: string;
  propertyId: string;
  propertyName: string;
  rating: number;
  comment: string;
  verifiedAirbnb: boolean;
  avatarColor: string;
  categoryRatings: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    value: number;
  };
}

export const SUPERHOST_STATS = {
  overallRating: 4.92,
  totalReviews: 91,
  superhostYears: 6,
  responseRate: '100%',
  responseTime: '< 1 hora',
  cleanlinessScore: 4.95,
  accuracyScore: 4.98,
  communicationScore: 5.0,
  locationScore: 4.94,
  valueScore: 4.91,
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'rev-crystal-1',
    author: 'Mariana Silveira',
    origin: 'São Paulo, SP',
    stayDate: 'Fevereiro de 2026',
    propertyId: 'crystal-place-flat-moderno',
    propertyName: 'Crystal Place: Flat Moderno c/ Manobrista e Wi-Fi',
    rating: 5,
    comment:
      'Uma experiência impecável no 17º andar do Crystal Place! O pôr do sol na sacada é espetacular e a comodidade do manobrista gratuito facilita muito. O prédio conta com piscina aquecida deliciosa, minimercado 24h e o Wellington é um anfitrião super solícito. A poucos passos do Parque Areião e do Marista.',
    verifiedAirbnb: true,
    avatarColor: 'bg-emerald-600',
    categoryRatings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      value: 5.0,
    },
  },
  {
    id: 'rev-bueno-1',
    author: 'Dra. Vanessa Cavalcante',
    origin: 'Brasília, DF',
    stayDate: 'Janeiro de 2026',
    propertyId: '2-suites-bueno-hospitais',
    propertyName: '2 Suítes no Bueno com Garagem e Wi-Fi, próximo a Hospitais',
    rating: 5,
    comment:
      'Excelente acomodação em Goiânia! O apartamento é amplo, com 2 suítes privativas impecáveis e ar-condicionado silencioso. Ficamos hospedados para um procedimento no Hospital Albert Einstein / Orion Complex e a localização não poderia ser melhor. O Wellington e a Keyla foram super atenciosos e o Wi-Fi de mais de 300 Mbps funcionou com perfeição.',
    verifiedAirbnb: true,
    avatarColor: 'bg-emerald-600',
    categoryRatings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      value: 5.0,
    },
  },
  {
    id: 'rev-vo-1',
    author: 'Juliana Faria & Família',
    origin: 'Ribeirão Preto, SP',
    stayDate: 'Dezembro de 2025',
    propertyId: 'casa-da-vo-coimbra',
    propertyName: 'Casa da Vó: 3 Quartos, Jardim, 2 Vagas de Garagem',
    rating: 5,
    comment:
      'A Casa da Vó é uma joia acolhedora em Goiânia! Viajamos com nossos filhos e foi maravilhoso ter quintal com rede, churrasqueira e espaço seguro para 2 carros na garagem. Os 3 quartos são muito confortáveis e a casa é extremamente limpa e equipada. Perto do Bueno e de fácil locomoção.',
    verifiedAirbnb: true,
    avatarColor: 'bg-rose-600',
    categoryRatings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      value: 5.0,
    },
  },
  {
    id: 'rev-studio-b-1',
    author: 'Dr. Roberto Guimarães',
    origin: 'Belo Horizonte, MG',
    stayDate: 'Fevereiro de 2026',
    propertyId: 'studio-b-bueno-neurologico',
    propertyName: 'Studio B no Bueno, próximo ao Hospital Neurológico',
    rating: 5,
    comment:
      'Estive em Goiânia para acompanhar um atendimento médico no Hospital Neurológico e a localização do Studio B foi imbatível (dá para ir a pé com tranquilidade). A cozinha em granito tem tudo que você precisa, o ar-condicionado é forte e o check-in por fechadura inteligente é muito ágil.',
    verifiedAirbnb: true,
    avatarColor: 'bg-sky-600',
    categoryRatings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      value: 5.0,
    },
  },
  {
    id: 'rev-studio-a-1',
    author: 'Lucas Fontenele',
    origin: 'São Paulo, SP',
    stayDate: 'Janeiro de 2026',
    propertyId: 'studio-a-bueno-neurologico',
    propertyName: 'Studio A no Bueno, próximo ao Hospital Neurológico',
    rating: 5,
    comment:
      'Studio novíssimo, bem decorado e muito prático. Cama super confortável, Wi-Fi estável e rápido para trabalhar no notebook e prédio seguro. Parabéns ao Wellington pela gestão profissional dos imóveis na Aluga Goiás!',
    verifiedAirbnb: true,
    avatarColor: 'bg-amber-600',
    categoryRatings: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 5.0,
      value: 4.9,
    },
  },
];
