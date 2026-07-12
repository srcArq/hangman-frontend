// src/LoadingBar.js
import React from 'react';

const Loader = () => {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-bar" aria-hidden="true">
        {/* Generate 10 segments to simulate the bar */}
        {Array.from({ length: 10 }).map((_, index) => (
          <span key={index} className="loading-segment"></span>
        ))}
      </div>
      <p className="loading-text">CARGANDO. . .</p>
    </div>
  );
};

export default Loader;
