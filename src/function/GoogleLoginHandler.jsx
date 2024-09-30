import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const GoogleLoginHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserExists = async () => {
      const user = auth.currentUser;

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          // Existing user
          navigate("/main");
        } else {
          // New user
          navigate("/signup", {state: {email: user.email}});
        }
      } else {
        // User is not signed in
        navigate("/intro");
      }
    };

    checkUserExists();
  }, [navigate]);

  return null;
};

export default GoogleLoginHandler;
