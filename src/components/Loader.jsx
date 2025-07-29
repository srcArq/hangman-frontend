// src/LoadingBar.js
import React from 'react';

const Loader = () => {
  return (
    <div className="loading-container">
      <div className="loading-bar">
        {/* Generate 10 segments to simulate the bar */}
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="loading-segment"></div>
        ))}
      </div>
      <p className="loading-text">CARGANDO. . .</p>
    </div>
  );
};

export default Loader;