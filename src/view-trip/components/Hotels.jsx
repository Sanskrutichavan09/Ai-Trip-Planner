/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import HotelCardItem from './HotelCardItem';

function Hotels({ trip }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const containerStyle = {
    marginBottom: '2rem', // Equivalent to my-7
  };

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '1.25rem', // Equivalent to text-xl
    marginBottom: '1.75rem', // Equivalent to my-7
    textAlign: 'center',
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns by default
    gap: '1.5rem', // Equivalent to gap-6
  };

  const gridContainerMdStyle = {
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for medium screens
  };

  const gridContainerXlStyle = {
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 columns for extra large screens
  };

  // Adjust grid based on screen size
  const gridStyle = screenWidth >= 1280
    ? gridContainerXlStyle
    : screenWidth >= 768
    ? gridContainerMdStyle
    : gridContainerStyle;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Hotel Recommendation</h2>
      <div style={{ ...gridContainerStyle, ...gridStyle }}>
        {trip?.tripData?.hotelOptions?.map((item, index) => (
          <HotelCardItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
