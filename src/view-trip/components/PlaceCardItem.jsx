/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Button } from '../../components/ui/Button';
import { GetPlaceDetails, PHOTO_REF_URL } from '../../service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { FaLocationDot } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Hotelimg from '../components/Hotelimg.json'; // Import JSON file

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
    const selectedImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    usedImages.push(selectedImage);
    return selectedImage;
}

function PlaceCardItem({ place }) {
    const [photoUrl, setPhotoUrl] = useState(null); // Start with null for clarity

    useEffect(() => {
        if (place) {
            fetchPlaceImage();
        }
    }, [place]);

    const fetchPlaceImage = async () => {
        try {
            const data = { textQuery: place.placeName };
            const result = await GetPlaceDetails(data);

            // Check if API provides a valid image
            const photoName = result?.data?.places?.[0]?.photos?.[3]?.name;
            if (photoName) {
                const fetchedPhotoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
                setPhotoUrl(fetchedPhotoUrl);
            } else {
                setPhotoUrl(getRandomUniqueImage()); // Use unique random image
            }
        } catch (error) {
            console.error('Error fetching place image:', error);
            setPhotoUrl(getRandomUniqueImage()); // Use unique random image on error
        }
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column', // Stack items vertically for smaller screens
        gap: '0.5rem',
        backgroundColor: '#F9FAFB',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s',
        width: '100%', // Ensure it fits mobile screen width
        maxWidth: '350px', // Limit max width for better readability
        margin: '0 auto', // Center on the page
    };

    const imageStyle = {
        width: '100%', // Make image responsive
        height: '200px', // Fixed height for consistency
        borderRadius: '0.75rem',
        objectFit: 'cover',
    };

    const textContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', // Align text to the left
        gap: '0.25rem', // Add spacing between text items
    };

    const orangeTextStyle = {
        color: '#FB923C',
        fontWeight: '500',
        fontSize: '0.875rem',
    };

    const blueTextStyle = {
        color: '#2563EB',
        fontSize: '0.875rem',
    };

    const yellowTextStyle = {
        color: '#F59E0B',
        fontSize: '0.875rem',
    };

    return (
        <div style={{ margin: '1rem 0' }}>
            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName},${place?.geoCoordinates}`}
                target="_blank"
                style={{ textDecoration: 'none' }}
            >
                <div style={containerStyle}>
                    <img
                        src={photoUrl || getRandomUniqueImage()}
                        style={imageStyle}
                        alt={place.placeName || 'Place'}
                    />
                    <div style={textContainerStyle}>
                        <h2 style={orangeTextStyle}>{place.time}</h2>
                        <h2 style={{ fontWeight: 'bold', fontSize: '1rem' }}>{place.placeName}</h2>
                        <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>{place.placeDetails}</p>
                        <h2 style={blueTextStyle}>{place.ticketPricing}</h2>
                        <h2 style={yellowTextStyle}>⭐{place.rating}</h2>
                    </div>
                    <div style={{ alignSelf: 'flex-end' }}>
                        <Button>
                            <FaLocationDot />
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default PlaceCardItem;
