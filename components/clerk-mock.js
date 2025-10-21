// This file mocks the necessary Clerk components and hooks
// to allow the ChatBox component to run and test its logic without the external Clerk library.
// In a real Next.js environment, you would use the actual Clerk imports.

import React, { useState } from 'react';
import { Button } from '@mui/material'; // Use Button from MUI for consistency

// Mock hook for user authentication state
export function useUser() {
  // FIX: Start the user as 'signedIn: true' to simulate a loaded Clerk session
  const [isSignedIn, setIsSignedIn] = useState(true);
  
  // Simulate a basic user object
  const user = isSignedIn ? { id: "user_mock_123", firstName: "Mock" } : null;

  // Function to toggle signed-in state for testing the UI flow
  const toggleSignIn = () => setIsSignedIn(prev => !prev);
  
  return { 
    user, 
    isSignedIn, 
    // Expose toggle for testing purposes
    _toggleSignIn: toggleSignIn 
  };
}

// Mock component for sign-in button
export const SignInButton = ({ children, mode, ...props }) => {
  const { _toggleSignIn } = useUser();
  // Ensure the onClick handler simulates the sign-in action
  return <Button onClick={_toggleSignIn} {...props}>{children}</Button>;
};

// Mock component for sign-up button
export const SignUpButton = ({ children, mode, ...props }) => {
  const { _toggleSignIn } = useUser();
  // Ensure the onClick handler simulates the sign-up action
  return <Button onClick={_toggleSignIn} {...props}>{children}</Button>;
};
