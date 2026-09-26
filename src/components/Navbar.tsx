import React, { useState } from 'react';
import { MessageSquare, Users, Menu, X, Sun, Moon, Building2 } from 'lucide-react';
import { WHATSAPP_PHONE_RAW, WHATSAPP_PHONE_DISPLAY } from '../utils/whatsapp';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenCrm: () => void;
  leadCount: number;
  onOpenContact: () => void;
  onOpenManageProperties: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCrm,
  leadCount,
  onOpenContact,
  onOpenManageProperties,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const directWaUrl = `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(
    'Olá! Acessei o site da Aluga Goiás e gostaria de consultar a disponibilidade dos imóveis.'
  )}`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 group transition-colors"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100 font-display group-hover:text-amber-700 dark:group-hover:text-amber-400">
            Aluga Goiás
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded-md">
            Temporada & Flats
          </span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300">
          <a href="#imoveis" className="hover:text-stone-950 dark:hover:text-white transition-colors">
            Imóveis
          </a>
          <a href="#mapa" className="hover:text-stone-950 dark:hover:text-white transition-colors">
            Mapa Interativo
          </a>
          <a href="#depoimentos" className="hover:text-stone-950 dark:hover:text-white transition-colors">
            Avaliações
          </a>
          <a href="#diferenciais" className="hover:text-stone-950 dark:hover:text-white transition-colors">
            Diferenciais
          </a>
          <a href="#contato" className="hover:text-stone-950 dark:hover:text-white transition-colors">
            Contato
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions + theme toggle */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Manage Properties Trigger for Wellington */}
          <button
            type="button"
            onClick={onOpenManageProperties}
            className="px-2.5 sm:px-3 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="Gerenciar e cadastrar imóveis reais, fotos e endereços"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden lg:inline">Gerenciar Imóveis</span>
            <span className="inline lg:hidden">Imóveis</span>
          </button>

          {/* CRM Dashboard Trigger */}
          <button
            type="button"
            onClick={onOpenCrm}
            className="relative px-2.5 sm:px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Acessar Gestão de Leads e CRM"
          >
            <Users className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
            <span className="hidden sm:inline">CRM</span>
            {leadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                {leadCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-200" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700 animate-in spin-in-180 duration-200" />
            )}
          </button>

          {/* Primary WhatsApp CTA */}
          <a
            href={directWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm hover:shadow flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-white" />
            <span className="hidden xl:inline">WhatsApp {WHATSAPP_PHONE_DISPLAY}</span>
            <span className="inline xl:hidden">WhatsApp</span>
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-stone-700 dark:text-stone-200">
            <a
              href="#imoveis"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Imóveis Cadastrados
            </a>
            <a
              href="#mapa"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Mapa das Unidades
            </a>
            <a
              href="#depoimentos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Depoimentos & Reputação
            </a>
            <a
              href="#diferenciais"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Vantagens da Reserva Direta
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-amber-700 dark:hover:text-amber-400"
            >
              Contato & Localização
            </a>
          </nav>
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenManageProperties();
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Gerenciar Meus Imóveis (Endereços & Fotos)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCrm();
              }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 rounded-lg text-center flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-stone-600 dark:text-stone-400" /> Painel de Leads & CRM ({leadCount} cadastros)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

