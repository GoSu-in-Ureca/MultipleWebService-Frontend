// src/App.jsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { RouterObject } from './RouterList';
import './styles/index.css';

function App() {
  const javascript_key = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

  useEffect(() => {
    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
      script.onload = () => {
        window.Kakao.init(javascript_key);
        console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
      };
      document.body.appendChild(script);
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(javascript_key);
      console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
    }
  }, [javascript_key]);

  return (
    <StrictMode>
      <RecoilRoot>
        <RouterProvider router={RouterObject} />
      </RecoilRoot>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<App />);

export default App;
