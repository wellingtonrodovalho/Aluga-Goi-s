import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Plus, Sparkles, MapPin, Image as ImageIcon, Check, Upload, Camera } from 'lucide-react';
import { Property, PropertyType } from '../types/property';
import {
  PHOTO_PRESETS,
  CITY_COORDINATE_PRESETS,
} from '../utils/propertyStorage';

interface PropertyEditorModalProps {
  isOpen: boolean;
  propertyToEdit: Property | null; // null = creating new
  onClose: () => void;
  onSave: (property: Property) => void;
  onDelete?: (id: string) => void;
}

const COMMON_AMENITIES = [
  'Wi-Fi 500Mbps',
  'Ar-Condicionado Inverter',
  'Piscina Aquecida',
  'Vaga de Garagem Coberta',
  'Self Check-in Fechadura Digital',
  'Smart TV 55" 4K',
  'Cozinha Completa',
  'Cafeteira Nespresso',
  'Academia Equipada',
  'Máquina Lava e Seca',
  'Secador de Cabelo Profissional',
  'Churrasqueira Privativa',
  'Jacuzzi / Hidromassagem',
  'Varanda Gourmet',
  'Permite Pets (sob consulta)',
  'Enxoval de Cama e Banho Completo',
];

export const PropertyEditorModal: React.FC<PropertyEditorModalProps> = ({
  isOpen,
  propertyToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(propertyToEdit);

  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Flat / Studio');
  const [city, setCity] = useState('Goiânia');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(-16.7025);
  const [lng, setLng] = useState(-49.2638);
  const [pricePerNight, setPricePerNight] = useState(290);
  const [cleaningFee, setCleaningFee] = useState(120);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [maxGuests, setMaxGuests] = useState(3);
  const [sizeM2, setSizeM2] = useState(45);
  const [heroImage, setHeroImage] = useState('');
  const [galleryImagesText, setGalleryImagesText] = useState('');
  const [description, setDescription] = useState('');
  const [highlightsText, setHighlightsText] = useState('');
  const [houseRulesText, setHouseRulesText] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Wi-Fi 500Mbps',
    'Ar-Condicionado Inverter',
    'Self Check-in Fechadura Digital',
    'Cozinha Completa',
  ]);
  const [airbnbRating, setAirbnbRating] = useState(4.95);
  const [airbnbReviewCount, setAirbnbReviewCount] = useState(25);
  const [isSuperhost, setIsSuperhost] = useState(true);
  const [airbnbUrl, setAirbnbUrl] = useState('');
  const [featuredBadge, setFeaturedBadge] = useState('');

  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setHeroImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setGalleryImagesText((prev) =>
            prev.trim() ? `${prev.trim()}\n${event.target?.result}` : (event.target?.result as string)
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Sync state when propertyToEdit changes
  useEffect(() => {
    if (propertyToEdit) {
      setTitle(propertyToEdit.title);
      setPropertyType(propertyToEdit.propertyType);
      setCity(propertyToEdit.city);
      setNeighborhood(propertyToEdit.neighborhood);
      setAddress(propertyToEdit.address);
      setLat(propertyToEdit.coordinates.lat);
      setLng(propertyToEdit.coordinates.lng);
      setPricePerNight(propertyToEdit.pricePerNight);
      setCleaningFee(propertyToEdit.cleaningFee);
      setBedrooms(propertyToEdit.bedrooms);
      setBathrooms(propertyToEdit.bathrooms);
      setBeds(propertyToEdit.beds);
      setMaxGuests(propertyToEdit.maxGuests);
      setSizeM2(propertyToEdit.sizeM2);
      setHeroImage(propertyToEdit.heroImage);
      setGalleryImagesText(propertyToEdit.galleryImages.join('\n'));
      setDescription(propertyToEdit.description);
      setHighlightsText(propertyToEdit.highlights.join('\n'));
      setHouseRulesText(propertyToEdit.houseRules.join('\n'));
      setSelectedAmenities(propertyToEdit.amenities);
      setAirbnbRating(propertyToEdit.airbnbRating);
      setAirbnbReviewCount(propertyToEdit.airbnbReviewCount);
      setIsSuperhost(propertyToEdit.isSuperhost);
      setAirbnbUrl(propertyToEdit.airbnbUrl || '');
      setFeaturedBadge(propertyToEdit.featuredBadge || '');
    } else {
      // Default template for a new property
      setTitle('Novo Flat / Apartamento Aluga Goiás');
      setPropertyType('Flat / Studio');
      setCity('Goiânia');
      setNeighborhood('Setor Marista');
      setAddress('Rua 147, Setor Marista, Goiânia - GO');
      setLat(-16.7025);
      setLng(-49.2638);
      setPricePerNight(280);
      setCleaningFee(120);
      setBedrooms(1);
      setBathrooms(1);
      setBeds(1);
      setMaxGuests(3);
      setSizeM2(45);
      setHeroImage(
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
      );
      setGalleryImagesText(
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
      );
      setDescription(
        'Apartamento aconchegante, mobiliado e equipado com alto padrão para estadias de temporada e viagens a negócios em Goiás.'
      );
      setHighlightsText(
        'Localização nobre e segura\nWi-Fi de alta velocidade e ar-condicionado\nSelf check-in prático com fechadura digital\nEnxoval completo de hotelaria'
      );
      setHouseRulesText(
        'Check-in a partir das 15:00 / Check-out até 11:00\nNão é permitido fumar no interior da unidade\nSilêncio respeitado após as 22h'
      );
      setSelectedAmenities([
        'Wi-Fi 500Mbps',
        'Ar-Condicionado Inverter',
        'Self Check-in Fechadura Digital',
        'Cozinha Completa',
        'Smart TV 55" 4K',
        'Vaga de Garagem Coberta',
      ]);
      setAirbnbRating(4.95);
      setAirbnbReviewCount(12);
      setIsSuperhost(true);
      setAirbnbUrl('https://www.airbnb.com.br');
      setFeaturedBadge('Disponível para Reserva Direta');
    }
  }, [propertyToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleApplyPresetCoords = (presetName: string) => {
    const found = CITY_COORDINATE_PRESETS[presetName];
    if (found) {
      setLat(found.lat);
      setLng(found.lng);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const galleryImages = galleryImagesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const highlights = highlightsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const houseRules = houseRulesText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const finalProperty: Property = {
      id: propertyToEdit?.id || `prop-${Date.now()}`,
      title: title.trim(),
      slug: slug || `imovel-${Date.now()}`,
      propertyType,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      address: address.trim(),
      coordinates: {
        lat: Number(lat),
        lng: Number(lng),
      },
      pricePerNight: Number(pricePerNight),
      cleaningFee: Number(cleaningFee),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      beds: Number(beds),
      maxGuests: Number(maxGuests),
      sizeM2: Number(sizeM2),
      airbnbRating: Number(airbnbRating),
      airbnbReviewCount: Number(airbnbReviewCount),
      isSuperhost,
      isGuestFavorite: true,
      featuredBadge: featuredBadge.trim() || undefined,
      heroImage: heroImage.trim(),
      galleryImages: galleryImages.length > 0 ? galleryImages : [heroImage.trim()],
      highlights:
        highlights.length > 0
          ? highlights
          : ['Excelente localização em Goiás', 'Pronto para morar ou temporada'],
      amenities: selectedAmenities,
      description: description.trim(),
      houseRules:
        houseRules.length > 0
          ? houseRules
          : ['Check-in 15h / Check-out 11h', 'Proibido fumar'],
      minNights: 1,
      airbnbUrl: airbnbUrl.trim() || undefined,
    };

    onSave(finalProperty);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-600 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {isEditing ? 'Editar Imóvel Real' : 'Cadastrar Novo Imóvel'} · Aluga Goiás
              </h2>
              <p className="text-xs text-stone-300">
                Insira o endereço correto, suas fotos reais e os valores da diária.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              1. Identificação & Localização Real
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Título do Imóvel / Anúncio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Flat Suíte Design Setor Marista, Casa Alto Padrão em Pirenópolis..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Tipo de Imóvel
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Flat / Studio">Flat / Studio</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Casa de Temporada">Casa de Temporada</option>
                  <option value="Chalé">Chalé</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Goiânia, Caldas Novas, Pirenópolis, Rio Quente..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Setor Marista, Jardim Goiás, Centro..."
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Destaque / Selo Visual (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mais Procurado, Vista para o Parque, Piscina Aquecida..."
                  value={featuredBadge}
                  onChange={(e) => setFeaturedBadge(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Endereço Real Completo (Rua, Número, Edifício, CEP, Cidade - GO) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Rua 147, nº 450, Ed. Metropolitan, Setor Marista, Goiânia - GO"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  Este endereço será exibido nos cards, no modal de detalhes e enviado ao hóspede ao confirmar pelo WhatsApp.
                </p>
              </div>

              {/* Coordinates & Presets */}
              <div className="sm:col-span-2 bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-stone-800 dark:text-stone-200">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    Ponto no Mapa Interativo (Latitude & Longitude)
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Clique abaixo para preencher rápido por região
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.keys(CITY_COORDINATE_PRESETS).map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleApplyPresetCoords(preset)}
                      className="px-2 py-0.5 text-[10px] font-semibold bg-white dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 rounded border border-stone-200 dark:border-stone-600 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-0.5">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={lat}
                      onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-500 dark:text-stone-400 mb-0.5">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={lng}
                      onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Capacity */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              2. Valores & Capacidade
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Diária (R$) *
                </label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Taxa Limpeza (R$)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={cleaningFee}
                  onChange={(e) => setCleaningFee(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Máx. Hóspedes
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Metragem (m²)
                </label>
                <input
                  type="number"
                  min="10"
                  value={sizeM2}
                  onChange={(e) => setSizeM2(parseInt(e.target.value, 10) || 10)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Quartos
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Banheiros
                </label>
                <input
                  type="number"
                  min="1"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Camas
                </label>
                <input
                  type="number"
                  min="1"
                  value={beds}
                  onChange={(e) => setBeds(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Nota Avaliação
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="3.0"
                  max="5.0"
                  value={airbnbRating}
                  onChange={(e) => setAirbnbRating(parseFloat(e.target.value) || 5.0)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                3. Fotos Reais do Imóvel
              </h3>
              <span className="text-[11px] text-stone-500">
                Aceita fotos do computador, celular ou link direto
              </span>
            </div>

            <div className="space-y-4">
              {/* Hero Image Section */}
              <div className="bg-stone-50 dark:bg-stone-800/50 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Foto Principal (Capa do Anúncio) *</span>
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded">
                    Aparece nos Cards e Mapa
                  </span>
                </div>

                {/* Direct Upload + URL Input */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    ref={heroFileInputRef}
                    accept="image/*"
                    onChange={handleHeroFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Enviar Foto do Celular / PC</span>
                  </button>

                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Ou cole o link da imagem (https://...jpg/png/webp)"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      className="flex-1 text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Preview of hero image */}
                {heroImage && (
                  <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700">
                    <img
                      src={heroImage}
                      alt="Pré-visualização da Capa"
                      className="w-24 h-16 object-cover rounded-lg shrink-0 border border-stone-100 dark:border-stone-800"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="text-xs min-w-0 flex-1">
                      <span className="font-bold text-stone-800 dark:text-stone-200 block">
                        Pré-visualização da Capa
                      </span>
                      <span className="text-[11px] text-stone-500 truncate block">
                        {heroImage.startsWith('data:') ? 'Imagem carregada do seu dispositivo (Pronta)' : heroImage}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Photo Presets for quick replacement */}
              <div>
                <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1 mb-2">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Sugestões de fotos de alta resolução para este anúncio:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PHOTO_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setHeroImage(preset.url)}
                      className="group relative h-20 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 text-left transition-all hover:ring-2 hover:ring-amber-500 cursor-pointer"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-stone-950/60 p-1.5 flex flex-col justify-end">
                        <span className="text-[10px] font-bold text-white leading-tight">
                          {preset.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Gallery Photos with Multi-upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Galeria de Fotos Adicionais
                  </label>
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleGalleryFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="text-xs text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ Carregar Fotos Adicionais do PC/Celular</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="https://.../quarto.jpg&#10;https://.../banheiro.jpg&#10;https://.../piscina.jpg"
                  value={galleryImagesText}
                  onChange={(e) => setGalleryImagesText(e.target.value)}
                  className="w-full text-xs font-mono bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Description & Amenities */}
          <div className="space-y-4 pt-3 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              4. Descrição & Comodidades
            </h3>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Descrição do Imóvel *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                Selecione as Comodidades Disponíveis
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMMON_AMENITIES.map((amenity) => {
                  const isChecked = selectedAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200'
                          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-stone-400'
                      }`}
                    >
                      <span className="truncate">{amenity}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Pontos Fortes / Destaques (um por linha)
                </label>
                <textarea
                  rows={3}
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Regras da Casa (uma por linha)
                </label>
                <textarea
                  rows={3}
                  value={houseRulesText}
                  onChange={(e) => setHouseRulesText(e.target.value)}
                  className="w-full text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      propertyToEdit &&
                      window.confirm(`Tem certeza que deseja excluir o imóvel "${propertyToEdit.title}"?`)
                    ) {
                      onDelete(propertyToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir este Imóvel</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Salvar Alterações' : 'Salvar Novo Imóvel'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
