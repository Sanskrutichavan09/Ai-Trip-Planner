/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react"; // Ensure React is imported
import { Link } from "react-router-dom"; // Assuming you're using react-router-dom

// Assuming you have a function like GetPlaceDetails defined elsewhere
import { GetPlaceDetails } from "../../service/GlobalApi"; // Replace with your actual import path
import Hotelimg from "../components/hotel.json"; // Import local images

const PHOTO_REF_URL = "https://photo-api-url.com/{NAME}"; // Replace with your actual API URL

// Tracker to manage used images
let usedImages = [];

function getRandomUniqueImage() {
  const images = Hotelimg.places || []; // Ensure 'places' exists
  const availableImages = images.filter((img) => !usedImages.includes(img));

  // If all images are used, reset the pool
  if (availableImages.length === 0) {
    usedImages = [];
    return getRandomUniqueImage();
  }

  // Select a random image from available images
  const selectedImage =
    availableImages[Math.floor(Math.random() * availableImages.length)];
  usedImages.push(selectedImage);
  return selectedImage;
}

const UserTripCard = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState(""); // Default image will be set if no photo found

  useEffect(() => {
    if (trip && trip.userSelection && trip.userSelection.location) {
      fetchPlaceImage(); // Fetch image only when trip data is available
    }
  }, [trip]);

  const fetchPlaceImage = async () => {
    try {
      const data = { textQuery: trip?.userSelection?.location?.label || "" };
      const result = await GetPlaceDetails(data); // API call to fetch place details

      // Check if the result contains photo data
      const photoName = result?.data?.places?.[0]?.photos?.[3]?.name;
      if (photoName) {
        const photoUrl = PHOTO_REF_URL.replace("{NAME}", photoName); // Constructing photo URL
        setPhotoUrl(photoUrl); // Setting photo URL to the state
      } else {
        // If no photo from API, use random local image
        setPhotoUrl(getRandomUniqueImage());
      }
    } catch (error) {
      console.error("Error fetching place image:", error);
      // If error, use random local image
      setPhotoUrl(getRandomUniqueImage());
    }
  };

  // Inline styles for components
  const cardContainerStyle = {
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
  };

  const imageStyle = {
    borderRadius: '1rem',
    height: '200px',
    width: '100%',
    objectFit: 'cover',
  };

  const textContainerStyle = {
    padding: '1rem',
  };

  const titleStyle = {
    fontWeight: '500',
    fontSize: '1.125rem',
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: '#4B5563', // Gray color
  };

  const buttonStyle = {
    backgroundColor: '#3B82F6', // Blue color
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '1rem',
    ':hover': {
      backgroundColor: '#2563EB', // Darker blue for hover
    },
  };

  return (
    <Link to={"/view-trip/" + trip?.id}>
      <div style={cardContainerStyle}>
        {/* Display the trip image */}
        <img
          src={photoUrl || getRandomUniqueImage()}
          style={imageStyle}
          alt={trip?.userSelection?.location?.label || "Trip Location"}
        />

        {/* Display Trip details */}
        <div style={textContainerStyle}>
          <h2 style={titleStyle}>
            {trip?.userSelection?.location?.label || "Unknown Location"}
          </h2>
          <h2 style={subtitleStyle}>
            {trip?.userSelection?.days
              ? `${trip?.userSelection?.days} Days trip`
              : "Duration not specified"}{" "}
            {trip?.userSelection?.budget
              ? `with a budget of ${trip?.userSelection?.budget}`
              : ""}
          </h2>
          <div>
            {/* Button to navigate to the trip details page */}
            <Link to={`/view-trip/${trip?.id}`} style={buttonStyle}>
              View Details
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserTripCard;
