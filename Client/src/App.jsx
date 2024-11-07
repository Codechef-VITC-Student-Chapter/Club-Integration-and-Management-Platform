import React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from '@vercel/analytics/react';

import { RunningProvider } from './contexts/RunningContext.jsx';
import AppContent from './screens/AppContent.jsx';
import ShortTextInput from "./Components/ShortTextInput.jsx"
import DropDownInput from "./Components/DropDownInput.jsx"
import LongText from "./Components/LongText.jsx"
import Numberandpassword from "./Components/Numberandpassword.jsx"
import Checkbox from "./Components/CheckBox.jsx"
import Buttons from "./Components/Buttons.jsx"
import { Check } from "lucide-react"

function App() {
  return (
    <>
      <BrowserRouter>
        <RunningProvider>
          <AppContent />
        </RunningProvider>
        <ToastContainer />
      </BrowserRouter>
      <Analytics />
      
    </>
  );
}

export default App;