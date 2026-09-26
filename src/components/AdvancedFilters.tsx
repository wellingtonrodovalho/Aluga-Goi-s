import React, { useState } from 'react';
import { FilterState } from '../types/property';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Check, RefreshCw } from 'lucide-react';

interface AdvancedFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalFiltered: number;
  totalAvailable: number;
}

const ALL_AMENITIES = [
  'Wi-Fi 500Mbps',
  'Ar-Condicionado Inverter',
  'Piscina Aquecida',
  'Vaga de Garagem Coberta',
  'Self Check-in Fechadura Digital',
  'Varanda Gourmet',
  'Jacuzzi Privativa',
  'Pet Friendly',
  'Cozinha Completa',
  'Smart TV 55" 4K',
  'Academia Equipada',
];

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onChange,
  totalFiltered,
  totalAvailable,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCityChange = (city: string) => {
    onChange({ ...filters, city });
  };

  const handleTypeChange = (propertyType: string) => {
    onChange({ ...filters, propertyType });
  };

  const handleAmenityToggle = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    const updated = exists
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities: updated });
  };

  const handleReset = () => {
    onChange({
      searchQuery: '',
      city: '',
      propertyType: '',
      minPrice: 200,
      maxPrice: 1000,
      guests: 0,
      bedrooms: 0,
      amenities: [],
      sortBy: 'recommended',
    });
  };

  const activeFiltersCount =
    (filters.city ? 1 : 0) +
    (filters.propertyType ? 1 : 0) +
    (filters.searchQuery ? 1 : 0) +
    (filters.guests > 0 ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.maxPrice < 1000 || filters.minPrice > 200 ? 1 : 0) +
    filters.amenities.length;

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
      {/* Top Filter Bar: Quick City Buttons & Search & Filter Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Destination Tabs (Interactive functional button segmented control) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => {
              onChange({ ...filters, city: '', searchQuery: '' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filters.city === '' && filters.searchQuery === ''
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Todos os Imóveis ({totalAvailable})
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({ ...filters, searchQuery: 'Bueno' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filters.searchQuery === 'Bueno'
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Setor Bueno (Hospitais & Studios)
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({ ...filters, searchQuery: 'Crystal Place' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filters.searchQuery === 'Crystal Place'
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Crystal Place (Pedro Ludovico / Marista)
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({ ...filters, searchQuery: 'Coimbra' });
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filters.searchQuery === 'Coimbra'
                ? 'bg-stone-900 dark:bg-amber-600 text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Setor Coimbra (Casa da Vó)
          </button>
        </div>

        {/* Right Controls: Sort & Advanced Filter Toggle */}
        <div className="flex items-center gap-2">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="recommended">Mais recomendados</option>
              <option value="price-asc">Menor preço diária</option>
              <option value="price-desc">Maior preço diária</option>
              <option value="rating">Melhor avaliação</option>
            </select>
          </div>

          {/* Toggle Advanced Draw */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap ${
              isOpen || activeFiltersCount > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300'
                : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros Avançados</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Filters Button if any active */}
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
              title="Limpar todos os filtros"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Drawer for Advanced Filters */}
      {isOpen && (
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Palavra-chave ou Bairro
              </label>
              <input
                type="text"
                placeholder="Ex: Marista, piscina, jacuzzi, spa..."
                value={filters.searchQuery}
                onChange={(e) => onChange({ ...filters, searchQuery: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Categoria do Imóvel
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">Todas as categorias</option>
                <option value="Flat / Studio">Flat / Studio</option>
                <option value="Apartamento">Apartamento Luxo</option>
                <option value="Cobertura">Cobertura Penthouse</option>
                <option value="Casa de Temporada">Casa de Temporada</option>
              </select>
            </div>

            {/* Min Bedrooms */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                Número de Quartos
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => onChange({ ...filters, bedrooms: Number(e.target.value) })}
                className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value={0}>Qualquer quantidade</option>
                <option value={1}>1+ quarto</option>
                <option value={2}>2+ quartos</option>
                <option value={3}>3+ quartos</option>
              </select>
            </div>

            {/* Max Budget Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Preço Máximo Diária
                </label>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  até R$ {filters.maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1000"
                step="50"
                value={filters.maxPrice}
                onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                <span>R$ 200</span>
                <span>R$ 600</span>
                <span>R$ 1.000+</span>
              </div>
            </div>
          </div>

          {/* Amenities Multi-selection */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Comodidades Exclusivas
            </div>
            <div className="flex flex-wrap gap-2">
              {ALL_AMENITIES.map((amenity) => {
                const selected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all flex items-center gap-1.5 ${
                      selected
                        ? 'bg-stone-900 dark:bg-amber-600 text-white border-stone-900 dark:border-amber-600 shadow-sm'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-amber-400" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Filter Summary */}
          <div className="flex items-center justify-between pt-2 text-xs text-stone-500 dark:text-stone-400">
            <span>
              Exibindo <strong className="text-stone-900 dark:text-stone-100">{totalFiltered}</strong> de {totalAvailable} unidades cadastradas
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-semibold underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
