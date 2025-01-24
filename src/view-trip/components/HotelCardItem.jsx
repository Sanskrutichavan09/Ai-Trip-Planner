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
  const selectedImage =
    availableImages[Math.floor(Math.random() * availableImages.length)];

  // Add the selected image to the used tracker
  usedImages.push(selectedImage);

  return selectedImage;
}

function HotelCardItem({ item }) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [style, setStyle] = useState({}); // State to manage styles based on screen size

  useEffect(() => {
    // Function to handle style changes based on window width
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 200) {
        setStyle({
          cardWidth: '90%',
          imgHeight: '100px',
          fontSizeTitle: '0.9rem',
          fontSizeAddress: '0.75rem',
          fontSizePrice: '0.75rem',
          fontSizeRating: '0.7rem',
          gap: '5px',
          padding: '0.4rem',
        });
      } else if (width <= 400) {
        setStyle({
          cardWidth: '92%',
          imgHeight: '140px',
          fontSizeTitle: '1rem',
          fontSizeAddress: '0.85rem',
          fontSizePrice: '0.85rem',
          fontSizeRating: '0.8rem',
          gap: '8px',
          padding: '0.6rem',
        });
      } else if (width <= 700) {
        setStyle({
          cardWidth: '95%',
          imgHeight: '180px',
          fontSizeTitle: '1.2rem',
          fontSizeAddress: '1rem',
          fontSizePrice: '1rem',
          fontSizeRating: '0.9rem',
          gap: '10px',
          padding: '0.8rem',
        });
      } else {
        setStyle({
          cardWidth: '300px',
          imgHeight: '200px',
          fontSizeTitle: '1.5rem',
          fontSizeAddress: '1.2rem',
          fontSizePrice: '1.1rem',
          fontSizeRating: '1rem',
          gap: '15px',
          padding: '1rem',
        });
      }
    };

    // Add event listener and invoke once initially
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
    display: 'flex',
    flexDirection: 'column', // Column layout for image on top and text below
    gap: style.gap, // Space between image and text
    border: '1px solid #e5e7eb', // Light border for separation
    borderRadius: '10px', // Rounded corners
    padding: style.padding, // Padding around content
    backgroundColor: '#ffffff', // White background for the card
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    margin: '10px auto', // Center the card horizontally
    width: style.cardWidth, // Dynamic width
    boxSizing: 'border-box',
    transition: 'transform 0.2s ease-in-out',
    cursor: 'pointer',
  };

  const imgStyle = {
    borderRadius: '8px', // Rounded corners for image
    height: style.imgHeight, // Dynamic height
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
    fontSize: style.fontSizeTitle, // Dynamic font size for title
    fontWeight: '600', // Semi-bold font weight
    margin: 0,
  };

  const addressStyle = {
    fontSize: style.fontSizeAddress, // Dynamic font size for address
    color: '#6b7280', // Text color for address
    margin: 0,
  };

  const priceStyle = {
    fontSize: style.fontSizePrice, // Dynamic font size for price
    fontWeight: '500', // Medium font weight
    color: '#10B981', // Green color for price
  };

  const ratingStyle = {
    fontSize: style.fontSizeRating, // Dynamic font size for rating
    color: '#F59E0B', // Yellow color for rating
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column', // Stack cards vertically
        gap: '10px', // Space between cards
        padding: '10px',
        alignItems: 'center', // Center cards in mobile view
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
