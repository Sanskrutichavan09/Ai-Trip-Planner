/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hotelimg from '../components/Hotelimg.json'; // Import JSON file
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi'; // Import API

let usedImages = []; // To track used images

function getRandomUniqueImage() {
  const images = Hotelimg.images;
  
  // Filter out images that have already been used
  const availableImages = images.filter((img) => !usedImages.includes(img));
  
  // If all images have been used, reset the tracker
  if (availableImages.length === 0) {
    usedImages = [];
    return getRandomUniqueImage();
  }
  
  // Select a random image from the available pool
  const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
  
  // Add the selected image to the used tracker
  usedImages.push(selectedImage);
  
  return selectedImage;
}

function HotelCardItem({ item }) {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (item) {
      GetPlaceImg(); // Fetch place details
    }
  }, [item]);

  const GetPlaceImg = async () => {
    const data = {
      textQuery: item?.hotelName,
    };

    try {
      const result = await GetPlaceDetails(data);
      if (result?.data?.places[0]?.photos?.[3]?.name) {
        const fetchedPhotoUrl = PHOTO_REF_URL.replace(
          '{NAME}',
          result.data.places[0].photos[3].name
        );
        setPhotoUrl(fetchedPhotoUrl);
      } else {
        // If no photo from API, use random unique image
        setPhotoUrl(getRandomUniqueImage());
      }
    } catch (error) {
      // On error, use random unique image
      setPhotoUrl(getRandomUniqueImage());
    }
  };

  const cardStyle = {
    transition: 'all 0.3s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column', // Column layout for image on top and text below
    gap: '1rem', // Space between image and text
    border: '1px solid #e5e7eb', // Light border for separation
    borderRadius: '12px', // Rounded corners
    padding: '1rem', // Padding around content
    backgroundColor: '#ffffff', // White background for the card
    boxSizing: 'border-box', // Ensure padding is included in width/height calculation
    margin: '0 5px', // Reduced horizontal space between cards
  };

  const imgStyle = {
    borderRadius: '12px', // Rounded corners for image
    height: '200px', // Height for better visuals
    width: '100%', // Full width of the card
    objectFit: 'cover', // Image cover style to avoid distortion
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column', // Align text elements vertically
    justifyContent: 'flex-start', // Align text from top
    gap: '0.5rem', // Space between text elements
  };

  const titleStyle = {
    fontSize: '1.125rem', // Title font size
    fontWeight: '600', // Semi-bold font weight
    margin: 0,
  };

  const addressStyle = {
    fontSize: '0.875rem', // Address font size
    color: '#6b7280', // Text color for address
    margin: 0,
  };

  const priceStyle = {
    fontSize: '1rem', // Price font size
    fontWeight: '500', // Medium font weight
    color: '#10B981', // Green color for price
  };

  const ratingStyle = {
    fontSize: '0.875rem', // Rating font size
    color: '#F59E0B', // Yellow color for rating
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'nowrap', // Keep cards in a single row, no wrapping
        gap: '5px', // Small gap between cards
        padding: '10px', // Padding to create some space around the row
        overflowX: 'auto', // Allow horizontal scrolling if necessary (for small screens)
      }}
    >
      <Link
        to={ 
          'https://www.google.com/maps/search/?api=1&query=' + 
          item?.hotelName + 
          ',' + 
          item?.hotelAddress
        }
        target="_blank"
      >
        <div style={cardStyle}>
          <img
            src={photoUrl || getRandomUniqueImage()} // Fetched or random image
            style={imgStyle}
            alt={item?.hotelName}
          />
          <div style={containerStyle}>
            <h2 style={titleStyle}>{item?.hotelName}</h2>
            <h2 style={addressStyle}>📍{item?.hotelAddress}</h2>
            <h2 style={priceStyle}>💰{item?.price}</h2>
            <h2 style={ratingStyle}>⭐{item?.rating}</h2>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;

