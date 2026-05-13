export type PaymentMethod = 'Nequi' | 'Efectivo' | 'Transferencia' | 'Otro';

export type TicketStatus = 'disponible' | 'vendido' | 'pendiente' | 'bloqueado';

export interface Ticket {
  number: string;
  name: string;
  phone: string;
  paymentMethod: PaymentMethod | '';
  paid: boolean;
  purchaseDate: string;
  status: TicketStatus;
}
