import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  Trash2,
  Building,
  RotateCcw,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Property } from '../types/property';
import { PropertyEditorModal } from './PropertyEditorModal';

interface ManagePropertiesModalProps {
  isOpen: boolean;
  properties: Property[];
  onClose: () => void;
  onSaveProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onClearAll: () => void;
  onResetDefaults: () => void;
}

export const ManagePropertiesModal: React.FC<ManagePropertiesModalProps> = ({
  isOpen,
  properties,
  onClose,
  onSaveProperty,
  onDeleteProperty,
  onClearAll,
  onResetDefaults,
}) => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenNew = () => {
    setPropertyToEdit(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setPropertyToEdit(prop);
    setEditorOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Deseja remover o imóvel "${title}" do catálogo?`)) {
      onDeleteProperty(id);
      showNotice(`Imóvel "${title}" removido com sucesso.`);
    }
  };

  const handleClear = () => {
    if (
      window.confirm(
        'Tem certeza que deseja apagar todos os imóveis cadastrados? Você poderá cadastrar apenas os seus imóveis reais do zero.'
      )
    ) {
      onClearAll();
      showNotice('Todos os imóveis foram removidos. Cadastre seus imóveis reais agora!');
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        'Deseja restaurar os imóveis de exemplo para visualização?'
      )
    ) {
      onResetDefaults();
      showNotice('Imóveis restaurados.');
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      >
        <div className="w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 my-8 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-stone-900 dark:text-stone-100">
          {/* Header */}
          <div className="px-6 py-4 bg-stone-900 dark:bg-stone-950 text-white flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-600 text-white">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  Gerenciador de Imóveis · Aluga Goiás
                </h2>
                <p className="text-xs text-stone-300">
                  Cadastre seus imóveis reais, corrija endereços e atualize fotos instantaneamente.
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

          {/* Quick Notice banner */}
          <div className="p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 dark:text-amber-200">
                <span className="font-bold block">Seus Imóveis Reais na Aluga Goiás</span>
                Edite os endereços e fotos abaixo para refletir suas acomodações reais, ou exclua os imóveis de exemplo e cadastre os seus.
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenNew}
                className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Imóvel Real</span>
              </button>
            </div>
          </div>

          {/* Toast Notification inside modal */}
          {notification && (
            <div className="mx-6 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Property List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {properties.length === 0 ? (
              <div className="text-center py-16 bg-stone-50 dark:bg-stone-800/50 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-8 space-y-4">
                <Building className="w-12 h-12 text-stone-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                    Nenhum imóvel cadastrado no momento
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                    Você limpou a lista de imóveis. Clique no botão abaixo para cadastrar o seu primeiro imóvel real com fotos e endereço exato.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenNew}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cadastrar Primeiro Imóvel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restaurar Modelos de Exemplo</span>
                  </button>
                </div>
              </div>
            ) : (
              properties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-400 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
                    <img
                      src={prop.heroImage}
                      alt={prop.title}
                      className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          {prop.propertyType}
                        </span>
                        <span className="text-[11px] text-stone-500 font-medium">
                          {prop.city} · {prop.neighborhood}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {prop.title}
                      </h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate">{prop.address}</span>
                      </p>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 pt-0.5">
                        R$ {prop.pricePerNight} <span className="font-normal text-stone-500 text-[11px]">/ noite</span>
                        {prop.cleaningFee > 0 && (
                          <span className="text-stone-400 font-normal text-[11px] ml-2">
                            + R$ {prop.cleaningFee} limpeza
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for this property */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-700">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(prop)}
                      className="px-3 py-1.5 text-xs font-bold bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Editar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(prop.id, prop.title)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Excluir este imóvel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Bulk Clean / Reset */}
          <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-950/80 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 font-medium underline cursor-pointer"
              >
                Limpar todos os imóveis fictícios
              </button>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 font-medium underline cursor-pointer"
              >
                Restaurar exemplos
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenNew}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Cadastrar Imóvel Real</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
              >
                Concluir & Ver Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Single Property Editor Modal */}
      <PropertyEditorModal
        isOpen={editorOpen}
        propertyToEdit={propertyToEdit}
        onClose={() => setEditorOpen(false)}
        onSave={(updated) => {
          onSaveProperty(updated);
          setEditorOpen(false);
          showNotice(`Imóvel "${updated.title}" salvo com sucesso!`);
        }}
        onDelete={(id) => {
          onDeleteProperty(id);
          setEditorOpen(false);
          showNotice('Imóvel excluído.');
        }}
      />
    </>
  );
};
