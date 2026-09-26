import React, { useState } from 'react';
import { Property } from '../types/property';
import {
  X,
  Star,
  MapPin,
  CheckCircle2,
  Calendar,
  Users,
  ShieldCheck,
  MessageSquare,
  Award,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { saveLead } from '../utils/crmStorage';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onLeadCaptured: (msg: string) => void;
  onEditProperty?: (property: Property) => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onLeadCaptured,
  onEditProperty,
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form fields for direct inquiry
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Calculate nights & price
  let nights = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = end.getTime() - start.getTime();
    nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  const subtotal = nights > 0 ? nights * property.pricePerNight : property.pricePerNight;
  const total = subtotal + property.cleaningFee;

  const waLink = buildWhatsAppLink({
    property,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests,
    customMessage: message || undefined,
  });

  const handleQuickLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      saveLead({
        name,
        phone,
        email: email || '',
        propertyId: property.id,
        propertyTitle: property.title,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
        message,
        source: 'Modal Imóvel',
        estimatedValue: total,
      });

      setSubmittedSuccess(true);
      onLeadCaptured(`Proposta enviada com sucesso para ${property.title}!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = property.galleryImages.length > 0 ? property.galleryImages : [property.heroImage];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800 my-8 max-h-[92vh] flex flex-col transition-colors">
        {/* Sticky Header with Title and Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="font-semibold text-stone-800 dark:text-stone-200">{property.neighborhood}</span>
              <span>·</span>
              <span>{property.city}</span>
              <span>·</span>
              <span className="text-amber-800 dark:text-amber-400 font-medium">Superhost Oficial</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 truncate">
              {property.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {onEditProperty && (
              <button
                type="button"
                onClick={() => onEditProperty(property)}
                className="px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Editar endereço, fotos e dados deste imóvel"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                <span>Editar Imóvel</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors shrink-0 cursor-pointer"
              aria-label="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Photo Gallery Viewer */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 dark:border-stone-800">
              <img
                src={images[activeImageIndex] || property.heroImage}
                alt={`${property.title} foto ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-600 ring-2 ring-amber-300'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Miniatura"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Two-Column Section: Property Details vs Booking / Lead Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Details, Highlights & Amenities (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Rating & Superhost Proof */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100 text-sm">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{property.airbnbRating} no Airbnb</span>
                    <span className="text-stone-400 font-normal">·</span>
                    <span className="text-stone-600 dark:text-stone-300 font-normal text-xs">
                      {property.airbnbReviewCount} avaliações reais
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                    Hospedagem premiada com padrão de hotelaria boutique e suporte instantâneo.
                  </p>
                </div>
              </div>

              {/* Exact Real Address Card */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                    Localização & Endereço
                  </span>
                  <div className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                    {property.address}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {property.neighborhood}, {property.city} · Ponto exato fixado no mapa
                  </div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Quartos</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">{property.bedrooms}</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Banheiros</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">{property.bathrooms}</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Hóspedes</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">Até {property.maxGuests}</div>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">Área Útil</div>
                  <div className="text-base font-bold text-stone-900 dark:text-stone-100">{property.sizeM2}m²</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Sobre a acomodação
                </h3>
                <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Destaques exclusivos
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {property.highlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700 dark:text-stone-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                  Comodidades inclusas
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-300">
                  {property.amenities.map((am, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      <span>{am}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-2 p-4 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300">
                <div className="font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px] mb-1">
                  Regras e orientações de estadia
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {property.houseRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Pricing & Conversion Calculator (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-5 space-y-5 shadow-sm">
                {/* Price Header */}
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-stone-900 dark:text-stone-100 tabular-nums">
                      R$ {property.pricePerNight}
                    </span>
                    <span className="text-xs text-stone-500 dark:text-stone-400"> / noite</span>
                  </div>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> Tarifa Direta sem Taxas
                  </span>
                </div>

                {/* Date & Guest Selectors */}
                <div className="space-y-3 bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                      Hóspedes
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full text-xs font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                    >
                      {Array.from({ length: property.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'hóspede' : 'hóspedes'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Stay Price Breakdown */}
                <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 border-t border-stone-200 dark:border-stone-700 pt-3">
                  <div className="flex justify-between">
                    <span>
                      R$ {property.pricePerNight} x {nights > 0 ? nights : 1}{' '}
                      {nights > 1 ? 'noites' : 'noite'}
                    </span>
                    <span className="tabular-nums font-semibold text-stone-900 dark:text-stone-100">
                      R$ {subtotal}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa única de higienização</span>
                    <span className="tabular-nums font-semibold text-stone-900 dark:text-stone-100">
                      R$ {property.cleaningFee}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-stone-200 dark:border-stone-700 font-bold text-sm text-stone-900 dark:text-stone-100">
                    <span>Total Estimado</span>
                    <span className="text-base text-amber-700 dark:text-amber-400 tabular-nums">
                      R$ {total}
                    </span>
                  </div>
                </div>

                {/* Primary WhatsApp Action (Phone: 62991514568) */}
                <div className="space-y-2 pt-1">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      saveLead({
                        name: 'Interessado WhatsApp',
                        phone: '(62) 99151-4568',
                        email: '',
                        propertyId: property.id,
                        propertyTitle: property.title,
                        checkIn: checkIn || undefined,
                        checkOut: checkOut || undefined,
                        guests,
                        source: 'WhatsApp Direto',
                        estimatedValue: total,
                      });
                    }}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Reservar pelo WhatsApp (62 99151-4568)</span>
                  </a>

                  <p className="text-[11px] text-stone-400 dark:text-stone-500 text-center">
                    Resposta em menos de 15 minutos com Wellington.
                  </p>
                </div>

                {/* Fast In-Modal Lead Contact Form */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-700">
                  <div className="text-[11px] font-bold uppercase text-stone-700 dark:text-stone-300 mb-2">
                    Ou solicite contato por e-mail / telefone:
                  </div>

                  {submittedSuccess ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Proposta Registrada!
                      </div>
                      <p>
                        Wellington entrará em contato em breve no seu WhatsApp/Telefone para confirmar as datas.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuickLeadSubmit} className="space-y-2">
                      <input
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp / Telefone com DDD"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <input
                        type="email"
                        placeholder="Seu e-mail (opcional)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {isSubmitting ? 'Registrando...' : 'Enviar Dados para Wellington'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
