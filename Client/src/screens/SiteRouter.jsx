import React, { Suspense } from "react";

import { Routes, Route } from "react-router-dom";

import LoadingScreen from "./Loading-Screen/LoadingScreen";
import Navbar from "./Navbar/Navbar";
import { useRunningContext } from "../contexts/RunningContext";
import DepartmentContributions from "./Department-Contributions/DepartmentContributions";
import MemberTable from "./Member-View/MemberTable";

const PointsSummary = React.lazy(() =>
  import("./Points-Summary/PointsSummary")
);
const PageNotFound = React.lazy(() => import("./Page-Not-Found/PageNotFound"));
const LoginForm = React.lazy(() => import("./Login-Form/LoginForm"));
const SignUpForm = React.lazy(() => import("./Signup-Form/SignUpForm"));
const RequestScreen = React.lazy(() =>
  import("./Request-Screen/RequestScreen")
);
const AdminInbox = React.lazy(() => import("./Admin-Inbox/AdminInbox"));
const MemberDashboard = React.lazy(() =>
  import("./Member-DashBoard/MemberDashboard")
);

function SiteRouter() {
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
    <div className="h-screen w-full bg-skyblue overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/upload" element={<RequestScreen />} />
          {isAdmin && <Route path="/adminview" element={<AdminInbox />} />}
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/dashboard" element={<MemberDashboard />} />
          {isAdmin && <Route path="/memberview" element={<MemberTable />} />}
          {/* <Route path="/memberview" element={<MemberTable />} /> */}
          <Route path="/summary/:id" element={<PointsSummary />} />
          <Route
            path="/department/:id/:dept"
            element={<DepartmentContributions />}
          />
          <Route path="/" element={<MemberDashboard />} />
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default SiteRouter;
