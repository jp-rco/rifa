import { useState, useEffect } from 'react';
import { useTicketStore } from '../store/useTicketStore';
import { PaymentMethod } from '../types';

export default function TicketForm({ initialNumber = '' }: { initialNumber?: string }) {
  const { registerSale, tickets } = useTicketStore();
  const [number, setNumber] = useState(initialNumber);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    setNumber(initialNumber);
  }, [initialNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number || parseInt(number) < 0 || parseInt(number) > 99) return alert('Número inválido');
    
    const formattedNum = number.padStart(2, '0');
    if (tickets[formattedNum]?.status !== 'disponible') {
      return alert('Este número ya no está disponible');
    }

    registerSale(formattedNum, { name, phone, paymentMethod, paid });
    
    // Reset form
    setNumber('');
    setName('');
    setPhone('');
    setPaymentMethod('');
    setPaid(false);
  };

  return (
    <div className="bottom-panel">
      <div className="bottom-panel-inner">
        <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--primary-color)' }}>Registro Rápido</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              className="input" 
              placeholder="# (00-99)" 
              value={number}
              onChange={e => setNumber(e.target.value)}
              style={{ flex: '0 0 80px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
              maxLength={2}
              required
            />
            <input 
              className="input" 
              placeholder="Nombre del comprador" 
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ flex: 1 }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              className="input" 
              placeholder="Teléfono" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{ flex: 1 }}
            />
            <select 
              className="select" 
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              style={{ flex: 1 }}
            >
              <option value="">Método de Pago</option>
              <option value="Nequi">Nequi</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transf.</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', color: paid ? 'var(--primary-color)' : 'var(--text-muted)' }}>¿Ya pagó?</span>
              <label className="switch">
                <input type="checkbox" checked={paid} onChange={e => setPaid(e.target.checked)} />
                <span className="slider"></span>
              </label>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Registrar Boleta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
