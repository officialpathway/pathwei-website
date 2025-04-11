import React from 'react';
import './OrbitalLines.css';

const OrbitalLines = () => {
  return (
    <div className="orbital-container">
      {/* Horizontal orbit */}
      <div 
        className="orbit horizontal" 
        style={{
          width: '200px',
          height: '200px'
        }}
      />
      
      {/* Vertical orbit */}
      <div 
        className="orbit vertical" 
        style={{
          width: '300px',
          height: '300px'
        }}
      />
      
      {/* Diagonal orbit */}
      <div 
        className="orbit diagonal" 
        style={{
          width: '250px',
          height: '250px'
        }}
      />
    </div>
  );
};

export default OrbitalLines;