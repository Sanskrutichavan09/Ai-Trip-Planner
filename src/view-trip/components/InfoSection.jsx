/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { fetchDataFromFirebase } from '../../service/firebaseConfig'; // Adjust path
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi'; // Adjust path
import Hotelimg from '../components/Hotelimg.json'; // Import JSON file

function getRandomImage() {
  // Get a random image from the array in the JSON file
  const city = Hotelimg.city;
  return city[Math.floor(Math.random() * city.length)];
}

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [userSelection, setUserSelection] = useState({});

  useEffect(() => {
    if (trip?.id) {
      fetchDataFromFirebase(trip.id)
        .then((data) => {
          console.log("Fetched data:", data); // Log entire fetched data
          if (data) {
            const selection = data.userSelection;
            if (selection) {
              setUserSelection(selection); // Set userSelection state
              console.log("User Selection:", selection); // Log userSelection
            } else {
              console.log('No userSelection in the data');
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [trip?.id]);

  useEffect(() => {
    GetPlaceImg();
  }, [userSelection]);

  const GetPlaceImg = async () => {
    if (!userSelection?.location?.label) {
      setPhotoUrl(getRandomImage());
      return;
    }
    
    const data = {
      textQuery: userSelection.location.label, // Using label for location name
    };

    try {
      const result = await GetPlaceDetails(data);
      if (result?.data?.places?.[0]?.photos?.[3]?.name) {
        const fetchedPhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          result.data.places[0].photos[3].name
        );
        setPhotoUrl(fetchedPhotoUrl);
      } else {
        setPhotoUrl(getRandomImage());
      }
    } catch (error) {
      console.error('Error fetching place image:', error);
      setPhotoUrl(getRandomImage());
    }
  };

  // Styles for image and content
  const imageStyle = {
    height: '330px',
    width: '80%',          // Set the width to 60% of the container
    objectFit: 'cover',    // Ensure the image covers the area without distortion
    borderRadius: '12px',  // Apply rounded corners
    margin: '0 auto',      // Center the image horizontally
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',  // Center the image horizontally
    alignItems: 'center',      // Center the image vertically (if the container has height)
    flexDirection: 'column',   // Allow content below to stack vertically
    paddingTop: '4rem',        // Added small gap at the top
    paddingBottom: '3rem',     // Added small gap at the bottom
  };

  const infoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Equivalent to gap-2
    textAlign: 'center',  // To center the text content
    marginBottom: '1rem',  // Added small gap at the bottom
  };

  const titleStyle = {
    fontSize: '1.5rem', // font-bold text-2xl
    fontWeight: 'bold',
  };

  const badgeStyle = {
    backgroundColor: '#E5E7EB', // Equivalent to bg-gray-200
    fontWeight: '500',
    color: '#4B5563', // Equivalent to text-gray-600
    borderRadius: '9999px', // Fully rounded
    padding: '0.25rem 1rem', // Equivalent to p-1 px-4
    fontSize: '1rem', // Equivalent to md:text-md
  };
  

  return (
    <div style={containerStyle}>
      <img
        src={trip?.hotelImageUrl || photoUrl || '/public/enjoytrip.jpg'}
        style={imageStyle}
        alt={trip?.userSelection?.location?.label || 'Trip Location'}
      />
      <div style={infoContainerStyle}>
        <h2 style={titleStyle}>
          {trip?.userSelection?.location?.label}
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem' }}>
          <h2 style={badgeStyle}>
            🗓️ {trip?.userSelection?.days || '2'} Day
          </h2>
          <h2 style={badgeStyle}>
            👩‍👧‍👦 Number of Travelers: {trip?.userSelection?.traveler || '2'}
          </h2>
          <h2 style={badgeStyle}>
            💵 Budget: {trip?.userSelection?.budget || 'medium'}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
