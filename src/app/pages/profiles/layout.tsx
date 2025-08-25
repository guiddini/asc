import Navbar from "./_components/navbar";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
