import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { RunningProvider } from './contexts/RunningContext.jsx';
import AppContent from './screens/AppContent.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <RunningProvider>
          <AppContent />
        </RunningProvider>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
