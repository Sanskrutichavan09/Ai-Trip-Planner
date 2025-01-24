/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function TripPlace({ trip }) {
  const containerStyle = {
    marginTop: '1rem', // Spacing at the top
    padding: '1rem', // Add padding for mobile screens
    boxSizing: 'border-box',
  };

  const headingStyle = {
    fontWeight: 'bold',
    fontSize: '1.25rem', // Equivalent to text-xl
    textAlign: 'center',
  };

  const subHeadingStyle = {
    fontWeight: '500',
    fontSize: '1.125rem', // Equivalent to text-l
    marginBottom: '0.5rem', // Add spacing between day heading and cards
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Responsive grid with flexible columns
    gap: '1rem', // Spacing between cards
  };

  const cardStyle = {
    border: '1px solid #e5e7eb', // Light border for separation
    borderRadius: '8px', // Rounded corners for cards
    padding: '1rem', // Add padding inside cards
    backgroundColor: '#ffffff', // White background
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    textAlign: 'center', // Center-align text
    overflow: 'hidden', // Prevent overflow of content
  };

  const noItineraryStyle = {
    fontStyle: 'italic',
    color: '#6B7280', // Equivalent to text-gray-500
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Places to Visit</h2>
      <div>
        {/* Check if itinerary is an array before mapping */}
        {Array.isArray(trip?.tripData?.itinerary) && trip?.tripData?.itinerary.length > 0 ? (
          trip.tripData.itinerary.map((item, i) => (
            <div key={i}>
              <h2 style={subHeadingStyle}>Day {item?.days}</h2>
              <div style={gridStyle}>
                {Array.isArray(item.plan) &&
                  item.plan.map((place, index) => (
                    <div style={cardStyle} key={index}>
                      <PlaceCardItem place={place} />
                    </div>
                  ))}
              </div>
            </div>
          ))
        ) : (
          <p style={noItineraryStyle}>No itinerary available</p> // Fallback message when itinerary is not an array
        )}
      </div>
    </div>
  );
}

export default TripPlace;
