import RoleGuard from "../../components/role-guard";
import { investorRoles } from "../../utils/roles";
import PitchDeckList from "./components/pitch-deck-list";
import { PageTitle } from "../../../_metronic/layout/core";

const DealRoomPage = () => {
  return (
    <div className="content d-flex flex-column">
      <div id="kt_content_container" className="w-100">
        <PageTitle>Deal Room</PageTitle>
        <RoleGuard allowedRoles={investorRoles}>
          <PitchDeckList />
        </RoleGuard>
      </div>
    </div>
  );
};

export default DealRoomPage;
