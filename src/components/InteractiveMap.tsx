import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Property } from '../types/property';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { MapPin, Navigation, Star, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InteractiveMapProps {
  properties: Property[];
  selectedPropertyId?: string | null;
  onSelectProperty: (property: Property) => void;
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const { theme } = useTheme();

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center roughly between Goiânia, Caldas Novas and Pirenópolis
    const initialCenter: [number, number] = [-16.7025, -49.2638];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      scrollWheelZoom: false,
    });

    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Delay invalidateSize to ensure container layout has settled
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update tile layer on theme change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [theme]);

  // Update Markers when properties change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    if (properties.length === 0) return;

    const bounds = L.latLngBounds([]);

    properties.forEach(prop => {
      const isSelected = prop.id === selectedPropertyId;
      const latLng: [number, number] = [prop.coordinates.lat, prop.coordinates.lng];
      bounds.extend(latLng);

      const isDark = theme === 'dark';
      const customHtml = `
        <div class="group relative cursor-pointer transition-transform duration-200 hover:scale-110">
          <div class="px-2.5 py-1 rounded-full text-xs font-bold tracking-tight shadow-md flex items-center gap-1 border ${
            isSelected
              ? 'bg-amber-600 text-white border-amber-700 ring-2 ring-amber-300'
              : isDark
              ? 'bg-stone-800 text-stone-100 border-stone-700 hover:bg-amber-600'
              : 'bg-stone-900 text-white border-stone-800 hover:bg-amber-600'
          }">
            <span class="tabular-nums font-semibold">R$ ${prop.pricePerNight}</span>
          </div>
          <div class="w-1.5 h-1.5 ${isDark ? 'bg-stone-800' : 'bg-stone-900'} mx-auto rotate-45 -mt-0.5 ${
            isSelected ? '!bg-amber-600' : ''
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-leaflet-price-pin',
        iconSize: [80, 32],
        iconAnchor: [40, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker(latLng, { icon: customIcon }).addTo(map);

      const waLink = buildWhatsAppLink({ property: prop });
      const popupBg = isDark ? '#1c1917' : '#ffffff';
      const popupTextColor = isDark ? '#f5f5f4' : '#1c1917';
      const popupSubColor = isDark ? '#a8a29e' : '#78716c';
      const imgFallbackBg = isDark ? '#292524' : '#f5f5f4';

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', system-ui, sans-serif; min-width: 240px; max-width: 270px; padding: 4px; background: ${popupBg}; color: ${popupTextColor}; border-radius: 8px;">
          <div style="position: relative; border-radius: 8px; overflow: hidden; height: 130px; margin-bottom: 8px; background-color: ${imgFallbackBg};">
            <img src="${prop.heroImage}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; display: flex; align-items: center; gap: 3px;">
              ★ ${prop.airbnbRating} (${prop.airbnbReviewCount})
            </div>
          </div>
          <div style="font-size: 11px; color: ${popupSubColor}; margin-bottom: 2px;">
            ${prop.neighborhood} · ${prop.city}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: ${popupTextColor}; margin: 0 0 6px 0; line-height: 1.3;">
            ${prop.title}
          </h4>
          <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 10px;">
            <span style="font-size: 15px; font-weight: 800; color: ${popupTextColor};">R$ ${prop.pricePerNight}</span>
            <span style="font-size: 11px; color: ${popupSubColor};">/ noite</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <button id="view-details-${prop.id}" style="flex: 1; background: ${isDark ? '#d97706' : '#1c1917'}; color: white; border: none; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 600; cursor: pointer;">
              Ver Detalhes
            </button>
            <a href="${waLink}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #25D366; color: white; text-decoration: none; border-radius: 6px; padding: 6px 8px; font-size: 11px; font-weight: 600; text-align: center; display: inline-flex; align-items: center; justify-content: center;">
              WhatsApp
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 280, className: 'property-leaflet-popup' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-details-${prop.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectProperty(prop);
          };
        }
      });

      marker.on('click', () => {
        onSelectProperty(prop);
      });

      markersRef.current[prop.id] = marker;
    });

    if (properties.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [properties, selectedPropertyId, onSelectProperty, theme]);

  // Center on selected property if present
  useEffect(() => {
    if (!selectedPropertyId || !mapInstanceRef.current) return;
    const prop = properties.find(p => p.id === selectedPropertyId);
    if (prop) {
      mapInstanceRef.current.setView([prop.coordinates.lat, prop.coordinates.lng], 15, {
        animate: true,
      });
      const marker = markersRef.current[prop.id];
      if (marker) {
        marker.openPopup();
      }
    }
  }, [selectedPropertyId, properties]);

  const quickCenter = (city: 'Goiânia' | 'Caldas Novas' | 'Pirenópolis') => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (city === 'Goiânia') {
      map.setView([-16.7025, -49.2638], 13);
    } else if (city === 'Caldas Novas') {
      map.setView([-17.7441, -48.6258], 14);
    } else if (city === 'Pirenópolis') {
      map.setView([-15.8525, -48.958], 15);
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 transition-colors ${className}`}>
      {/* Quick Region Selector Bar on Top of Map */}
      <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 p-1 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md rounded-xl border border-stone-200/80 dark:border-stone-700/80 shadow-md">
        <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 px-2 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-stone-400" /> Região:
        </span>
        <button
          type="button"
          onClick={() => quickCenter('Goiânia')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Goiânia
        </button>
        <button
          type="button"
          onClick={() => quickCenter('Caldas Novas')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Caldas Novas
        </button>
        <button
          type="button"
          onClick={() => quickCenter('Pirenópolis')}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Pirenópolis
        </button>
      </div>

      {/* Map Counter Badge */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 dark:bg-stone-900/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
        <span>{properties.length} unidades localizadas no mapa</span>
      </div>

      {/* Leaflet Map Div */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
};
