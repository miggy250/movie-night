import { useState } from 'react';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import AppRouter from './components/layout/AppRouter';
import SEOHead from './components/seo/SEOHead';
import DonationModal from './components/payments/DonationModal';
import Footer from './components/layout/Footer';

export default function App() {
  console.log('App component rendering!');
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  
  return (
    <>
      <SEOHead />
      {/* Donation Button - Direct Implementation */}
      <div 
        style={{
          position: 'fixed',
          top: '100px',
          right: '30px',
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '25px',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          border: '2px solid #b91c1c',
          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)',
          zIndex: 100,
          fontFamily: 'Arial, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.3s ease'
        }}
        onClick={() => setIsDonationModalOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#b91c1c';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#dc2626';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ❤️ Donate
      </div>
      
      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
      
      <UserPreferencesProvider>
        <div className="min-h-screen flex flex-col">
          <AppRouter />
          <Footer />
        </div>
      </UserPreferencesProvider>
    </>
  );
}
