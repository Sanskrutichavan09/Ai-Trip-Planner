/* eslint-disable no-unused-vars */
// src/service/GlobalApi.js
import axios from "axios";

const BASE_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
const PHOTO_REF_URL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={PHOTO_REFERENCE}&key=VITE_GOOGLE_PHOTO_API_KEY";

const config = {
  headers: {
    'Content-Type': 'application/json',
  }
};

// Function to fetch location details including photos
export const GetLocationImages = async (location) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        location: location.lat + "," + location.lng,  // Latitude, Longitude
        radius: 5000,  // Radius in meters
        key: "VITE_GOOGLE_PHOTO_API_KEY",
      }
    });

    if (response.data.results.length > 0) {
      const placeId = response.data.results[0].place_id;
      return getPlacePhoto(placeId); // Get photos for the first location
    }
  } catch (error) {
    console.error("Error fetching location images:", error);
    return null;
  }
};

// Function to fetch photos using the place ID
export const getPlacePhoto = async (placeId) => {
  try {
    const photoResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        placeid: placeId,
        key: "VITE_GOOGLE_PHOTO_API_KEY",
      }
    });

    const photoReference = photoResponse.data.result.photos?.[0]?.photo_reference;
    if (photoReference) {
      return PHOTO_REF_URL.replace("{PHOTO_REFERENCE}", photoReference);
    }
  } catch (error) {
    console.error("Error fetching photos:", error);
    return null;
  }
};
// Adding GetPlaceDetails function to your existing code

const GET_PLACE_DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

// Function to fetch place details including photos
export const GetPlaceDetails = async (data) => {
  try {
    const response = await axios.get(GET_PLACE_DETAILS_URL, {
      params: {
        placeid: data.placeId,  // Assuming you're passing placeId in the data
        key: "VITE_GOOGLE_PHOTO_API_KEY",
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
};


// Exporting the PHOTO_REF_URL
export { PHOTO_REF_URL };
