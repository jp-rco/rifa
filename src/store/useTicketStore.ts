import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ticket, TicketStatus, PaymentMethod } from '../types';
import { supabase } from '../services/supabase';

interface TicketStore {
  tickets: Record<string, Ticket>;
  initializeTickets: () => void;
  fetchFromSupabase: () => Promise<void>;
  updateTicket: (number: string, data: Partial<Ticket>) => void;
  registerSale: (number: string, data: { name: string; phone: string; paymentMethod: PaymentMethod | ''; paid: boolean; status?: TicketStatus }) => void;
  clearTicket: (number: string) => void;
}

const generateInitialTickets = (): Record<string, Ticket> => {
  const initial: Record<string, Ticket> = {};
  for (let i = 0; i < 100; i++) {
    const num = i.toString().padStart(2, '0');
    initial[num] = {
      number: num,
      name: '',
      phone: '',
      paymentMethod: '',
      paid: false,
      purchaseDate: '',
      status: 'disponible',
    };
  }
  return initial;
};

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: generateInitialTickets(),
      
      initializeTickets: () => set({ tickets: generateInitialTickets() }),
      
      fetchFromSupabase: async () => {
        try {
          const { data, error } = await supabase.from('tickets').select('*');
          if (error) throw error;
          
          if (data && data.length > 0) {
            const remoteTickets: Record<string, Ticket> = { ...get().tickets };
            data.forEach((t: Ticket) => {
              remoteTickets[t.number] = t;
            });
            set({ tickets: remoteTickets });
          }
        } catch (error) {
          console.error("Error fetching from Supabase:", error);
        }
      },

      updateTicket: async (number, data) => {
        set((state) => ({
          tickets: {
            ...state.tickets,
            [number]: { ...state.tickets[number], ...data },
          },
        }));

        try {
          const updated = get().tickets[number];
          await supabase.from('tickets').upsert(updated);
        } catch (e) {
          console.error("Error syncing update to Supabase:", e);
        }
      },

      registerSale: async (number, data) => {
        let newStatus: TicketStatus = data.status || (data.paid ? 'vendido' : 'pendiente');
        set((state) => ({
          tickets: {
            ...state.tickets,
            [number]: {
              ...state.tickets[number],
              ...data,
              status: newStatus,
              purchaseDate: new Date().toISOString(),
            },
          },
        }));

        try {
          const updated = get().tickets[number];
          await supabase.from('tickets').upsert(updated);
        } catch (e) {
          console.error("Error syncing sale to Supabase:", e);
        }
      },

      clearTicket: async (number) => {
        const resetTicket = {
          number,
          name: '',
          phone: '',
          paymentMethod: '' as PaymentMethod | '',
          paid: false,
          purchaseDate: '',
          status: 'disponible' as TicketStatus,
        };

        set((state) => ({
          tickets: {
            ...state.tickets,
            [number]: resetTicket,
          },
        }));

        try {
          // Instead of deleting, we update the ticket back to 'disponible' state to keep 100 fixed rows if preferred
          await supabase.from('tickets').upsert(resetTicket);
        } catch (e) {
          console.error("Error syncing clear to Supabase:", e);
        }
      },
    }),
    {
      name: 'rifa-storage',
    }
  )
);
