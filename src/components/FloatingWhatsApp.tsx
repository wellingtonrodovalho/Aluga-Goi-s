import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_DISPLAY } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const directUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
    'Olá! Acessei o site da Aluga Goiás e gostaria de consultar a disponibilidade dos imóveis.'
  )}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Mini popup tooltip on click */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150 transition-colors">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                WR
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 dark:text-stone-100">Wellington Rodovalho</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Online agora</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Olá! Precisa de ajuda para escolher a melhor acomodação em Goiânia, Caldas Novas ou Pirenópolis?
          </p>

          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span>Iniciar Conversa no WhatsApp</span>
          </a>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer group active:scale-95"
        aria-label="Abrir WhatsApp com Wellington"
        title="Falar com Wellington no WhatsApp: (62) 99151-4568"
      >
        <MessageSquare className="w-6 h-6 fill-white group-hover:scale-110 transition-transform" />
        <span className="sr-only">WhatsApp (62) 99151-4568</span>
      </button>
    </div>
  );
};
