import React, { Suspense, useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoadingScreen from './screens/LoadingScreen';
import Navbar from './components/Navbar';

const PageNotFound = React.lazy(() => import('./screens/PageNotFound'));
const LoginForm = React.lazy(() => import('./screens/LoginForm'));
const SignUpForm = React.lazy(() => import('./screens/SignUpForm'));
const UploadDetails = React.lazy(() => import('./screens/UploadDetails'));
const SeeRequests = React.lazy(() => import('./screens/SeeRequests'));
const MemberDashboard = React.lazy(() => import('./screens/MemberDashboard'));

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<LoginForm setToken={setToken} />} />
          <Route path="/signup" element={<SignUpForm setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    );
  }
  return (
    <>
      <Navbar setToken={setToken} />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/upload" element={<UploadDetails />} />
            <Route path="/requests" element={<SeeRequests />} />
            <Route path="/loading" element={<LoadingScreen />} />
            <Route path="/dashboard" element={<MemberDashboard />} />
            <Route path="/login" element={<MemberDashboard />} />
            <Route path="/signup" element={<MemberDashboard />} />
            <Route path="/" element={<MemberDashboard />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
