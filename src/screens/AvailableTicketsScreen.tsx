import { useState } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import TicketForm from '../components/TicketForm';

export default function AvailableTicketsScreen() {
  const { tickets } = useTicketStore();
  const [selectedForSale, setSelectedForSale] = useState<string>('');

  const availableTickets = Object.values(tickets)
    .filter(t => t.status === 'disponible')
    .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  return (
    <>
      <div style={{ paddingBottom: '200px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-color)' }}>Boletas Disponibles ({availableTickets.length})</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
          {availableTickets.map(ticket => (
            <div 
              key={ticket.number} 
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: selectedForSale === ticket.number ? 'var(--primary-color)' : 'var(--status-disponible)',
                color: '#000',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: selectedForSale === ticket.number ? 'var(--glow-primary)' : 'var(--glow-white)',
                border: selectedForSale === ticket.number ? 'none' : '1px solid #ddd',
                transition: 'all 0.2s',
                transform: selectedForSale === ticket.number ? 'scale(1.05)' : 'scale(1)'
              }}
              onClick={() => setSelectedForSale(ticket.number)}
            >
              {ticket.number}
            </div>
          ))}
        </div>
      </div>

      {/* Siempre mostramos el TicketForm para que sea fácil registrar desde esta pantalla */}
      <TicketForm initialNumber={selectedForSale} />
    </>
  );
}
