import React, { useState } from 'react';
import { TESTIMONIALS, SUPERHOST_STATS, Testimonial } from '../data/testimonials';
import { PROPERTIES } from '../data/properties';
import { Star, ShieldCheck, Award, ThumbsUp, CheckCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { buildWhatsAppLink, AIRBNB_PROFILE_URL } from '../utils/whatsapp';

export const TestimonialsSection: React.FC = () => {
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('all');
  const [userTestimonials, setUserTestimonials] = useState<Testimonial[]>(TESTIMONIALS);

  // New review form modal
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newAuthor, setNewAuthor] = useState('');
  const [newOrigin, setNewOrigin] = useState('');
  const [newPropertyId, setNewPropertyId] = useState(PROPERTIES[0].id);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const filteredTestimonials =
    selectedPropertyFilter === 'all'
      ? userTestimonials
      : userTestimonials.filter((t) => t.propertyId === selectedPropertyFilter);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const prop = PROPERTIES.find((p) => p.id === newPropertyId);
    const newRev: Testimonial = {
      id: `rev-user-${Date.now()}`,
      author: newAuthor,
      origin: newOrigin || 'Goiânia, GO',
      stayDate: 'Recentemente',
      propertyId: newPropertyId,
      propertyName: prop?.title || 'Imóvel Aluga Goiás',
      rating: newRating,
      comment: newComment,
      verifiedAirbnb: true,
      avatarColor: 'bg-emerald-600',
      categoryRatings: {
        cleanliness: newRating,
        accuracy: 5.0,
        communication: 5.0,
        location: 5.0,
        value: 5.0,
      },
    };

    setUserTestimonials([newRev, ...userTestimonials]);
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowAddReviewModal(false);
      setReviewSubmitted(false);
      setNewAuthor('');
      setNewComment('');
    }, 1800);
  };

  const waProofLink = buildWhatsAppLink({
    customMessage: 'Vi as avaliações no site e gostaria de confirmar a reserva direta de um dos imóveis.',
  });

  return (
    <section id="depoimentos" className="py-16 sm:py-20 bg-stone-100/60 dark:bg-stone-950 border-t border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Credibilidade & Avaliações Reais do Airbnb</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display text-balance">
            O que dizem os hóspedes que já se hospedaram na Aluga Goiás
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2">
            Mais de 480 famílias, casais e executivos já se hospedaram conosco com classificação média de 4.98 estrelas e status contínuo de Superhost.
          </p>
        </div>

        {/* Superhost Credibility Showcase Banner */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-sm transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Overall Score Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 pb-6 lg:pb-0 lg:pr-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-2xl font-display">
                  ★
                </div>
                <div>
                  <div className="text-3xl font-black text-stone-900 dark:text-stone-100 tabular-nums">
                    {SUPERHOST_STATS.overallRating}
                    <span className="text-base font-normal text-stone-400 dark:text-stone-500"> / 5.0</span>
                  </div>
                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1.5 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{SUPERHOST_STATS.totalReviews} avaliações 100% verificadas</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Perfil oficial de <strong>Wellington Rodovalho</strong> (CRECI-GO 42695 | CNAI 54826) e co-anfitriões Keyla e Davi, reconhecido pelo Airbnb por mais de <strong>{SUPERHOST_STATS.superhostYears} anos consecutivos</strong> com padrão Superhost.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href={AIRBNB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Perfil Oficial no Airbnb ({SUPERHOST_STATS.totalReviews} avaliações)</span>
                </a>
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(true)}
                  className="px-3.5 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                >
                  Deixar Depoimento
                </button>
              </div>
            </div>

            {/* Right: Sub-Rating Progress Metric Bars (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Limpeza & Higienização</span>
                    <span className="font-bold tabular-nums">5.0</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Precisão das Fotos & Descrição</span>
                    <span className="font-bold tabular-nums">5.0</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Comunicação & Rapidez</span>
                    <span className="font-bold tabular-nums">5.0</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Localização Nobre</span>
                    <span className="font-bold tabular-nums">4.98</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[99%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Custo-Benefício Direto</span>
                    <span className="font-bold tabular-nums">4.95</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[98%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    <span>Check-in Autônomo com Senha</span>
                    <span className="font-bold tabular-nums">100%</span>
                  </div>
                  <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Reviews by Property */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Filtrar por unidade:
          </span>
          <button
            type="button"
            onClick={() => setSelectedPropertyFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedPropertyFilter === 'all'
                ? 'bg-stone-900 dark:bg-amber-600 text-white'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
            }`}
          >
            Todas as avaliações ({userTestimonials.length})
          </button>
          {PROPERTIES.map((prop) => (
            <button
              key={prop.id}
              type="button"
              onClick={() => setSelectedPropertyFilter(prop.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                selectedPropertyFilter === prop.id
                  ? 'bg-stone-900 dark:bg-amber-600 text-white'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700'
              }`}
            >
              {prop.neighborhood} ({prop.city})
            </button>
          ))}
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header: Author, Origin, Airbnb Verification */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${item.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}
                    >
                      {item.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-none">
                        {item.author}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {item.origin} · {item.stayDate}
                      </div>
                    </div>
                  </div>

                  {item.verifiedAirbnb && (
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                      <ShieldCheck className="w-3 h-3" /> Airbnb Verificado
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Footer Property Attribution */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                <span className="truncate font-medium text-stone-700 dark:text-stone-300">
                  {item.propertyName}
                </span>
                <span className="text-amber-800 dark:text-amber-400 font-semibold shrink-0 ml-2">5.0 ★</span>
              </div>
            </div>
          ))}
        </div>

        {/* Direct WhatsApp Callout from Testimonials */}
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
              Quer uma experiência de hospedagem impecável com a Aluga Goiás?
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300">
              Tire suas dúvidas diretamente no WhatsApp (62 99151-4568) e tenha o melhor preço sem taxa de intermediários.
            </p>
          </div>
          <a
            href={waProofLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Review Submission Modal */}
      {showAddReviewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 max-w-md w-full border border-stone-200 dark:border-stone-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Compartilhe sua Experiência
              </h3>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="p-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Depoimento Registrado!</h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Obrigado por ajudar outros hóspedes a conhecerem a qualidade dos nossos imóveis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Nogueira"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full text-xs border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Sua Cidade / Estado de Origem
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo, SP"
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full text-xs border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Imóvel que você se hospedou
                  </label>
                  <select
                    value={newPropertyId}
                    onChange={(e) => setNewPropertyId(e.target.value)}
                    className="w-full text-xs border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {PROPERTIES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.neighborhood})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Nota (1 a 5 estrelas)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setNewRating(st)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            st <= newRating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-stone-300 dark:text-stone-600'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                    Seu depoimento sobre a estadia
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Conte como foi sua estadia, a limpeza, a comunicação com o Wellington..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full text-xs border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Publicar Depoimento
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
