// src/App.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { RouterObject } from './RouterList';
import './styles/index.css';

function App() {
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
