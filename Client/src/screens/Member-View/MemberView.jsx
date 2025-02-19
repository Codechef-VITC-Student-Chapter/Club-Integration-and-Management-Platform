import { Routes, Route } from "react-router-dom";
import PointsSummary from "../Points-Summary/PointsSummary";
import MemberTable from "./components/MemberTable";


const MemberView = () => {
    return (
        <Routes>
            <Route path="/" element={<MemberTable />} />
            <Route path="/points-summary/:id" element={<PointsSummary />} />
        </Routes>
    );
};

export default MemberView;
