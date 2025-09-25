const LaunchInfo = () => {
  return (
    <>
      <style jsx>{`
        #launch-info {
          background: url('/images/hero-background.jpg') !important;
          background-size: cover !important;
          background-position: center !important;
          background-repeat: no-repeat !important;
        }
      `}</style>
      <section id="launch-info" className="py-20 text-white relative">
      {/* Finom overlay a szöveg olvashatóságához */}
      <div className="absolute inset-0 bg-black/2"></div>
      
      <div className="container mx-auto px-6 text-center max-w-6xl relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Launch Information - TESZT</h2>
        <p className="text-lg text-yellow-400 mb-12">Get ready for the ultimate bull run - TESZT SZÖVEG</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
            <h3 className="text-yellow-400 text-2xl font-bold mb-4">Token Details</h3>
            <ul className="space-y-3 text-left">
              <li><span className="text-yellow-400">•</span> Fair launch on Pump.fun</li>
              <li><span className="text-yellow-400">•</span> No presale, no dev tokens</li>
              <li><span className="text-yellow-400">•</span> Community-driven project</li>
              <li><span className="text-yellow-400">•</span> Transparent development</li>
            </ul>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
            <h3 className="text-yellow-400 text-2xl font-bold mb-4">How to Buy</h3>
            <ul className="space-y-3 text-left">
              <li><span className="text-yellow-400">•</span> Connect your Solana wallet</li>
              <li><span className="text-yellow-400">•</span> Visit Pump.fun</li>
              <li><span className="text-yellow-400">•</span> Swap SOL for $ASSBULL</li>
              <li><span className="text-yellow-400">•</span> Hold and enjoy the ride</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default LaunchInfo; 