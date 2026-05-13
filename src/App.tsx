import { useState, useEffect } from 'react';
import { useTicketStore } from './store/useTicketStore';
import HomeScreen from './screens/HomeScreen';
import SoldTicketsScreen from './screens/SoldTicketsScreen';
import AvailableTicketsScreen from './screens/AvailableTicketsScreen';
import { Home, ListChecks, Ticket as TicketIcon } from 'lucide-react';
import { supabase } from './services/supabase';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'sold' | 'available'>('home');
  const { fetchFromSupabase } = useTicketStore();

  useEffect(() => {
    // Test de conexión: verifica que Supabase responde
    async function testSupabaseConnection() {
      if (!supabase) {
        console.error('❌ Supabase no está configurado. Revisa las variables de entorno.');
        return;
      }
      const { data, error } = await supabase.from('tickets').select('*').limit(1);
      if (error) {
        console.error('❌ Error conectando a Supabase:', error.message);
      } else {
        console.log('✅ Supabase conectado correctamente. Datos:', data);
      }
    }

    testSupabaseConnection();
    fetchFromSupabase();
  }, [fetchFromSupabase]);

  return (
    <div className="app-container">
      <header className="header-neon">
        <h1>¡Gran Rifa!</h1>
        <p className="header-subtitle">Panel Administrativo</p>
      </header>

      <div className="tabs">
        <div
          className={`tab ${currentTab === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentTab('home')}
        >
          <Home size={16} className="inline-block mr-1" />
          General
        </div>
        <div
          className={`tab ${currentTab === 'available' ? 'active' : ''}`}
          onClick={() => setCurrentTab('available')}
        >
          <TicketIcon size={16} className="inline-block mr-1" />
          Disponibles
        </div>
        <div
          className={`tab ${currentTab === 'sold' ? 'active' : ''}`}
          onClick={() => setCurrentTab('sold')}
        >
          <ListChecks size={16} className="inline-block mr-1" />
          Vendidas
        </div>
      </div>

      <main style={{ padding: '0 16px', flex: 1 }}>
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'sold' && <SoldTicketsScreen />}
        {currentTab === 'available' && <AvailableTicketsScreen />}
      </main>
    </div>
  );
}
