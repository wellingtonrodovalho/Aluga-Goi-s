import { Property } from '../types/property';

export const WHATSAPP_PHONE_RAW = '5562985451980';
export const WHATSAPP_PHONE_DISPLAY = '(62) 98545-1980';
export const OFFICIAL_EMAIL = 'contato@alugagoias.com.br';
export const OFFICIAL_ADDRESS = 'Av. Edmundo Pinheiro de Abreu, 31, Goiânia - GO, CEP 74823-030';
export const OFFICIAL_CRECI = 'CRECI-GO 42695';
export const OFFICIAL_CNAI = 'CNAI 54826';
export const AIRBNB_PROFILE_URL =
  'https://www.airbnb.com.br/users/profile/1462540987528052413?previous_page_name=PdpHomeMarketplace';

export interface WhatsAppInquiryParams {
  property?: Property;
  propertyTitle?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  customMessage?: string;
  source?: string;
}

export function buildWhatsAppLink(params: WhatsAppInquiryParams): string {
  const { property, propertyTitle, checkIn, checkOut, guests, customMessage } = params;

  let text = 'Olá! Vim pelo site da Aluga Goiás. ';

  if (property) {
    text += `Gostaria de consultar a disponibilidade do imóvel *${property.title}* (${property.neighborhood}, ${property.city} - R$ ${property.pricePerNight}/diária).\n`;
  } else if (propertyTitle) {
    text += `Tenho interesse no imóvel *${propertyTitle}*.\n`;
  } else {
    text += `Gostaria de tirar dúvidas e consultar a disponibilidade dos seus imóveis de temporada em Goiás.\n`;
  }

  if (checkIn && checkOut) {
    text += `📅 *Período previsto:* ${checkIn} a ${checkOut}\n`;
  }

  if (guests) {
    text += `👥 *Hóspedes:* ${guests} pessoa(s)\n`;
  }

  if (customMessage && customMessage.trim()) {
    text += `💬 *Observação:* ${customMessage.trim()}\n`;
  }

  text += `\nPoderia me passar os valores atualizados e orientações para reserva direta? Obrigado!`;

  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodeURIComponent(text)}`;
}
