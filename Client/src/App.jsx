import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoadingScreen from './screens/LoadingScreen';

const LoginForm = React.lazy(() => import('./screens/LoginForm'));
const SignUpForm = React.lazy(() => import('./screens/SignUpForm'));
const UploadDetails = React.lazy(() => import('./screens/UploadDetails'));
const SeeRequests = React.lazy(() => import('./screens/SeeRequests'));
const MemberDashboard = React.lazy(() => import('./screens/MemberDashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/upload" element={<UploadDetails />} />
          <Route path="/requests" element={<SeeRequests />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
