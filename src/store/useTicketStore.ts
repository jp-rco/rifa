import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Ticket, TicketStatus, PaymentMethod } from '../types';
import { db } from '../services/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';

interface TicketStore {
  tickets: Record<string, Ticket>;
  initializeTickets: () => void;
  fetchFromFirebase: () => Promise<void>;
  updateTicket: (number: string, data: Partial<Ticket>) => void;
  registerSale: (
    number: string,
    data: {
      name: string;
      phone: string;
      paymentMethod: PaymentMethod | '';
      paid: boolean;
      status?: TicketStatus;
    }
  ) => void;
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

const ticketsCol = collection(db, 'tickets');

export const useTicketStore = create<TicketStore>()(
  persist(
    (set, get) => ({
      tickets: generateInitialTickets(),

      initializeTickets: () => set({ tickets: generateInitialTickets() }),

      fetchFromFirebase: async () => {
        try {
          const snapshot = await getDocs(ticketsCol);
          if (!snapshot.empty) {
            const remoteTickets: Record<string, Ticket> = { ...get().tickets };
            snapshot.forEach((docSnap) => {
              const t = docSnap.data() as Ticket;
              remoteTickets[t.number] = t;
            });
            set({ tickets: remoteTickets });
          }
        } catch (error) {
          console.error('❌ Error fetching from Firebase:', error);
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
          await setDoc(doc(db, 'tickets', number), updated);
        } catch (e) {
          console.error('❌ Error syncing update to Firebase:', e);
        }
      },

      registerSale: async (number, data) => {
        const newStatus: TicketStatus =
          data.status || (data.paid ? 'vendido' : 'pendiente');
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
          await setDoc(doc(db, 'tickets', number), updated);
          console.log(`✅ Ticket ${number} guardado en Firebase`);
        } catch (e) {
          console.error('❌ Error syncing sale to Firebase:', e);
        }
      },

      clearTicket: async (number) => {
        const resetTicket: Ticket = {
          number,
          name: '',
          phone: '',
          paymentMethod: '' as PaymentMethod | '',
          paid: false,
          purchaseDate: '',
          status: 'disponible',
        };
        set((state) => ({
          tickets: {
            ...state.tickets,
            [number]: resetTicket,
          },
        }));
        try {
          await setDoc(doc(db, 'tickets', number), resetTicket);
          console.log(`✅ Ticket ${number} limpiado en Firebase`);
        } catch (e) {
          console.error('❌ Error syncing clear to Firebase:', e);
        }
      },
    }),
    {
      name: 'rifa-storage',
    }
  )
);
