export default function TestButton() {
  console.log('TestButton rendered!');
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: '100px',
        right: '20px',
        zIndex: 9999,
        backgroundColor: 'red',
        color: 'white',
        padding: '15px',
        borderRadius: '50px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        border: '3px solid yellow',
        boxShadow: '0 0 20px rgba(255,0,0,0.8)'
      }}
      onClick={() => alert('Test button works!')}
    >
      🎬 TEST DONATE 🎬
    </div>
  );
}
