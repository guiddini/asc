import { useState } from "react";
import { Col, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../../../_metronic/helpers";
import UpdateAds from "../update-ads";
import { ADProps } from "../ads";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import { useMutation, useQuery } from "react-query";
import { deleteAdsApi, getAllAdsApi } from "../../../../apis";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import toast from "react-hot-toast";

const MySwal = withReactContent(Swal);

const SponsorCard = (props: ADProps) => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (id: number | string) => {
      return await deleteAdsApi(id);
    },
    mutationKey: ["delete-ads", props?.id],
  });

  const { refetch } = useQuery({
    queryKey: ["get-all-ads"],
    queryFn: getAllAdsApi,
  });

  const handleDeleteSponsor = async () => {
    MySwal.fire({
      title: "Are you sure you want to delete?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Cancel",
      showCancelButton: true,
      confirmButtonText: "Delete",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        mutate(props?.id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            refetch();
            toast.success("ads has been removed successfully !");
          },
          onError(error, variables, context) {
            toast.error("Error while deleting ads");
          },
        });
      }
    });
  };

  const [updateAd, setUpdateAd] = useState<ADProps | null>(null);

  return (
    <>
      <Col xs={12} md={6} lg={4}>
        <div className="card border-hover-primary mb-5 border rounded-1 mb-3">
          <div className="card-header border-0 pt-9">
            <div className="w-100 mh-300px overflow-hidden">
              <img
                src={getMediaUrl(props?.image_path)}
                alt="image"
                className="w-100 h-100"
              />
            </div>
          </div>
          <div className="card-body p-9">
            <div className="fs-3 fw-bold text-gray-900">{props?.name}</div>
            {/* <p className="text-gray-500 fw-semibold fs-5 mt-1 mb-7">
            CRM App application to HR efficiency
          </p> */}
            <div className="d-flex flex-wrap mb-5 gap-1">
              <div className="border border-gray-300 border-dashed rounded min-w-125px py-2 px-4 mb-3">
                <div className="fs-6 text-gray-800 fw-bold">
                  {props?.start_date}
                </div>
                <div className="fw-semibold text-gray-500">Start date</div>
              </div>
              <div className="border border-gray-300 border-dashed rounded min-w-125px py-2 px-4 mb-3">
                <div className="fs-6 text-gray-800 fw-bold">
                  {props?.end_date}
                </div>
                <div className="fw-semibold text-gray-500">End date</div>
              </div>
              <div className="border border-gray-300 border-dashed rounded min-w-125px py-2 px-4 mb-3">
                <div className="fs-6 text-gray-800 fw-bold">
                  {props?.clicks || 0}
                </div>
                <div className="fw-semibold text-gray-500">Nombre de clics</div>
              </div>
            </div>
            <div className=" mt-3 d-flex flex-row align-items-center gap-3">
              {/* <Link to="/products/hahaahh" className="btn btn-sm btn-success">
              View
            </Link> */}
              <button
                onClick={() => {
                  window.open(props?.link, "_blank");
                }}
                className="btn btn-sm btn-primary"
              >
                <KTIcon iconName="eye" className="text-light" />
                View ads link
              </button>
              <span
                className="btn btn-sm btn-success"
                onClick={() => {
                  setUpdateAd(props);
                }}
              >
                Update
              </span>
              <button
                disabled={isLoading}
                className="btn btn-sm btn-danger"
                onClick={handleDeleteSponsor}
              >
                {isLoading ? <Spinner animation="border" size="sm" /> : "Refus"}
              </button>
              <button
                disabled={isLoading}
                className="btn btn-sm btn-danger"
                onClick={handleDeleteSponsor}
              >
                {isLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </Col>
      {updateAd && (
        <UpdateAds
          ads={updateAd}
          isOpen={updateAd !== null}
          setIsOpen={setUpdateAd}
        />
      )}
    </>
  );
};

export default SponsorCard;
