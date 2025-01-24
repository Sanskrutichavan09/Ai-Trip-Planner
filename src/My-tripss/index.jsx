/* eslint-disable no-unused-vars */
import { db } from '../service/firebaseConfig';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from "firebase/firestore";
import UserTripCard from './components/UserTripCard';

function MyTrips() {
    const navigate = useNavigate();
    const [userTrips, setUserTrips] = useState([]);

    useEffect(() => {
        GetUserTrips();
    }, []);

    const GetUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/');
            return;
        }
        try {
            const q = query(collection(db, 'AiTrip'), where('userEmail', '==', user?.email));
            const querySnapshot = await getDocs(q);
            const trips = querySnapshot.docs.map(doc => doc.data());
            setUserTrips(trips);
        } catch (error) {
            console.error('Error fetching user trips:', error);
            setUserTrips([]);
        }
    };

    // Inline styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: '1.25rem',  // 5px
        paddingRight: '1.25rem', // 5px
        marginTop: '3rem',       // 12px
    };

    const innerBoxStyle = {
        width: '80%',          // Adjust width to make the box larger
        maxWidth: '1200px',    // Limiting maximum width
        padding: '2rem',       // Space inside the box
        borderRadius: '1rem',  // Rounded corners for the box
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',  // Shadow effect
        backgroundColor: '#ffffff', // White background
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '1.875rem',   // 3xl
        marginBottom: '2.5rem', // 10px
        textAlign: 'center',    // Centered title
    };

    const gridContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns on small screens
        gap: '1.25rem',         // 5px
        marginTop: '0.75rem',   // 3px
    };

    const loaderCardStyle = {
        height: '12.5rem',      // 200px
        width: '100%',
        backgroundColor: '#E5E7EB',  // Slate color
        animation: 'pulse 1.5s infinite ease-in-out',
        borderRadius: '1rem',       // Rounded
    };

    // Mobile view styles
    const mobileStyles = {
        '@media (max-width: 700px)': {
            gridTemplateColumns: 'repeat(1, 1fr)', // 1 column on smaller screens
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
        },
        '@media (max-width: 400px)': {
            gridTemplateColumns: 'repeat(1, 1fr)', // 1 column on smaller screens
            paddingLeft: '0.25rem',
            paddingRight: '0.25rem',
            titleStyle: {
                fontSize: '1.5rem', // Smaller font size for mobile
            }
        },
        '@media (max-width: 200px)': {
            gridTemplateColumns: 'repeat(1, 1fr)', // 1 column on tiny screens
            paddingLeft: '0.125rem',
            paddingRight: '0.125rem',
            titleStyle: {
                fontSize: '1.25rem', // Even smaller font size
            }
        },
    };

    return (
        <div style={containerStyle}>
            <div style={innerBoxStyle}>
                <h2 style={titleStyle}>My Trips</h2>
                <div style={{...gridContainerStyle, ...mobileStyles}}>
                    {userTrips?.length > 0 ? userTrips.map((trip, index) => (
                        <UserTripCard trip={trip} key={index} />
                    )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} style={loaderCardStyle}></div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyTrips;
