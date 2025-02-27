import { Routes, Route } from "react-router-dom";
import PointsSummary from "../Points-Summary/PointsSummary";
import MemberTable from "./components/MemberTable";
import PageNotFound from "../Page-Not-Found/PageNotFound";

const MemberView = () => {
  return (
    <Routes>
      <Route index element={<MemberTable />} />
      <Route path="points-summary/:id" element={<PointsSummary />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default MemberView;
