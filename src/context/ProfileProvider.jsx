// Import dependencies
import React, { createContext, useState } from "react";

// Create empty context
const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({ username: "" });

  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
};

export default ProfileContext;
