import React from 'react';

const PageWrapper = ({ children }) => (
  <div className="min-h-screen bg-gray-900 relative overflow-hidden" style={{
    background: 'url(/images/rockat_pump_bacground.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
    <div className="md:hidden absolute inset-0 bg-black/20 pointer-events-none z-[9998]"></div>
    <div className="relative z-[9999] w-full h-screen">
      {children}
    </div>
  </div>
);

export default PageWrapper;

