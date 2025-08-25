import type React from "react";
import { useRef } from "react";
import { useMutation, useQueryClient } from "react-query";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import type { User } from "../../types/user";
import getMediaUrl from "../../helpers/getMediaUrl";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { UserResponse } from "../../types/reducers";
import { updateUserLogo } from "../../apis";
import toast from "react-hot-toast";

interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  const { user: currentUser } = useSelector(
    (state: UserResponse) => state.user
  );

  const is_owner = currentUser?.id === user.id;
  const user_company = user?.company;
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const updateAvatarMutation = useMutation(
    (formData: FormData) => updateUserLogo(formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user", user.id]);
        toast.success("Votre photo de profil a été mise à jour avec succès !");
      },
      onError: () => {
        toast.error(
          "Une erreur est survenue lors de la mise à jour de la photo de profil."
        );
      },
    }
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      updateAvatarMutation.mutate(formData);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="card rounded-0">
      <div className="card-body pt-9 pb-0">
        <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
          <div className="me-7 mb-4">
            <div
              className={clsx(
                "symbol symbol-100px symbol-lg-160px symbol-fixed position-relative",
                {
                  "border border-3 border-warning":
                    user?.roleValues?.name === "super_admin",
                }
              )}
            >
              <img
                src={getMediaUrl(user.avatar) || "/placeholder.svg"}
                alt={`Photo de profile de ${user?.fname}`}
                className="object-fit-cover"
              />
              {is_owner && (
                <div
                  className="position-absolute top-0 end-0 p-2 bg-white bg-opacity-75 rounded-circle cursor-pointer hover:bg-opacity-100 transition-all duration-300"
                  onClick={handleIconClick}
                >
                  <KTIcon iconName="pencil" className="fs-4 text-primary" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="d-none"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                  <span className="text-gray-800 fs-2 fw-bolder me-1">
                    {user.fname} {user.lname}
                  </span>
                  {user?.roleValues?.name === "super_admin" && (
                    <span>
                      <KTIcon iconName="verify" className="fs-1 text-primary" />
                    </span>
                  )}
                </div>

                <div className="d-flex flex-wrap flex-row align-items-center fw-bold fs-6 pe-2">
                  <span className="d-flex align-items-center text-gray-500 me-3">
                    {user.roleValues?.display_name}
                  </span>

                  <span className="d-flex align-items-center text-gray-500 me-3">
                    {user?.info?.type === "student" ? (
                      <span className="d-flex align-items-center text-gray-500 me-3">
                        | Étudiant
                      </span>
                    ) : user?.info?.occupation_id !== null ? (
                      <span className="d-flex align-items-center text-gray-500 me-3">
                        | {user?.info?.occupationFound?.label_fr}
                      </span>
                    ) : (
                      <span className="d-flex align-items-center text-gray-500 me-3">
                        {user?.info?.occupation !== null &&
                          `| ${user?.info?.occupation}`}
                      </span>
                    )}
                  </span>
                </div>

                <div className="d-flex flex-wrap fw-bold fs-6 pe-2">
                  {/* Phone and email information */}
                </div>

                {user_company?.id ? (
                  <div
                    className="d-flex flex-row align-items-center my-4 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/company/${user_company?.id}`);
                    }}
                  >
                    <div className="symbol symbol-35px symbol-fixed position-relative">
                      <img
                        src={
                          getMediaUrl(user_company?.logo) || "/placeholder.svg"
                        }
                        alt=""
                        className="rounded-3"
                      />
                    </div>
                    <div>
                      <h4 className="text-gray-700 ms-2 my-1 fs-5">
                        {user_company?.legal_status} {user_company?.name}
                      </h4>
                      <h6 className="text-gray-500 ms-2 fs-6">
                        {user_company?.email}
                      </h6>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              {!is_owner && (
                <div className="d-flex my-4">
                  <OverlayTrigger
                    placement="top-start"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Bientôt disponible !</Tooltip>}
                  >
                    <Button
                      variant="light"
                      className="opacity-25 me-4"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Suivre
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top-start"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Bientôt disponible !</Tooltip>}
                  >
                    <Button
                      variant="primary"
                      className="opacity-25"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Rencontrer
                    </Button>
                  </OverlayTrigger>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileHeader };
