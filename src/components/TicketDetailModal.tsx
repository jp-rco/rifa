import { useState } from 'react';
import { PaymentMethod } from '../types';
import { useTicketStore } from '../store/useTicketStore';
import { X, Trash2, Check, Save } from 'lucide-react';

interface Props {
  ticketNumber: string;
  onClose: () => void;
}

export default function TicketDetailModal({ ticketNumber, onClose }: Props) {
  const { tickets, registerSale, clearTicket } = useTicketStore();
  const ticket = tickets[ticketNumber];

  const [name, setName] = useState(ticket?.name || '');
  const [phone, setPhone] = useState(ticket?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>(ticket?.paymentMethod || '');
  const [paid, setPaid] = useState(ticket?.paid || false);
  const [saving, setSaving] = useState(false);

  if (!ticket) return null;

  const handleSave = async () => {
    setSaving(true);
    await registerSale(ticketNumber, {
      name,
      phone,
      paymentMethod,
      paid,
      status: paid ? 'vendido' : (name.trim() ? 'pendiente' : 'disponible'),
    });
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este registro? El número quedará disponible nuevamente.')) {
      await clearTicket(ticketNumber);
      onClose();
    }
  };

  const markAsPaid = async () => {
    setSaving(true);
    await registerSale(ticketNumber, {
      name,
      phone,
      paymentMethod,
      paid: true,
      status: 'vendido',
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          <X size={24} />
        </button>

        <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', color: 'var(--primary-color)' }}>
          Boleta #{ticketNumber}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Nombre del comprador</label>
            <input
              className="input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Teléfono</label>
            <input
              className="input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Número celular"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Método de pago</label>
            <select
              className="select"
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="">Selecciona método</option>
              <option value="Nequi">Nequi</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ fontWeight: 600 }}>
              Estado de pago:{' '}
              {paid
                ? <span style={{ color: 'var(--primary-color)' }}>Pagado</span>
                : <span style={{ color: 'var(--accent-color)' }}>Pendiente</span>
              }
            </span>
            <label className="switch">
              <input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>

          {ticket.purchaseDate && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Fecha: {new Date(ticket.purchaseDate).toLocaleString()}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {!paid && (
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={markAsPaid} disabled={saving}>
                <Check size={18} />
                Marcar Pagado
              </button>
            )}
            <button className="btn" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
              <Save size={18} />
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

          {ticket.status !== 'disponible' && (
            <button
              className="btn"
              style={{ width: '100%', borderColor: '#ff4444', color: '#ff4444' }}
              onClick={handleDelete}
              disabled={saving}
            >
              <Trash2 size={18} />
              Eliminar Venta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
