import { Property } from '../types/property';
import { PROPERTIES } from '../data/properties';

const PROPERTIES_STORAGE_KEY = 'aluga_goias_properties_official_v9';

export const PHOTO_PRESETS = [
  {
    name: 'Crystal Place: 17º Andar & Vista Skyline',
    url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: '2 Suítes Bueno: Sala & Living Amplo',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Casa da Vó: Jardim & Varanda Acolhedora',
    url: 'https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Studio B Bueno: Cozinha Granito & Ar Split',
    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Studio A Bueno: Cama Hotelaria & Home Office',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Crystal Place: Piscina Aquecida & Lazer',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: '2 Suítes Bueno: Quarto Suíte Climatizado',
    url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Casa da Vó: Fachada & Flores',
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CITY_COORDINATE_PRESETS: Record<string, { lat: number; lng: number }> = {
  'Crystal Place (Setor Pedro Ludovico)': { lat: -16.7112, lng: -49.2554 },
  'Setor Bueno (Goiânia)': { lat: -16.6975, lng: -49.2682 },
  'Setor Coimbra (Goiânia)': { lat: -16.6805, lng: -49.2842 },
  'Setor Marista (Goiânia)': { lat: -16.7025, lng: -49.2638 },
  'Jardim Goiás / Flamboyant (Goiânia)': { lat: -16.7118, lng: -49.2386 },
  'Caldas Novas': { lat: -17.7444, lng: -48.6256 },
  'Pirenópolis': { lat: -15.8525, lng: -48.9589 },
};

export function loadStoredProperties(): Property[] {
  if (typeof window === 'undefined') return PROPERTIES;
  try {
    const raw = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (!raw) {
      // First time initialization
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(PROPERTIES));
      return PROPERTIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Validate that it contains the official 5 Airbnb properties
      const hasCrystal = parsed.some((p) => p.id === 'crystal-place-flat-moderno');
      const hasBueno = parsed.some((p) => p.id === '2-suites-bueno-hospitais');
      if (hasCrystal && hasBueno) {
        return parsed;
      }
    }
    // Auto-migrate if old mock properties exist
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(PROPERTIES));
    return PROPERTIES;
  } catch (err) {
    console.error('Error loading stored properties:', err);
    return PROPERTIES;
  }
}

export function saveStoredProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
  } catch (err) {
    console.error('Error saving properties:', err);
  }
}

export function saveSingleProperty(property: Property): Property[] {
  const current = loadStoredProperties();
  const index = current.findIndex((p) => p.id === property.id);
  let updated: Property[];

  if (index >= 0) {
    // Update existing
    updated = [...current];
    updated[index] = { ...property };
  } else {
    // Add new
    updated = [property, ...current];
  }

  saveStoredProperties(updated);
  return updated;
}

export function deleteStoredProperty(id: string): Property[] {
  const current = loadStoredProperties();
  const updated = current.filter((p) => p.id !== id);
  saveStoredProperties(updated);
  return updated;
}

export function resetStoredProperties(): Property[] {
  saveStoredProperties(PROPERTIES);
  return PROPERTIES;
}

export function clearAllStoredProperties(): Property[] {
  saveStoredProperties([]);
  return [];
}
