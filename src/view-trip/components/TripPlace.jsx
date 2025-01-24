/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function TripPlace({ trip }) {
  const containerStyle = {
    marginTop: '1rem', // Equivalent to my-4
  };

  const headingStyle = {
    fontWeight: 'bold',
    fontSize: '1.25rem', // Equivalent to text-xl
    textAlign: 'center',
  };

  const subHeadingStyle = {
    fontWeight: '500',
    fontSize: '1.125rem', // Equivalent to text-l
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Equivalent to md:grid-cols-2
    gap: '1rem', // Equivalent to gap-4
  };

  const noItineraryStyle = {
    fontStyle: 'italic',
    color: '#6B7280', // Equivalent to text-gray-500
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
                {Array.isArray(item.plan) && item.plan.map((place, index) => (
                  <PlaceCardItem place={place} key={index} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p style={noItineraryStyle}>No itinerary available</p>  // Fallback message when itinerary is not an array
        )}
      </div>
    </div>
  );
}

export default TripPlace;
