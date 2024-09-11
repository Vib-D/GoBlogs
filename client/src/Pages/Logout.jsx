import React, { useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Perform the logout actions inside useEffect
    setCurrentUser(null);
    navigate('/login');
  }, [setCurrentUser, navigate]); // Adding dependencies to ensure the effect only runs once

  return (
    <>
      Logging out...
    </>
  );
};

export default Logout;
