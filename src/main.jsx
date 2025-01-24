import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import CreateTrip from './create-trip/index.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripid]/index.jsx'
import Mytripss from './My-tripss/index.jsx'

// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/create-trip',
    element: <CreateTrip />,
  },
  {
    path: '/view-trip/:tripid',
    element: <ViewTrip />
  },
  {
    path: '/my-trips',
    element: <Mytripss />
  }
])

// Render the app with Google OAuth and Router context
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>  
      <RouterProvider router={router} />
    </GoogleOAuthProvider>  
  </React.StrictMode>
)
