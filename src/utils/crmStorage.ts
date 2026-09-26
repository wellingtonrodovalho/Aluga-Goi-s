import { Lead, LeadStatus, CrmWebhookConfig } from '../types/crm';

const CRM_STORAGE_KEY = 'wellington_stays_leads_v1';
const WEBHOOK_STORAGE_KEY = 'wellington_stays_webhook_v1';

const INITIAL_SEEDED_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Dra. Gabriela Vasconcelos',
    phone: '(61) 98844-1290',
    email: 'gabriela.vasconcelos@gmail.com',
    propertyId: 'flat-flamboyant-luxury',
    propertyTitle: 'Flat Alto Padrão Frente ao Parque Flamboyant',
    checkIn: '2026-10-15',
    checkOut: '2026-10-19',
    guests: 3,
    status: 'Em Atendimento',
    source: 'Formulário Landing',
    createdAt: '2026-09-25T14:32:00.000Z',
    notes: 'Interesse em estadia corporativa + lazer com a família. Enviado orçamento com desconto de 10% para 4 noites.',
    estimatedValue: 1560,
  },
  {
    id: 'lead-102',
    name: 'Rodrigo Alencastro',
    phone: '(11) 99120-4389',
    email: 'rodrigo.alencastro@techventures.com.br',
    propertyId: 'loft-marista-sky',
    propertyTitle: 'Loft Design & Sky View - Setor Marista',
    checkIn: '2026-10-02',
    checkOut: '2026-10-06',
    guests: 1,
    status: 'Reserva Confirmada',
    source: 'WhatsApp Direto',
    createdAt: '2026-09-24T18:15:00.000Z',
    notes: 'Reserva fechada diretamente via Pix com contrato assinado. Check-in confirmado às 15h.',
    estimatedValue: 1280,
  },
  {
    id: 'lead-103',
    name: 'Renata & Bruno Queiroz',
    phone: '(31) 98455-7761',
    email: 'renata.queiroz@adv.br',
    propertyId: 'refugio-pirenopolis-charme',
    propertyTitle: 'Vila Charme & Pomar - Centro Histórico de Piri',
    checkIn: '2026-11-01',
    checkOut: '2026-11-04',
    guests: 6,
    status: 'Proposta Enviada',
    source: 'Modal Imóvel',
    createdAt: '2026-09-26T08:10:00.000Z',
    notes: 'Família vai para casamento em Pirenópolis. Aguardando confirmação do sinal.',
    estimatedValue: 1950,
  },
  {
    id: 'lead-104',
    name: 'Marcos Vinicius Porto',
    phone: '(62) 98112-9900',
    email: 'marcos.porto@agrogoias.com.br',
    propertyId: 'penthouse-alto-da-gloria',
    propertyTitle: 'Penthouse Signature com Jacuzzi - Alto da Glória',
    checkIn: '2026-10-24',
    checkOut: '2026-10-26',
    guests: 2,
    status: 'Novo',
    source: 'Formulário Landing',
    createdAt: '2026-09-26T11:45:00.000Z',
    notes: 'Final de semana romântico. Solicitou informações sobre o funcionamento da hidromassagem e taxa de limpeza.',
    estimatedValue: 1160,
  },
];

export function getStoredLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(CRM_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(INITIAL_SEEDED_LEADS));
      return INITIAL_SEEDED_LEADS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEEDED_LEADS;
  } catch (err) {
    console.error('Failed to parse leads from storage', err);
    return INITIAL_SEEDED_LEADS;
  }
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'status'> & { status?: LeadStatus }): Lead {
  const currentLeads = getStoredLeads();
  const newLead: Lead = {
    ...leadData,
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: leadData.status || 'Novo',
  };

  const updated = [newLead, ...currentLeads];
  try {
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving lead', err);
  }

  // Dispatch background webhook if configured
  dispatchWebhookIfConfigured(newLead);

  return newLead;
}

export function updateLeadStatus(id: string, newStatus: LeadStatus): Lead[] {
  const current = getStoredLeads();
  const updated = current.map(item => (item.id === id ? { ...item, status: newStatus } : item));
  localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateLeadNotes(id: string, notes: string): Lead[] {
  const current = getStoredLeads();
  const updated = current.map(item => (item.id === id ? { ...item, notes } : item));
  localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteLead(id: string): Lead[] {
  const current = getStoredLeads();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function exportLeadsToCSV(leads: Lead[]): void {
  const headers = ['ID', 'Data Criação', 'Nome', 'Telefone', 'E-mail', 'Imóvel de Interesse', 'Check-In', 'Check-Out', 'Hóspedes', 'Status', 'Origem', 'Valor Estimado (R$)', 'Notas'];
  
  const rows = leads.map(l => [
    l.id,
    new Date(l.createdAt).toLocaleDateString('pt-BR'),
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.propertyTitle || 'Geral').replace(/"/g, '""')}"`,
    l.checkIn || '-',
    l.checkOut || '-',
    l.guests || 1,
    l.status,
    l.source,
    l.estimatedValue || 0,
    `"${(l.notes || l.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `leads-wellington-stays-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Webhook config
export function getStoredWebhookConfig(): CrmWebhookConfig {
  try {
    const raw = localStorage.getItem(WEBHOOK_STORAGE_KEY);
    if (!raw) {
      return {
        enabled: false,
        endpointUrl: '',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      enabled: false,
      endpointUrl: '',
    };
  }
}

export function saveWebhookConfig(config: CrmWebhookConfig): void {
  try {
    localStorage.setItem(WEBHOOK_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save webhook config', err);
  }
}

export async function dispatchWebhookIfConfigured(lead: Lead): Promise<boolean> {
  const config = getStoredWebhookConfig();
  if (!config.enabled || !config.endpointUrl) {
    return false;
  }

  try {
    const payload = {
      event: 'lead.created',
      timestamp: new Date().toISOString(),
      lead,
      system: 'Aluga Goiás Landing Page',
    };

    const res = await fetch(config.endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.secretToken ? { Authorization: `Bearer ${config.secretToken}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const success = res.ok;
    saveWebhookConfig({
      ...config,
      lastTestedAt: new Date().toISOString(),
      lastStatus: success ? 'success' : 'error',
      lastResponse: `HTTP ${res.status} ${res.statusText}`,
    });
    return success;
  } catch (err: any) {
    saveWebhookConfig({
      ...config,
      lastTestedAt: new Date().toISOString(),
      lastStatus: 'error',
      lastResponse: err?.message || 'Network error',
    });
    return false;
  }
}
