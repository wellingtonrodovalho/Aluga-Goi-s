export type LeadStatus = 'Novo' | 'Em Atendimento' | 'Proposta Enviada' | 'Reserva Confirmada' | 'Perdido';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId?: string;
  propertyTitle?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  message?: string;
  status: LeadStatus;
  source: 'Formulário Landing' | 'WhatsApp Direto' | 'Modal Imóvel' | 'Consulta Rápida';
  createdAt: string;
  notes?: string;
  estimatedValue?: number;
}

export interface CrmWebhookConfig {
  enabled: boolean;
  endpointUrl: string;
  secretToken?: string;
  lastTestedAt?: string;
  lastStatus?: 'success' | 'error' | 'pending';
  lastResponse?: string;
}
