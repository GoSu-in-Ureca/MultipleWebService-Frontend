// KakaoLoginHandler.jsx
import { useEffect } from "react";
import Loading from "../Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithCustomToken } from "firebase/auth";

const KakaoLoginHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKakaoToken = async () => {
      // Extract the authorization code from the URL
      const searchParams = new URLSearchParams(location.search);
      const authCode = searchParams.get('code');

      if (authCode) {
        try {
            const response = await fetch('https://us-central1-multiplewebservice-bdff9.cloudfunctions.net/createCustomToken', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'cors', // CORS 모드 명시
                body: JSON.stringify({ code: authCode }),
              });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          const firebaseToken = data.token;

          // Sign in with the custom token
          await signInWithCustomToken(auth, firebaseToken);

          navigate('/main'); // Navigate to the main page after successful login
        } catch (error) {
          console.error('Error during Firebase custom token sign-in:', error);
        }
      } else {
        console.error('No Kakao authorization code found in URL');
      }
    };

    fetchKakaoToken();
  }, [location, navigate]);

  return <Loading />;
};

export default KakaoLoginHandler;
