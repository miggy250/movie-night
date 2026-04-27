import React from 'react';

export default function InlineDonateButton() {
  React.useEffect(() => {
    console.log('InlineDonateButton mounted!');
  }, []);

  return React.createElement('div', {
    style: {
      position: 'fixed',
      top: '150px',
      right: '30px',
      zIndex: 99999,
      backgroundColor: '#dc2626',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: '2px solid #b91c1c',
      boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    onClick: () => alert('Donate button clicked!'),
    onMouseEnter: (e) => {
      e.currentTarget.style.backgroundColor = '#b91c1c';
      e.currentTarget.style.transform = 'scale(1.05)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.backgroundColor = '#dc2626';
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, '❤️ DONATE');
}
