import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import getMediaUrl from "../../../../app/helpers/getMediaUrl";
import axiosInstance from "../../../../app/apis/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../../app/types/reducers";

const HeaderUserMenu: FC = () => {
  const { logout } = useAuth();
  const { user } = useSelector((state: UserResponse) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance("/logout").then(() => {
        logout();
      });
    } catch (error) {
      toast.error(`Erreur lors de la déconnexion`);
    }
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
      style={{
        zIndex: 1,
      }}
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img
              alt="Logo"
              src={getMediaUrl(user.avatar)}
              className="object-fit-cover"
            />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5 text-black">
              {user?.fname} {user?.lname}
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {user?.email}
            </a>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <Link to={`/profile/${user?.id}`} className="menu-link px-5">
          Mon profil
        </Link>
      </div>

      <div className="menu-item px-5">
        <a
          onClick={() => {
            handleLogout();
            navigate("/");
          }}
          className="menu-link px-5"
        >
          Déconnexion
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
