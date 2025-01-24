/* eslint-disable no-unused-vars */
import React from 'react';

function Footer() {
  const footerStyle = {
    marginTop: '1.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const textStyle = {
    color: '#9ca3af', // Equivalent to Tailwind's 'text-gray-400'
  };

  return (
    <div style={footerStyle}>
      <h2 style={textStyle}>Created by Sanskruti Chavan</h2>
    </div>
  );
}

export default Footer;
