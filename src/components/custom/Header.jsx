/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import './CSS/Header.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/Popover";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "../ui/dialog";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { Link } from 'react-router-dom';

function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log(user);
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json',
      },
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      window.location.reload();
    });
  };

  return (
    <div className="header-container">
      <img src="/logo.png" className="header-logo" alt="Logo" />

      <div>
        {user ? (
          <div className="user-menu">
            <Link to="/create-trip">
              <Button className="button-outline">Create Trip</Button>
            </Link>
            <Link to="/my-trips">
              <Button className="button-outline">My Trips</Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className="user-avatar" />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className="logout-option"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogDescription className="text-center">
              <img src="/logo.png" className="header-logo mx-auto" alt="Logo" />
              <h2>Sign In with Google</h2>
              <p>Sign In to the App with Google authentication securely</p>
              <Button
                onClick={login}
                className="sign-in-button"
              >
                <FcGoogle className="google-icon" />
                Sign In With Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
