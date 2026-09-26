import React, { useState, useMemo } from 'react';
import { Property, FilterState } from './types/property';
import { Lead } from './types/crm';
import { getStoredLeads, saveLead } from './utils/crmStorage';
import {
  loadStoredProperties,
  saveSingleProperty,
  deleteStoredProperty,
  clearAllStoredProperties,
  resetStoredProperties,
} from './utils/propertyStorage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AdvancedFilters } from './components/AdvancedFilters';
import { PropertyCard } from './components/PropertyCard';
import { PropertyModal } from './components/PropertyModal';
import { InteractiveMap } from './components/InteractiveMap';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdvantagesSection } from './components/AdvantagesSection';
import { ContactFormSection } from './components/ContactFormSection';
import { CrmDrawer } from './components/CrmDrawer';
import { ManagePropertiesModal } from './components/ManagePropertiesModal';
import { PropertyEditorModal } from './components/PropertyEditorModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import {
  LayoutGrid,
  Map as MapIcon,
  Columns2,
  CheckCircle2,
  MapPin,
  Sparkles,
  Building2,
  Plus,
  RotateCcw,
} from 'lucide-react';

export default function App() {
  // Global Leads State (synced with CRM localStorage)
  const [leads, setLeads] = useState<Lead[]>(getStoredLeads());
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Properties State (persisted in localStorage)
  const [properties, setProperties] = useState<Property[]>(loadStoredProperties);
  const [isManagePropertiesOpen, setIsManagePropertiesOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [isPropertyEditorOpen, setIsPropertyEditorOpen] = useState(false);

  // Selected Property for Modal
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Active Map Selected Property
  const [mapSelectedPropertyId, setMapSelectedPropertyId] = useState<string | null>(null);

  // View Layout Mode: 'grid' | 'split' | 'map'
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'map'>('grid');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: '',
    propertyType: '',
    minPrice: 100,
    maxPrice: 2000,
    guests: 0,
    bedrooms: 0,
    amenities: [],
    sortBy: 'recommended',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Property Management Actions
  const handleSaveProperty = (prop: Property) => {
    const updated = saveSingleProperty(prop);
    setProperties(updated);
    // If this property was currently selected, update it
    if (selectedProperty?.id === prop.id) {
      setSelectedProperty(prop);
    }
    showToast(`Imóvel "${prop.title}" salvo com sucesso na Aluga Goiás!`);
  };

  const handleDeleteProperty = (id: string) => {
    const updated = deleteStoredProperty(id);
    setProperties(updated);
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
    showToast('Imóvel removido com sucesso.');
  };

  const handleClearAllProperties = () => {
    const updated = clearAllStoredProperties();
    setProperties(updated);
    setSelectedProperty(null);
    showToast('Imóveis fictícios apagados. Você pode cadastrar seus imóveis reais do zero.');
  };

  const handleResetProperties = () => {
    const updated = resetStoredProperties();
    setProperties(updated);
    showToast('Imóveis restaurados.');
  };

  const handleEditProperty = (prop: Property) => {
    setPropertyToEdit(prop);
    setIsPropertyEditorOpen(true);
  };

  const handleAddNewProperty = () => {
    setPropertyToEdit(null);
    setIsPropertyEditorOpen(true);
  };

  // Filtered and Sorted Properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // City
        if (filters.city && prop.city !== filters.city) {
          return false;
        }
        // Type
        if (filters.propertyType && prop.propertyType !== filters.propertyType) {
          return false;
        }
        // Price
        if (prop.pricePerNight > filters.maxPrice) {
          return false;
        }
        // Guests
        if (filters.guests > 0 && prop.maxGuests < filters.guests) {
          return false;
        }
        // Bedrooms
        if (filters.bedrooms > 0 && prop.bedrooms < filters.bedrooms) {
          return false;
        }
        // Amenities
        if (filters.amenities.length > 0) {
          const hasAllAmenities = filters.amenities.every((amenity) =>
            prop.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
          );
          if (!hasAllAmenities) return false;
        }
        // Search query (keyword)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchesTitle = prop.title.toLowerCase().includes(query);
          const matchesNeighborhood = prop.neighborhood.toLowerCase().includes(query);
          const matchesCity = prop.city.toLowerCase().includes(query);
          const matchesAddress = prop.address.toLowerCase().includes(query);
          const matchesDescription = prop.description.toLowerCase().includes(query);
          const matchesHighlights = prop.highlights.some((h) => h.toLowerCase().includes(query));
          const matchesAmenities = prop.amenities.some((a) => a.toLowerCase().includes(query));

          if (
            !matchesTitle &&
            !matchesNeighborhood &&
            !matchesCity &&
            !matchesAddress &&
            !matchesDescription &&
            !matchesHighlights &&
            !matchesAmenities
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') {
          return a.pricePerNight - b.pricePerNight;
        }
        if (filters.sortBy === 'price-desc') {
          return b.pricePerNight - a.pricePerNight;
        }
        if (filters.sortBy === 'rating') {
          return b.airbnbRating - a.airbnbRating;
        }
        // Recommended: featured + review count
        return b.airbnbReviewCount - a.airbnbReviewCount;
      });
  }, [properties, filters]);

  // Handle Quick Search submission from Hero
  const handleHeroSearch = (city: string, type: string, guests: number) => {
    setFilters((prev) => ({
      ...prev,
      city,
      propertyType: type,
      guests,
    }));
  };

  // Track Lead from WhatsApp click on cards
  const handleTrackWhatsAppLead = (property: Property) => {
    const updated = saveLead({
      name: 'Interessado no WhatsApp',
      phone: '(62) 99151-4568',
      email: '',
      propertyId: property.id,
      propertyTitle: property.title,
      source: 'WhatsApp Direto',
      estimatedValue: property.pricePerNight * 2,
    });
    setLeads(getStoredLeads());
    showToast(`Lead do imóvel ${property.title} registrado no CRM!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 dark:bg-stone-800 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-800 dark:border-stone-700 flex items-center gap-2.5 text-xs font-semibold animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Compliant Navbar */}
      <Navbar
        onOpenCrm={() => setIsCrmOpen(true)}
        leadCount={leads.length}
        onOpenContact={() => {
          document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenManageProperties={() => setIsManagePropertiesOpen(true)}
      />

      <main className="flex-1">
        {/* High Conversion Hero Section */}
        <Hero
          onSearchSubmit={handleHeroSearch}
          selectedCity={filters.city}
          selectedType={filters.propertyType}
          selectedGuests={filters.guests}
          totalProperties={properties.length}
        />

        {/* Properties Catalog & Live Map Section */}
        <section id="imoveis" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Host Notice & Property Management Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0 mt-0.5">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <span>Painel do Anfitrião · Aluga Goiás</span>
                  <span className="text-[10px] bg-amber-200/80 dark:bg-amber-800/80 px-2 py-0.5 rounded-full font-bold">
                    {properties.length} {properties.length === 1 ? 'imóvel cadastrado' : 'imóveis cadastrados'}
                  </span>
                </div>
                <p className="text-xs text-amber-950/80 dark:text-amber-300/80 mt-1 max-w-2xl leading-relaxed">
                  Portfólio oficial do Airbnb configurado. Você pode trocar a foto de capa diretamente em cada card (botão "Trocar Foto"), fazer upload de imagens do seu computador/celular ou recarregar as fotos originais a qualquer momento.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  const fresh = resetStoredProperties();
                  setProperties(fresh);
                  showToast('Fotos e títulos oficiais do Airbnb recarregados com sucesso!');
                }}
                className="flex-1 sm:flex-none px-3.5 py-2.5 bg-white dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 border border-amber-300 dark:border-amber-700/80 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Recarregar as fotos e títulos originais dos 5 anúncios oficiais"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span>Recarregar Fotos Oficiais</span>
              </button>
              <button
                type="button"
                onClick={() => setIsManagePropertiesOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Building2 className="w-4 h-4" />
                <span>Gerenciar Imóveis</span>
              </button>
              <button
                type="button"
                onClick={handleAddNewProperty}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Imóvel</span>
              </button>
            </div>
          </div>

          {/* Section Kicker and View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-stone-200 dark:border-stone-800">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
                Catálogo Exclusivo · Aluga Goiás
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
                Imóveis Disponíveis para Temporada
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                Unidades decoradas, higienizadas e prontas para receber você com padrão Superhost.
              </p>
            </div>

            {/* View Mode Switcher (Grid, Split, Map) */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800/80 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Visualização em Grade de Cards"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grade</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Visualização Dividida: Cards e Mapa lado a lado"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Dividido</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
                title="Visualização com Foco no Mapa"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Mapa</span>
              </button>
            </div>
          </div>

          {/* Advanced Filters Bar */}
          <AdvancedFilters
            filters={filters}
            onChange={setFilters}
            totalFiltered={filteredProperties.length}
            totalAvailable={properties.length}
          />

          {/* Conditional View Renders */}
          {viewMode === 'grid' && (
            <div>
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
                  <MapPin className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                    Nenhum imóvel encontrado com esses critérios
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Tente relaxar o preço máximo ou remover filtros de comodidades para ver todas as opções disponíveis.
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({
                          searchQuery: '',
                          city: '',
                          propertyType: '',
                          minPrice: 100,
                          maxPrice: 2000,
                          guests: 0,
                          bedrooms: 0,
                          amenities: [],
                          sortBy: 'recommended',
                        })
                      }
                      className="px-4 py-2 text-xs font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Ver todos os imóveis
                    </button>
                    <button
                      type="button"
                      onClick={handleAddNewProperty}
                      className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar Meu Imóvel Real</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onSelect={(p) => setSelectedProperty(p)}
                      onTrackLead={handleTrackWhatsAppLead}
                      onEditProperty={handleEditProperty}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Properties Cards (7 cols) */}
              <div className="lg:col-span-7 space-y-6 max-h-[820px] overflow-y-auto pr-2 scrollbar-none">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredProperties.map((prop) => (
                    <PropertyCard
                      key={prop.id}
                      property={prop}
                      onSelect={(p) => {
                        setSelectedProperty(p);
                        setMapSelectedPropertyId(p.id);
                      }}
                      onTrackLead={handleTrackWhatsAppLead}
                      onEditProperty={handleEditProperty}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Sticky Interactive Map (5 cols) */}
              <div className="lg:col-span-5 sticky top-22">
                <InteractiveMap
                  properties={filteredProperties}
                  selectedPropertyId={mapSelectedPropertyId}
                  onSelectProperty={(p) => {
                    setMapSelectedPropertyId(p.id);
                    setSelectedProperty(p);
                  }}
                  className="h-[800px]"
                />
              </div>
            </div>
          )}

          {viewMode === 'map' && (
            <div className="space-y-4">
              <InteractiveMap
                properties={filteredProperties}
                selectedPropertyId={mapSelectedPropertyId}
                onSelectProperty={(p) => setSelectedProperty(p)}
                className="h-[650px] shadow-sm"
              />
              <p className="text-xs text-stone-500 dark:text-stone-400 text-center">
                Clique nos pins de preço no mapa para visualizar a foto, endereço, detalhes e link do WhatsApp do imóvel.
              </p>
            </div>
          )}
        </section>

        {/* Dedicated Interactive Map Section Anchor */}
        <section id="mapa" className="py-14 bg-stone-100/70 dark:bg-stone-900/50 border-t border-b border-stone-200 dark:border-stone-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
                  Localização Precisa de Cada Unidade
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display">
                  Explore o Mapa Interativo dos Imóveis
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
                  Descubra a proximidade exata de cada acomodação cadastrada na Aluga Goiás com pontos turísticos, polos gastronômicos e lazer.
                </p>
              </div>
            </div>

            <InteractiveMap
              properties={properties}
              selectedPropertyId={mapSelectedPropertyId}
              onSelectProperty={(p) => {
                setMapSelectedPropertyId(p.id);
                setSelectedProperty(p);
              }}
              className="h-[520px] shadow-md"
            />
          </div>
        </section>

        {/* Verified Airbnb Testimonials & Superhost Proof Section */}
        <TestimonialsSection />

        {/* Direct Booking Advantages Section */}
        <AdvantagesSection />

        {/* Simple Contact Form & CRM Lead Capture Section */}
        <ContactFormSection
          properties={properties}
          onLeadCaptured={(msg) => {
            setLeads(getStoredLeads());
            showToast(msg);
          }}
        />
      </main>

      {/* Quiet Footer */}
      <Footer />

      {/* Property Details & Booking Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onLeadCaptured={(msg) => {
          setLeads(getStoredLeads());
          showToast(msg);
        }}
        onEditProperty={handleEditProperty}
      />

      {/* Integrated CRM Management Panel */}
      <CrmDrawer
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        leads={leads}
        onLeadsChange={setLeads}
        onNotification={showToast}
      />

      {/* Full Property Manager Modal */}
      <ManagePropertiesModal
        isOpen={isManagePropertiesOpen}
        properties={properties}
        onClose={() => setIsManagePropertiesOpen(false)}
        onSaveProperty={handleSaveProperty}
        onDeleteProperty={handleDeleteProperty}
        onClearAll={handleClearAllProperties}
        onResetDefaults={handleResetProperties}
      />

      {/* Single Property Editor Modal */}
      <PropertyEditorModal
        isOpen={isPropertyEditorOpen}
        propertyToEdit={propertyToEdit}
        onClose={() => setIsPropertyEditorOpen(false)}
        onSave={handleSaveProperty}
        onDelete={handleDeleteProperty}
      />

      {/* Floating WhatsApp Action Button */}
      <FloatingWhatsApp />
    </div>
  );
}
