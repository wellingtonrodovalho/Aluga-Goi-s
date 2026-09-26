import React, { useState } from 'react';
import { Property } from '../types/property';
import { Star, MessageSquare, Bed, Users, Maximize2, ShieldCheck, MapPin, Edit3, Camera } from 'lucide-react';
import { buildWhatsAppLink } from '../utils/whatsapp';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  onTrackLead?: (property: Property, source: 'WhatsApp Direto') => void;
  onEditProperty?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onTrackLead,
  onEditProperty,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const waLink = buildWhatsAppLink({ property });

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    // Don't prevent default, let it open WhatsApp in new tab, but track in CRM
    if (onTrackLead) {
      onTrackLead(property, 'WhatsApp Direto');
    }
  };

  return (
    <article className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Image Container with Fallback */}
      <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800 overflow-hidden">
        {!imageError ? (
          <img
            src={property.heroImage}
            alt={property.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 dark:bg-stone-800 p-4 text-center">
            <MapPin className="w-8 h-8 text-stone-400 mb-2" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">{property.neighborhood}</span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">{property.city}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {property.featuredBadge ? (
            <div className="bg-stone-900/90 dark:bg-stone-950/90 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide shadow-sm border border-stone-800">
              {property.featuredBadge}
            </div>
          ) : (
            <div className="bg-stone-900/80 dark:bg-stone-950/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-[11px] font-medium border border-stone-800">
              {property.propertyType}
            </div>
          )}

          {/* Airbnb Rating Indicator */}
          <div className="bg-white/95 dark:bg-stone-800/95 backdrop-blur-md text-stone-900 dark:text-stone-100 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1 border border-stone-200/50 dark:border-stone-700">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums">{property.airbnbRating}</span>
            <span className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">({property.airbnbReviewCount})</span>
          </div>
        </div>

        {/* Quick View Overlay on Hover */}
        <button
          type="button"
          onClick={() => onSelect(property)}
          className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label={`Ver fotos e detalhes de ${property.title}`}
        >
          <span className="bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-stone-100 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform border border-stone-200 dark:border-stone-700">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Ver Fotos & Detalhes</span>
          </span>
        </button>

        {/* Quick Change Photo Button */}
        {onEditProperty && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEditProperty(property);
            }}
            className="absolute bottom-2.5 right-2.5 bg-stone-900/90 hover:bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 backdrop-blur-md transition-colors cursor-pointer border border-stone-700/80 z-10 opacity-90 group-hover:opacity-100"
            title="Alterar ou enviar foto deste imóvel"
          >
            <Camera className="w-3 h-3 text-amber-400" />
            <span>Trocar Foto</span>
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Unboxed Metadata Line (Zero-Pill Compliance) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span className="text-stone-700 dark:text-stone-300 font-semibold">{property.neighborhood}</span>
            <span aria-hidden="true">·</span>
            <span>{property.city}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-800 dark:text-amber-400 font-medium">Superhost</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property)}
            className="text-base font-bold text-stone-900 dark:text-stone-100 leading-snug line-clamp-2 cursor-pointer hover:text-amber-800 dark:hover:text-amber-400 transition-colors"
          >
            {property.title}
          </h3>

          {/* Capacity and Specs (Unboxed with separators) */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-600 dark:text-stone-300">
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
            <span aria-hidden="true">·</span>
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
            <span aria-hidden="true">·</span>
            <span>Até {property.maxGuests} hóspedes</span>
            <span aria-hidden="true">·</span>
            <span>{property.sizeM2}m²</span>
          </div>

          {/* Key Feature Highlight */}
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 italic">
            "{property.highlights[0]}"
          </p>
        </div>

        {/* Pricing & Conversion CTA Block */}
        <div className="pt-4 mt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-stone-900 dark:text-stone-100 tabular-nums">
                R$ {property.pricePerNight}
              </span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-normal">/ noite</span>
            </div>
            <div className="text-[10px] text-stone-400 dark:text-stone-500">
              Taxa de limpeza: R$ {property.cleaningFee}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {onEditProperty && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProperty(property);
                }}
                className="p-2 text-stone-500 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                title="Editar este imóvel (endereço real, fotos, valores)"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onSelect(property)}
              className="px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Detalhes
            </button>

            {/* Direct WhatsApp CTA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              title="Conversar no WhatsApp sobre este imóvel"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
