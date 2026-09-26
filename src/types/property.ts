export type PropertyType = 'Apartamento' | 'Flat / Studio' | 'Cobertura' | 'Casa de Temporada' | 'Chalé';

export interface Property {
  id: string;
  title: string;
  slug: string;
  propertyType: PropertyType;
  city: 'Goiânia' | 'Caldas Novas' | 'Pirenópolis' | 'Rio Quente' | 'Anápolis' | string;
  neighborhood: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  cleaningFee: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  maxGuests: number;
  sizeM2: number;
  airbnbRating: number;
  airbnbReviewCount: number;
  isSuperhost: boolean;
  isGuestFavorite: boolean;
  featuredBadge?: string;
  heroImage: string;
  galleryImages: string[];
  highlights: string[];
  amenities: string[];
  description: string;
  houseRules: string[];
  minNights: number;
  airbnbUrl?: string;
}

export interface FilterState {
  searchQuery: string;
  city: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  guests: number;
  bedrooms: number;
  amenities: string[];
  sortBy: 'recommended' | 'price-asc' | 'price-desc' | 'rating';
}
