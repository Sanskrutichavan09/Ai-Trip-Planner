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
        marginTop: '1rem', // Equivalent to my-4
        backgroundColor: '#F9FAFB', // Equivalent to bg-gray-50
        padding: '0.5rem', // Equivalent to p-2
        display: 'flex',
        gap: '0.5rem', // Equivalent to gap-2
        borderRadius: '0.5rem', // Equivalent to rounded-lg
        cursor: 'pointer',
        transition: 'all 0.3s',
    };

    const containerHoverStyle = {
        transform: 'scale(1.05)', // Equivalent to hover:scale-105
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Equivalent to hover:shadow-md
    };

    const imageStyle = {
        width: '250px',
        height: '150px',
        borderRadius: '0.75rem', // Equivalent to rounded-xl
        objectFit: 'cover',
    };

    const textStyle = {
        fontSize: '0.875rem', // Equivalent to text-sm
        color: '#4B5563', // Equivalent to text-gray-500
    };

    const orangeTextStyle = {
        color: '#FB923C', // Equivalent to text-orange-600
        fontWeight: '500',
    };

    const blueTextStyle = {
        color: '#2563EB', // Equivalent to text-blue-700
        fontSize: '0.875rem',
    };

    const yellowTextStyle = {
        color: '#F59E0B', // Equivalent to text-yellow-500
        fontSize: '0.875rem',
    };

    return (
        <div>
            <Link
                to={`https://www.google.com/maps/search/?api=1&query=${place?.placeName},${place?.geoCoordinates}`}
                target="_blank"
            >
                <div style={containerStyle} onMouseOver={() => (containerStyle = { ...containerStyle, ...containerHoverStyle })} onMouseOut={() => (containerStyle = { ...containerStyle, ...containerHoverStyle })}>
                    <div style={{ paddingTop: '0.5rem', marginLeft: '0.75rem' }}>
                        <img
                            src={photoUrl || getRandomUniqueImage()} // Use fetched image or unique random image
                            style={imageStyle}
                            alt={place.placeName || 'Place'}
                        />
                    </div>
                    <div>
                        <h2 style={orangeTextStyle}>{place.time}</h2>
                        <h2 style={{ fontWeight: 'bold' }}>{place.placeName}</h2>
                        <p style={textStyle}>{place.placeDetails}</p>
                        <h2 style={blueTextStyle}>{place.ticketPricing}</h2>
                        <h2 style={yellowTextStyle}>⭐{place.rating}</h2>
                    </div>
                    <div style={{ marginTop: '9rem' }}>
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
