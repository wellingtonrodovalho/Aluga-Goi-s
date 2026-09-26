import React from 'react';
import { ShieldCheck, Percent, KeyRound, Sparkles, Coffee, Headset } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_DISPLAY } from '../utils/whatsapp';

export const AdvantagesSection: React.FC = () => {
  return (
    <section id="diferenciais" className="py-16 sm:py-20 bg-white dark:bg-stone-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-2">
            Vantagens da Reserva Direta
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight font-display text-balance">
            Por que reservar direto com a Aluga Goiás?
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2">
            A mesma segurança e excelência comprovada por centenas de avaliações 5 estrelas no Airbnb, com benefícios exclusivos para clientes diretos.
          </p>
        </div>

        {/* 6 Feature Pillars (No pills, clean architectural cards with subtle borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Economia de até 15% em Taxas
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Sem intermediários ou taxas de serviço abusivas de aplicativos. Você negocia o valor líquido diretamente com o proprietário.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Self Check-in 24 Horas
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Fechaduras eletrônicas com senhas temporárias personalizadas. Chegue no seu próprio tempo, de madrugada ou em voos noturnos, com total autonomia.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Limpeza Padrão Hospitalar
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Enxoval higienizado em lavanderia industrial, roupas de cama 400 fios, toalhas macias e kit de amenities de boas-vindas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Headset className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Suporte VIP no WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Contato direto no celular ({WHATSAPP_PHONE_DISPLAY}) com resposta em minutos para tirar dúvidas, estender estadias ou suporte local.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Dicas Locais & Concierge
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Guia exclusivo com as melhores cafeterias do Setor Marista, restaurantes no Flamboyant, melhores piscinas em Caldas e cachoeiras secretas em Piri.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-3 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Segurança Jurídica & CRECI-GO
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Atendimento por Corretor e Perito Avaliador credenciado (CRECI-GO 42695 | CNAI 54826) e Superhost Airbnb há 6 anos, com contrato de temporada e nota para reembolso corporativo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
