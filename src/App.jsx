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
    Kakao.init(javascript_key); // 카카오 앱 키로 초기화
    console.log(Kakao.isInitialized());
  }, []);
  
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
