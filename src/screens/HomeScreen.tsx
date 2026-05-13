import { useTicketStore } from '../store/useTicketStore';
import TicketBox from '../components/TicketBox';
import TicketDetailModal from '../components/TicketDetailModal';
import TicketForm from '../components/TicketForm';
import { useState, useMemo } from 'react';

export default function HomeScreen() {
  const { tickets } = useTicketStore();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const stats = useMemo(() => {
    const values = Object.values(tickets);
    const sold = values.filter(t => t.status === 'vendido').length;
    const pending = values.filter(t => t.status === 'pendiente').length;
    const available = values.filter(t => t.status === 'disponible').length;
    const total = values.length;
    
    // Asumiendo que cada boleta vale 10,000 (como en la imagen de ejemplo)
    // El usuario no lo especificó pero "Dinero recaudado" lo necesita.
    const recaudado = sold * 10000;

    return { sold, pending, available, total, recaudado };
  }, [tickets]);

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>{stats.sold + stats.pending} / {stats.total}</div>
          <div className="stat-label">Vendidas / Reservadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.available}</div>
          <div className="stat-label">Disponibles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-color)' }}>
            {((stats.sold + stats.pending) / stats.total * 100).toFixed(0)}%
          </div>
          <div className="stat-label">Progreso</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            ${stats.recaudado.toLocaleString('es-CO')}
          </div>
          <div className="stat-label">Recaudado</div>
        </div>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <h3 style={{ textAlign: 'center', color: 'var(--text-primary)', marginBottom: '8px' }}>TABLERO DE NÚMEROS</h3>
        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pulsa un número para ver o editar</p>
        <div className="ticket-grid">
          {Object.values(tickets)
            .sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10))
            .map(ticket => (
            <TicketBox 
              key={ticket.number} 
              ticket={ticket} 
              onClick={(t) => setSelectedTicket(t.number)}
            />
          ))}
        </div>
      </div>

      <div style={{ paddingBottom: '20px' }}></div>

      {selectedTicket && (
        <TicketDetailModal 
          ticketNumber={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}

      <TicketForm />
    </>
  );
}
