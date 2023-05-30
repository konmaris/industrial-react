// Import dependencies
import { useContext } from "react";

// Import custom authentication context provider
import ProfileContext from "./ProfileProvider";

// Custom hook used to access/modify the authentication context
const useProfile = () => {
  return useContext(ProfileContext);
};

export default useProfile;
