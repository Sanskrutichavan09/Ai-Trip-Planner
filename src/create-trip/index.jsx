/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import { useToast } from "../hooks/use-toast";
import { chatSession } from "../service/Aimodel";
import { Button } from "../components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "../constants/Options";
import { AiOutlineLoading3Quarters, AiOutlineSearch, AiOutlineCalendar } from "react-icons/ai";
import { FaWallet, FaUserFriends } from "react-icons/fa";
import { BsGeoAlt } from "react-icons/bs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebaseConfig"; // Firebase config
import { useNavigate } from "react-router-dom"; // Navigation hook

import './CSS/Createtrip.css'; // Normal CSS import

// Dialog Component
function Dialog({ open, onOpenChange, children }) {
  if (!open) return null;
  return (
    <div className="dialog-overlay" onClick={() => onOpenChange(false)}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Main Component
function CreateTrip() {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [days, setDays] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [formData, setFormData] = useState({});
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch places from API
  const fetchPlaces = async (query) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const places = response.data.map((place) => ({
        label: place.display_name,
        value: {
          lat: place.lat,
          lon: place.lon,
        },
      }));
      setOptions(places);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (inputValue) => {
    if (inputValue.length >= 3) {
      fetchPlaces(inputValue);
    } else {
      setOptions([]);
    }
  };

  // Handlers for form fields
  const handlePlaceSelect = (option) => setSelectedPlace(option);
  const handleDaysChange = (e) => setDays(e.target.value);
  const handleBudgetSelect = (budget) => setSelectedBudget(budget);
  const handleTravelSelect = (travel) => setSelectedTravel(travel);

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedPlace || !days || !selectedBudget || !selectedTravel) {
      toast({
        title: "Incomplete Details",
        description: "Please fill in all details before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const formData = {
      location: selectedPlace,
      days: parseInt(days),
      budget: selectedBudget,
      traveler: selectedTravel,
    };
    setFormData(formData);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const OnGenerateTrip = async () => {
      if (!formData.location || !formData.days || !formData.budget || !formData.traveler) {
        toast({
          title: "Incomplete Details",
          description: "Please fill in all details before proceeding.",
          variant: "destructive",
        });
        return;
      }

      // Check if total days exceed 5
      if (formData.days > 5) {
        toast({
          title: "Invalid Duration",
          description: "Your trip cannot exceed 5 days.",
          variant: "destructive",
        });
        return;
      }

      const FINAL_PROMPT = AI_PROMPT
        .replace("{location}", formData.location.label) // Get the label for the location
        .replace("{totalDays}", formData.days)
        .replace("{traveler}", formData.traveler)
        .replace("{budget}", formData.budget);

      try {
        // Send the prompt to the chatSession API (assuming you have a working function here)
        const result = await chatSession.sendMessage(FINAL_PROMPT);

        // Save the AI-generated trip to Firebase
        SaveAiTrip(result?.response?.text());

        toast({
          title: "Trip Created",
          description: "Your trip has been created successfully!",
          variant: "success",
        });
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Could not create the trip. Try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    OnGenerateTrip();
  };

  // Save trip data to Firebase
  const SaveAiTrip = async (TripData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();

    try {
      await setDoc(doc(db, "AiTrip", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId,
      });
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast({
        title: "Error",
        description: "Could not save the trip. Try again later.",
        variant: "destructive",
      });
    }
  };

  // Google Login
  const login = useGoogleLogin({
    onSuccess: (token) => GetUserProfile(token),
    onError: (error) => console.error("Google Login Error:", error),
  });

  // Fetch user profile
  const GetUserProfile = async (token) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token.access_token}`
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      handleSubmit(); // Retry submission
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  return (
    <div className="create-trip-container">
      <h2 className="title">Tell us your travel preferences 🌍✈️🌴</h2>
      <p className="sub-title">
        Let us plan your next trip! Provide a few details, and we’ll handle the rest.
      </p>
      <div className="form-container">
        <div className="input-field">
          <h2 className="label">
            <BsGeoAlt /> Destination
          </h2>
          <Select
            placeholder="Search your destination..."
            onInputChange={handleInputChange}
            onChange={handlePlaceSelect}
            options={options}
            isLoading={isLoading}
          />
        </div>
        <div className="input-field">
          <h2 className="label">
            <AiOutlineCalendar /> Duration (days)
          </h2>
          <input
            type="number"
            className="input-box"
            placeholder="Enter number of days"
            value={days}
            onChange={handleDaysChange}
          />
        </div>
        <div>
          <label className="input-field heading">What is Your Budget?</label>
          <p>The budget is exclusively allocated for activities and dining purposes.</p>
          <div className="budget-options">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleBudgetSelect(item.title)}
                className={`budget-option ${formData?.budget === item.title && "selected"}`}
              >
                <h2 className="icon">{item.icon}</h2>
                <h2 className="title">{item.title}</h2>
                <h2 className="desc">{item.desc}</h2>
              </div>
            ))}
          </div>

          <label className="input-field heading"> Who do you plan on traveling with on your next adventure?</label>
          <div className="travel-options">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTravelSelect(item.people)}
                className={`travel-option ${formData?.traveler === item.people && "selected"}`}
              >
                <h2 className="icon">{item.icon}</h2>
                <h2 className="title">{item.title}</h2>
                <h2 className="desc">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <span className="flex items-center gap-2">
            <AiOutlineSearch /> Generate Trip
          </span>
        )}
      </Button>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <img 
          src="/logo.png" 
          alt="Logo" 
          style={{ height: "5rem", width: "auto" }} 
        />
        <h2>Sign in with Google</h2>
        <Button onClick={login}>
          <FcGoogle /> Sign in
        </Button>
      </Dialog>
    </div>
  );
}

export default CreateTrip;