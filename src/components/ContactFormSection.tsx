import React, { useState } from 'react';
import { Property } from '../types/property';
import { saveLead } from '../utils/crmStorage';
import {
  buildWhatsAppLink,
  WHATSAPP_PHONE_RAW,
  WHATSAPP_PHONE_DISPLAY,
  OFFICIAL_EMAIL,
  OFFICIAL_ADDRESS,
  OFFICIAL_CRECI,
  OFFICIAL_CNAI,
  AIRBNB_PROFILE_URL,
} from '../utils/whatsapp';
import {
  MessageSquare,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Clock,
  ExternalLink,
  Award,
} from 'lucide-react';

interface ContactFormSectionProps {
  properties: Property[];
  onLeadCaptured: (msg: string) => void;
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  properties,
  onLeadCaptured,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const saved = saveLead({
        name,
        phone,
        email,
        propertyId: selectedProperty?.id,
        propertyTitle: selectedProperty?.title || 'Interesse Geral em Goiás',
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        guests,
        message,
        source: 'Formulário Landing',
        estimatedValue: selectedProperty ? selectedProperty.pricePerNight * 2 : 700,
      });

      setSubmitted(true);
      onLeadCaptured(`Contato de ${name} salvo com sucesso no CRM!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  const directWaUrl = buildWhatsAppLink({
    property: selectedProperty,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests,
    customMessage: message || undefined,
  });

  return (
    <section id="contato" className="py-16 sm:py-20 bg-white dark:bg-stone-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Host Credentials (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
                Fale Direto com o Anfitrião
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display text-balance">
                Pronto para reservar ou tirar dúvidas sobre sua estadia?
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 mt-2">
                Envie seus dados no formulário ao lado para receber uma proposta exclusiva ou inicie uma conversa instantânea pelo WhatsApp.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              {/* WhatsApp Card */}
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wide">
                      WhatsApp Oficial
                    </div>
                    <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">
                      {WHATSAPP_PHONE_DISPLAY}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-white dark:bg-stone-900 px-2.5 py-1 rounded-md shadow-xs border border-emerald-100 dark:border-emerald-800">
                  Conversar
                </span>
              </a>

              {/* Host Profile Info & Professional Credentials */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3 text-xs text-stone-600 dark:text-stone-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Wellington Rodovalho</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded">
                    Superhost há 6 anos
                  </span>
                </div>

                <div className="text-[11px] space-y-1 text-stone-600 dark:text-stone-300">
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200">Qualificação:</strong> Corretor de Imóveis ({OFFICIAL_CRECI}) | Perito Avaliador Imobiliário ({OFFICIAL_CNAI}) | Servidor Público
                  </div>
                  <div>
                    <strong className="text-stone-800 dark:text-stone-200">Co-anfitriões de Apoio:</strong> Keyla e Davi
                  </div>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <span>{OFFICIAL_EMAIL}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{OFFICIAL_ADDRESS}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">Classificação 4.92 ★ (91 avaliações)</span>
                  <a
                    href={AIRBNB_PROFILE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <span>Perfil no Airbnb</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 text-xs text-stone-600 dark:text-stone-300">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <div className="font-bold text-stone-900 dark:text-stone-100 mb-0.5">Sem Intermediários</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Melhor valor garantido sem taxas de serviço adicionais.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800">
                <div className="font-bold text-stone-900 dark:text-stone-100 mb-0.5">Check-in Facilitado</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Acesso rápido com fechaduras eletrônicas por senha 24 horas.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Lead Capture Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-stone-50/70 dark:bg-stone-900/90 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm transition-colors">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Formulário de Solicitação de Reserva & Cotação
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                  Preencha em menos de 1 minuto. Seus dados são salvos diretamente em nosso sistema CRM.
                </p>
              </div>

              {submitted ? (
                <div className="py-8 px-4 text-center space-y-4 bg-white dark:bg-stone-900 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                      Mensagem Recebida com Sucesso!
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                      Obrigado, <strong>{name}</strong>. Nossa equipe recebeu sua solicitação e entrará em contato via WhatsApp/Telefone ({phone}) para confirmar os detalhes.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={directWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Agilizar pelo WhatsApp agora</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                    >
                      Enviar outra mensagem
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João da Silva"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    {/* WhatsApp / Phone */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                        WhatsApp com DDD *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (62) 99999-9999"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                        E-mail para confirmação
                      </label>
                      <input
                        type="email"
                        placeholder="Ex: seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>

                    {/* Property of interest */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                        Imóvel de Interesse
                      </label>
                      <select
                        value={selectedPropertyId}
                        onChange={(e) => setSelectedPropertyId(e.target.value)}
                        className="w-full text-xs sm:text-sm font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                      >
                        <option value="">Ainda não decidi / Quero recomendação</option>
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.neighborhood}, {p.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Check In */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                        Check-in previsto
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Check Out */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                        Check-out previsto
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                        Qtd. Hóspedes
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full text-xs font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                      >
                        <option value={1}>1 pessoa</option>
                        <option value={2}>2 pessoas</option>
                        <option value={3}>3 pessoas</option>
                        <option value={4}>4 pessoas</option>
                        <option value={5}>5 pessoas</option>
                        <option value={6}>6+ pessoas</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      Mensagem ou pedidos especiais
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ex: Viagem a trabalho, preciso de vaga na garagem e nota fiscal..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full text-xs sm:text-sm font-medium bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Registrando...' : 'Solicitar Orçamento & Reserva'}</span>
                    </button>

                    <span className="text-xs text-stone-500 dark:text-stone-400 text-center sm:text-left">
                      Ou se preferir:{' '}
                      <a
                        href={directWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline"
                      >
                        chamar no WhatsApp {WHATSAPP_PHONE_DISPLAY}
                      </a>
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
