import React from 'react';
import {
  WHATSAPP_PHONE_RAW,
  WHATSAPP_PHONE_DISPLAY,
  OFFICIAL_EMAIL,
  OFFICIAL_ADDRESS,
  OFFICIAL_CRECI,
  OFFICIAL_CNAI,
  AIRBNB_PROFILE_URL,
} from '../utils/whatsapp';
import { MessageSquare, ShieldCheck, ExternalLink, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 dark:bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <span className="text-xl font-black text-white tracking-tight font-display">
              Aluga Goiás
            </span>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Locação por temporada e estadias flexíveis em Goiás. Gestão profissional liderada por Wellington Rodovalho com padrão de hotelaria e self check-in 24h.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Wellington Rodovalho · {OFFICIAL_CRECI} · {OFFICIAL_CNAI}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{OFFICIAL_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-500 shrink-0" />
                <span>{OFFICIAL_EMAIL}</span>
              </div>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navegação & Perfil
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#imoveis" className="hover:text-white transition-colors">
                  Imóveis Disponíveis
                </a>
              </li>
              <li>
                <a href="#mapa" className="hover:text-white transition-colors">
                  Mapa Interativo de Unidades
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Avaliações & Reputação
                </a>
              </li>
              <li>
                <a
                  href={AIRBNB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rose-400 transition-colors flex items-center gap-1.5 text-rose-400/90 font-medium"
                >
                  <span>Perfil Oficial no Airbnb</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-white transition-colors">
                  Vantagens da Reserva Direta
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Solicitar Cotação
                </a>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Contact (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Contato Direto com Wellington
            </h4>
            <p className="text-xs text-stone-400">
              Para orçamentos corporativos, reservas imediatas ou estadias prolongadas:
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
                'Olá, Wellington! Acessei o site da Aluga Goiás e gostaria de consultar a disponibilidade dos imóveis.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp: {WHATSAPP_PHONE_DISPLAY}</span>
            </a>
            <div className="text-[11px] text-stone-500">
              Goiânia - GO · Atendimento diário das 08h às 22h
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Aluga Goiás · Wellington Rodovalho ({OFFICIAL_CRECI} | {OFFICIAL_CNAI}). Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Goiás · Brasil</span>
            <span>·</span>
            <span>Superhost Airbnb</span>
            <span>·</span>
            <span>Reserva Segura</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
