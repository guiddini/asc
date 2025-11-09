import { Route, Routes } from "react-router-dom";
import { EntityProfilePage } from "./page";

const ProfileRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<ProfileLayout />}>
      </Route> */}
      <Route path="/:slug" element={<EntityProfilePage />} />
    </Routes>
  );
};

export default ProfileRoutes;
