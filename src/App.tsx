import { useState, useEffect } from 'react';
import { useTicketStore } from './store/useTicketStore';
import HomeScreen from './screens/HomeScreen';
import SoldTicketsScreen from './screens/SoldTicketsScreen';
import AvailableTicketsScreen from './screens/AvailableTicketsScreen';
import { Home, ListChecks, Ticket as TicketIcon } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'sold' | 'available'>('home');
  const { fetchFromSupabase } = useTicketStore();

  useEffect(() => {
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
