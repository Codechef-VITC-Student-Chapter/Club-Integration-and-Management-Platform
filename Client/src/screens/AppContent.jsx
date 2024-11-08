import React, { Suspense, useState } from "react";

import { Routes, Route } from "react-router-dom";

import LoadingScreen from "./LoadingScreen";
import Navbar from "../components/Navbar";
import { useRunningContext } from "../contexts/RunningContext";
import Admin_view from "./Admin_view";

const PageNotFound = React.lazy(() => import("./PageNotFound"));
const LoginForm = React.lazy(() => import("./LoginForm"));
const SignUpForm = React.lazy(() => import("./SignUpForm"));
const UploadDetails = React.lazy(() => import("./UploadDetails"));
const SeeRequests = React.lazy(() => import("./SeeRequests"));
const MemberDashboard = React.lazy(() => import("./MemberDashboard"));

function AppContent() {
  const { token, isAdmin } = useRunningContext();

  if (!token) {
    return (
      <Routes>
        <Route path="/loginform" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/*" element={<LoginForm />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/upload" element={<UploadDetails />} />
          {isAdmin && <Route path="/requests" element={<SeeRequests />} />}
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          <Route path="/login" element={<MemberDashboard />} />
          <Route path="/signup" element={<MemberDashboard />} />
          <Route path="/adminview" element={<Admin_view/>}/>
          <Route path="/" element={<MemberDashboard />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default AppContent;