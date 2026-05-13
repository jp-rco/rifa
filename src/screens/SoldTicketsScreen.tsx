import { useState } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import TicketDetailModal from '../components/TicketDetailModal';

export default function SoldTicketsScreen() {
  const { tickets } = useTicketStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const soldTickets = Object.values(tickets)
    .filter(t => t.status === 'vendido' || t.status === 'pendiente')
    .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));

  return (
    <>
      <div style={{ paddingBottom: '100px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--primary-color)' }}>Boletas Vendidas</h2>
        
        {soldTickets.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>Aún no hay boletas vendidas o reservadas.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {soldTickets.map(ticket => (
              <div 
                key={ticket.number} 
                className="card" 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px' }}
                onClick={() => setSelectedTicket(ticket.number)}
              >
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>#{ticket.number}</div>
                  <div style={{ fontWeight: 600 }}>{ticket.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ticket.phone} • {ticket.paymentMethod}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '4px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold',
                    background: ticket.status === 'vendido' ? 'var(--primary-color)' : 'var(--accent-color)',
                    color: '#000'
                  }}>
                    {ticket.status === 'vendido' ? 'PAGADO' : 'PENDIENTE'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Editar ➔</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <TicketDetailModal 
          ticketNumber={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
}
