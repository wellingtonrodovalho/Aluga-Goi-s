import React, { useState } from 'react';
import { Lead, LeadStatus, CrmWebhookConfig } from '../types/crm';
import {
  X,
  Users,
  Download,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Search,
  CheckCircle,
  ExternalLink,
  Settings,
  Trash2,
  Send,
  DollarSign,
  Filter,
} from 'lucide-react';
import {
  updateLeadStatus,
  updateLeadNotes,
  deleteLead,
  exportLeadsToCSV,
  getStoredWebhookConfig,
  saveWebhookConfig,
  dispatchWebhookIfConfigured,
} from '../utils/crmStorage';

interface CrmDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onLeadsChange: (updated: Lead[]) => void;
  onNotification: (msg: string) => void;
}

export const CrmDrawer: React.FC<CrmDrawerProps> = ({
  isOpen,
  onClose,
  leads,
  onLeadsChange,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'webhooks'>('pipeline');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  // Webhook settings state
  const [webhookConfig, setWebhookConfig] = useState<CrmWebhookConfig>(getStoredWebhookConfig());
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesQuery =
      searchQuery === '' ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  // Calculate metrics
  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  const confirmedCount = leads.filter((l) => l.status === 'Reserva Confirmada').length;
  const newCount = leads.filter((l) => l.status === 'Novo').length;

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    const updated = updateLeadStatus(id, newStatus);
    onLeadsChange(updated);
    onNotification(`Status do lead atualizado para "${newStatus}"`);
  };

  const handleSaveNote = (id: string) => {
    const note = editingNotes[id];
    if (note !== undefined) {
      const updated = updateLeadNotes(id, note);
      onLeadsChange(updated);
      onNotification('Anotações salvas com sucesso');
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este lead do CRM?')) {
      const updated = deleteLead(id);
      onLeadsChange(updated);
      onNotification('Lead removido do pipeline');
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    saveWebhookConfig(webhookConfig);
    onNotification('Configurações de integração CRM salvas');
  };

  const handleTestWebhook = async () => {
    setTestingWebhook(true);
    setTestResult(null);
    try {
      const mockLead: Lead = leads[0] || {
        id: 'test-lead-demo',
        name: 'Lead de Teste Webhook',
        phone: '(62) 99151-4568',
        email: 'contato@teste.com.br',
        status: 'Novo',
        source: 'Formulário Landing',
        createdAt: new Date().toISOString(),
      };

      const success = await dispatchWebhookIfConfigured(mockLead);
      if (success) {
        setTestResult('Sucesso! O webhook respondeu com HTTP 200/201.');
      } else {
        setTestResult('Falha na conexão: verifique se a URL aceita requisições POST JSON CORS.');
      }
    } catch (err: any) {
      setTestResult(`Erro: ${err.message}`);
    } finally {
      setTestingWebhook(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex justify-end"
    >
      <div className="w-full max-w-3xl bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-200 transition-colors">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-900 dark:bg-stone-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-stone-800 dark:bg-stone-900 text-amber-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Gestão de Leads & Integração CRM</h2>
              <p className="text-xs text-stone-400">
                Aluga Goiás · Pipeline de Reservas e Conversão
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportLeadsToCSV(leads)}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Exportar base completa para Excel/CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exportar CSV</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
              aria-label="Fechar painel CRM"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation: Pipeline vs Webhooks */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/70">
          <button
            type="button"
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'pipeline'
                ? 'border-stone-900 dark:border-amber-400 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pipeline de Leads ({leads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'webhooks'
                ? 'border-stone-900 dark:border-amber-400 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Integração Externa (RD Station / Webhook)</span>
          </button>
        </div>

        {/* Tab Content: Pipeline */}
        {activeTab === 'pipeline' && (
          <div className="flex-1 flex flex-col min-h-0 bg-stone-50/30 dark:bg-stone-900">
            {/* KPI Summary Cards */}
            <div className="p-4 sm:p-6 bg-stone-50/50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Total de Leads</div>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  {leads.length}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Novos Leads</div>
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">{newCount}</div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Confirmadas</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {confirmedCount}
                </div>
              </div>
              <div className="p-3 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">Pipeline Estimado</div>
                <div className="text-lg font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                  R$ {totalPipelineValue.toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone, imóvel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white dark:focus:bg-stone-800"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {['all', 'Novo', 'Em Atendimento', 'Proposta Enviada', 'Reserva Confirmada'].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
                        statusFilter === st
                          ? 'bg-stone-900 dark:bg-amber-600 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {st === 'all' ? 'Todos' : st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Leads List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-12 text-stone-400 dark:text-stone-500 text-xs">
                  Nenhum lead encontrado para os filtros selecionados.
                </div>
              ) : (
                filteredLeads.map((lead) => {
                  const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                  const waLeadUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                    `Olá, ${lead.name}! Sou o Wellington. Vi seu interesse no imóvel ${
                      lead.propertyTitle || 'em Goiás'
                    }. Como posso lhe ajudar?`
                  )}`;

                  return (
                    <div
                      key={lead.id}
                      className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 p-4 shadow-xs hover:border-stone-300 dark:hover:border-stone-600 transition-all space-y-3"
                    >
                      {/* Top Row: Name, Status Dropdown, and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">{lead.name}</span>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500">
                              {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                            Interesse: <strong className="text-stone-800 dark:text-stone-200">{lead.propertyTitle}</strong>
                          </div>
                        </div>

                        {/* Status selector */}
                        <div className="flex items-center gap-2">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${
                              lead.status === 'Reserva Confirmada'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                : lead.status === 'Novo'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                                : lead.status === 'Em Atendimento'
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                                : 'bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                            }`}
                          >
                            <option value="Novo">Novo</option>
                            <option value="Em Atendimento">Em Atendimento</option>
                            <option value="Proposta Enviada">Proposta Enviada</option>
                            <option value="Reserva Confirmada">Reserva Confirmada</option>
                            <option value="Perdido">Perdido</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 rounded cursor-pointer"
                            title="Remover lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Channels */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <strong>{lead.phone}</strong>
                        </span>

                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <span>{lead.email}</span>
                          </span>
                        )}

                        {lead.checkIn && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>
                              {lead.checkIn} a {lead.checkOut || 'A definir'}
                            </span>
                          </span>
                        )}

                        <span className="text-[11px] text-stone-400 dark:text-stone-500">
                          Origem: {lead.source}
                        </span>
                      </div>

                      {/* Quick Note & Estimated Value */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="text-xs text-stone-600 dark:text-stone-300 flex-1">
                          {lead.notes ? (
                            <span className="italic">"{lead.notes}"</span>
                          ) : (
                            <span className="text-stone-400 dark:text-stone-500 italic">Sem anotações registradas</span>
                          )}
                        </div>

                        {/* Direct WhatsApp button to this specific lead */}
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={waLeadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-1 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                            <span>Chamar no WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Webhooks & External CRM Integration */}
        {activeTab === 'webhooks' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white dark:bg-stone-900">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Integração com Ferramentas de CRM & Automação
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300">
                Dispare os leads da landing page automaticamente para o seu CRM preferido (RD Station, HubSpot, Kommo, Pipedrive, Zapier, Make ou Webhook).
              </p>
            </div>

            <form onSubmit={handleSaveWebhook} className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-5 border border-stone-200 dark:border-stone-700 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Ativar Envio de Webhook Automático
                </label>
                <input
                  type="checkbox"
                  checked={webhookConfig.enabled}
                  onChange={(e) =>
                    setWebhookConfig({ ...webhookConfig, enabled: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                  URL do Endpoint Webhook (POST)
                </label>
                <input
                  type="url"
                  placeholder="https://webhook.site/... ou https://api.rd.services/..."
                  value={webhookConfig.endpointUrl}
                  onChange={(e) =>
                    setWebhookConfig({ ...webhookConfig, endpointUrl: e.target.value })
                  }
                  className="w-full text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  A cada novo contato recebido, enviaremos um payload JSON completo com nome, telefone, datas e imóvel.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-600 dark:text-stone-400 mb-1">
                  Token de Autenticação / Bearer Secret (Opcional)
                </label>
                <input
                  type="password"
                  placeholder="Bearer token de segurança"
                  value={webhookConfig.secretToken || ''}
                  onChange={(e) =>
                    setWebhookConfig({ ...webhookConfig, secretToken: e.target.value })
                  }
                  className="w-full text-xs font-mono bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Salvar Configurações
                </button>

                <button
                  type="button"
                  onClick={handleTestWebhook}
                  disabled={testingWebhook || !webhookConfig.endpointUrl}
                  className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold text-xs rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {testingWebhook ? 'Disparando...' : 'Testar Envio de Teste'}
                </button>
              </div>

              {testResult && (
                <div className="p-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300">
                  {testResult}
                </div>
              )}
            </form>

            {/* Documentation Payload Example */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Formato do Payload Enviado
              </div>
              <pre className="bg-stone-900 dark:bg-stone-950 text-stone-100 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-stone-800">
{`{
  "event": "lead.created",
  "timestamp": "2026-09-26T12:00:00Z",
  "lead": {
    "name": "Cliente Exemplo",
    "phone": "(62) 99151-4568",
    "email": "cliente@email.com",
    "propertyTitle": "Loft Design & Sky View - Setor Marista",
    "source": "Landing Page"
  }
}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
