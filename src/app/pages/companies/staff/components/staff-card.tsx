import { FC, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { Staff } from "../../../../types/user";
import { Link, useParams } from "react-router-dom";
import DeleteStaffModal from "../delete-staff/delete-staff-modal";
import { useMutation, useQuery } from "react-query";
import { removeStaffCompanyApi } from "../../../../apis";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
const MySwal = withReactContent(Swal);
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { useDispatch, useSelector } from "react-redux";
import { addOneUserNotInCompany } from "../../../../features/usersNotInCompanySlice";
import { canEditCompany } from "../../../../features/userSlice";
import { UserResponse } from "../../../../types/reducers";

type Props = {
  staff: Staff;
};

const StaffCard: FC<Props> = ({ staff }) => {
  const { id } = useParams();
  const isCompanyEditor = useSelector((state) => canEditCompany(state, id));
  const { user } = useSelector((state: UserResponse) => state?.user);

  const { refetch } = useQuery({
    queryKey: ["get-all-company-staff"],
  });

  const { mutate, isLoading, isSuccess } = useMutation({
    mutationKey: ["create-staff", id],
    mutationFn: async (user_id: string) =>
      await removeStaffCompanyApi({
        company_id: id,
        user_id: user_id,
      }),
  });

  const [deleteStaff, setDeleteStaff] = useState<Staff | null>(null);

  const dispatch = useDispatch();

  const handleDeleteStaff = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir supprimer ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      backdrop: true,
      showLoaderOnConfirm: isLoading,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        mutate(staff.user_id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            dispatch(addOneUserNotInCompany(staff));
            toast.success("Le staff a été supprimé avec succès !");
          },
          onSettled(data, error, variables, context) {},
        });
      }
    });
  };

  return (
    <>
      <div className="card border mb-4">
        <div className="card-body d-flex flex-center flex-column p-9">
          <div className="mb-5">
            <div className="symbol symbol-75px symbol-circle">
              {!staff.data?.avatar ? (
                <span
                  className={`symbol-label bg-light-success text-success fs-5 fw-bolder`}
                >
                  {staff?.user_id?.charAt(0)}
                </span>
              ) : (
                <img alt="Pic" src={getMediaUrl(staff.data?.avatar)} />
              )}
            </div>
          </div>

          <span className="fs-4 text-gray-800 fw-bolder mb-0">
            {staff?.data?.fname} {staff?.data?.lname}
          </span>

          <div className="d-flex flex-column flex-center flex-wrap mt-2">
            <div className="fw-bold text-gray-500 text-center">
              {staff?.roles[0]?.display_name}
            </div>
            <div className="fs-6 fw-bolder text-gray-700 my-2">
              {staff?.data?.email}
            </div>
          </div>

          <div className="w-100 d-flex flex-row align-items-center justify-content-center">
            <Link
              to={`/profile/${staff?.user_id}`}
              className="btn btn-sm btn-light"
            >
              <KTIcon iconName="magnify" className="fs-3" />
              Voir
            </Link>

            {user?.company?.user_id === staff?.user_id ? (
              <></>
            ) : (
              <>
                {isCompanyEditor && (
                  <span
                    className="btn btn-sm btn-danger mx-3"
                    onClick={() => handleDeleteStaff()}
                  >
                    <KTIcon iconName="magnify" className="fs-3" />
                    Supprimer
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteStaffModal
        isOpen={deleteStaff === null ? false : true}
        setIsOpen={setDeleteStaff}
        refetch={refetch}
        staff={deleteStaff}
        company_id={id}
      />
    </>
  );
};

export default StaffCard;
