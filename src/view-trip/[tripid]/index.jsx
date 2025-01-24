/* eslint-disable no-unused-vars */
import { db } from '../../service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '../../components/ui/sonners';
import InfoSection from '../components/InfoSection';
import Hotels from '../components/Hotels';
import TripPlace from '../components/TripPlace';
import Footer from '../components/Footer';

function ViewTrip() {
  const { tripid } = useParams();
  const [trip, setTrip] = useState(null);  // Set initial state as null to handle loading
  const [loading, setLoading] = useState(true);  // State to track loading

  const GetTripData = async () => {
    try {
      setLoading(true); // Set loading to true before starting the fetch
      const docRef = doc(db, "AiTrip", tripid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tripData = docSnap.data();
        console.log('Trip Data:', tripData);
        console.log('Full Trip Data:', tripData);  // Entire trip data
        console.log('User Selection:', tripData?.userSelection);  // User selection data
        setTrip(tripData); // Set the trip data state
      } else {
        toast('No trip found!');
        setTrip(null); // In case no trip is found, reset the state
      }
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast('Error fetching trip data');
      setTrip(null); // In case of an error, reset the state
    } finally {
      setLoading(false); // Set loading to false after the fetch attempt
    }
  };

  // Trigger the GetTripData when the tripid changes
  useEffect(() => {
    if (tripid) {
      GetTripData(); // Fetch data for the new trip
    }
  }, [tripid]); // Dependency array with tripid ensures effect runs on tripid change

  // Handle loading and trip data not being available
  if (loading) {
    return <div>Loading...</div>;  // Display a loading message
  }

  if (!trip) {
    return <div>No trip details available.</div>;  // Handle the case where no trip data was found
  }

  return (
    <div className='p-12 md:px-25 lg:px-44 xl:px:56'>
      <InfoSection trip={trip} />
      <Hotels trip={trip} />
      <TripPlace trip={trip} />
      <Footer trip={trip} />
    </div>
  );
}

export default ViewTrip;
