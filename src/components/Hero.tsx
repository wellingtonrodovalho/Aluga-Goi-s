import React from 'react';
import { Star, ShieldCheck, Clock, Award, ChevronDown, Search, MessageSquare, Sparkles, ExternalLink } from 'lucide-react';
import { SUPERHOST_STATS } from '../data/testimonials';
import { buildWhatsAppLink, AIRBNB_PROFILE_URL, OFFICIAL_CRECI } from '../utils/whatsapp';

interface HeroProps {
  onSearchSubmit: (city: string, type: string, guests: number) => void;
  selectedCity: string;
  selectedType: string;
  selectedGuests: number;
  totalProperties: number;
}

export const Hero: React.FC<HeroProps> = ({
  onSearchSubmit,
  selectedCity,
  selectedType,
  selectedGuests,
  totalProperties,
}) => {
  const [localCity, setLocalCity] = React.useState(selectedCity);
  const [localType, setLocalType] = React.useState(selectedType);
  const [localGuests, setLocalGuests] = React.useState(selectedGuests || 1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(localCity, localType, localGuests);
    const target = document.getElementById('imoveis');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const directWa = buildWhatsAppLink({
    customMessage: 'Gostaria de consultar as opções de imóveis disponíveis para as minhas datas.',
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Main Value Proposition (7 cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Superhost Credential Kicker (Unboxed text with typographic separators) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300 tracking-wide uppercase">
              <a
                href={AIRBNB_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline"
                title="Ver perfil oficial de Wellington Rodovalho no Airbnb"
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Superhost Airbnb ({SUPERHOST_STATS.superhostYears} anos)</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {SUPERHOST_STATS.overallRating} ({SUPERHOST_STATS.totalReviews} avaliações)
              </span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">{OFFICIAL_CRECI}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-[1.12] font-display max-w-2xl text-balance">
              Hospedagens de alto padrão nos endereços mais nobres de Goiás
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed max-w-xl">
              Flats no <strong>Crystal Place (17º andar c/ manobrista e vista skyline)</strong>, apartamento de <strong>2 Suítes no Bueno (próximo a hospitais)</strong>, <strong>Casa da Vó c/ jardim no Coimbra</strong> e <strong>Studios no Bueno</strong>. Gestão profissional por <strong>Wellington Rodovalho</strong> com reserva direta e suporte VIP via WhatsApp.
            </p>

            {/* Fast Quick Filter / Search Card */}
            <form
              onSubmit={handleSearch}
              className="bg-white dark:bg-stone-900 rounded-2xl p-3 sm:p-4 border border-stone-200 dark:border-stone-800 shadow-xl shadow-stone-200/50 dark:shadow-none space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
            >
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Destino / Cidade
                </label>
                <div className="relative">
                  <select
                    value={localCity}
                    onChange={(e) => setLocalCity(e.target.value)}
                    className="w-full text-sm font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 rounded-lg px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Todas as cidades (Goiás)</option>
                    <option value="Goiânia">Goiânia (Marista, Bueno, Flamboyant)</option>
                    <option value="Caldas Novas">Caldas Novas (Resort Termal)</option>
                    <option value="Pirenópolis">Pirenópolis (Centro Histórico)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Tipo de Imóvel
                </label>
                <div className="relative">
                  <select
                    value={localType}
                    onChange={(e) => setLocalType(e.target.value)}
                    className="w-full text-sm font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 rounded-lg px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Todos os tipos</option>
                    <option value="Flat / Studio">Flat / Studio</option>
                    <option value="Apartamento">Apartamento Luxo</option>
                    <option value="Cobertura">Cobertura Penthouse</option>
                    <option value="Casa de Temporada">Casa de Temporada</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="w-full sm:w-28">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  Hóspedes
                </label>
                <select
                  value={localGuests}
                  onChange={(e) => setLocalGuests(Number(e.target.value))}
                  className="w-full text-sm font-semibold text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-800 rounded-lg px-3 py-2 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800 transition-all appearance-none cursor-pointer"
                >
                  <option value={1}>1 pessoa</option>
                  <option value={2}>2 pessoas</option>
                  <option value={3}>3 pessoas</option>
                  <option value={4}>4 pessoas</option>
                  <option value={5}>5+ pessoas</option>
                </select>
              </div>

              <div className="sm:self-end pt-1 sm:pt-0">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Ver {totalProperties} Imóveis</span>
                </button>
              </div>
            </form>

            {/* Trust markers unboxed */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Reserva 100% Segura & Direta
              </span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                Self Check-in Fechadura 24h
              </span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span>Cancelamento Flexível</span>
            </div>
          </div>

          {/* Focal Visual Anchor & Superhost Highlights (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl dark:shadow-none p-5 space-y-5 transition-colors">
              {/* Highlight Card Banner */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"
                  alt="Flat de Alto Padrão Goiânia"
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <div className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase">
                    Portfólio Oficial Aluga Goiás
                  </div>
                  <h3 className="text-lg font-bold leading-snug">
                    Crystal Place, 2 Suítes no Bueno & Casa da Vó
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
                    <span>Setor Pedro Ludovico</span>
                    <span>·</span>
                    <span>Setor Bueno</span>
                    <span>·</span>
                    <span>Setor Coimbra</span>
                  </div>
                </div>
              </div>

              {/* Host Credential Grid */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700">
                  <div className="text-xs text-stone-500 dark:text-stone-400">Nota Média Airbnb</div>
                  <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5 flex items-baseline gap-1">
                    <span className="tabular-nums">4.92</span>
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">★ / 5.0</span>
                  </div>
                  <div className="text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">91 avaliações verificadas</div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-100 dark:border-stone-700">
                  <div className="text-xs text-stone-500 dark:text-stone-400">Tempo de Superhost</div>
                  <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100 mt-0.5 tabular-nums">
                    6 Anos
                  </div>
                  <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">CRECI-GO 42695</div>
                </div>
              </div>

              {/* Instant WhatsApp Direct Consultation */}
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Atendimento Imediato com Wellington</div>
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-400 truncate">
                    Consulte datas ou peça cotação personalizada
                  </div>
                </div>
                <a
                  href={directWa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  <span>Conversar</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
