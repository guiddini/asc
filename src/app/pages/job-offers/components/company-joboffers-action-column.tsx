import { Dropdown } from "react-bootstrap";
import { JobOffer } from "../types/job-offer-type";
import { KTIcon } from "../../../../_metronic/helpers";
import { useState } from "react";
import ViewJobDetailModal from "./modals/view-job-detail-modal";
import clsx from "clsx";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import {
  makeCompanyJobOfferActiveApi,
  makeCompanyJobOfferInactiveApi,
} from "../../../apis";
import { useNavigate } from "react-router-dom";
const MySwal = withReactContent(Swal);

const CompanyJoboffersActionColumn = (job: JobOffer) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const is_active = job.job_offer_status === "Active";

  const { mutate: makeActiveMutate } = useMutation({
    mutationKey: ["make-joboffer-active"],
    mutationFn: async (id: string | number) =>
      await makeCompanyJobOfferActiveApi(id),
  });

  const { mutate: makeInactiveMutate } = useMutation({
    mutationKey: ["make-joboffer-inactive"],
    mutationFn: async (id: string | number) =>
      await makeCompanyJobOfferInactiveApi(id),
  });

  const handleInactiveJob = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir désactiver ?",
      icon: "error",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Désactiver",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        makeInactiveMutate(job.id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            toast.success("L'offre d'emploi a été désactivée avec succès !");
          },
          onError(error, variables, context) {
            toast.error(
              "Erreur lors de la désactivation de l'offre d'emploi, réessayer un peu plus tard"
            );
          },
        });
      }
    });
  };

  const handleActiveJob = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir activer ?",
      icon: "success",
      heightAuto: false,
      cancelButtonText: "Annuler",
      showCancelButton: true,
      confirmButtonText: "Activer",
      backdrop: true,
      showConfirmButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        MySwal.showLoading();
        makeActiveMutate(job.id, {
          onSuccess(data, variables, context) {
            MySwal.hideLoading();
            toast.success("L'offre d'emploi a été activée avec succès !");
          },
          onError(error, variables, context) {
            toast.error(
              "Erreur lors de l'activation de l'offre d'emploi, réessayer un peu plus tard"
            );
          },
        });
      }
    });
  };

  const navigate = useNavigate();

  return (
    <Dropdown placement="top-start">
      <Dropdown.Toggle
        variant="transparent"
        color="#fff"
        id="post-dropdown"
        className="btn btn-icon btn-color-gray-500 btn-active-color-primary justify-content-end"
      >
        <i className="ki-duotone ki-dots-square fs-1">
          <span className="path1"></span>
          <span className="path2"></span>
          <span className="path3"></span>
          <span className="path4"></span>
        </i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="p-2">
          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              navigate(
                `/job-offers/${job?.company_id}/applications/${job?.id}`
              );
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="user-tick"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Condidatures</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              navigate(`/job-offers/${job?.company_id}/detail/${job?.id}`);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="eye"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Visualiser</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              navigate(`/job-offers/${job?.company_id}/update/${job?.id}`);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="pencil"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Modifier</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              setShowDetails(true);
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName="magnifier"
              className={`fs-1 cursor-pointer m-0 text-primary`}
            />
            <span className="text-muted mt-1 ms-2">Détails</span>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={(e) => {
              e.preventDefault();
              if (is_active) {
                handleInactiveJob();
              } else {
                handleActiveJob();
              }
            }}
            className="cursor-pointer d-flex flex-row align-items-center nav-link btn btn-sm btn-color-gray-600 btn-active-color-info btn-active-light-info fw-bold collapsible m-0 px-5 py-3"
          >
            <KTIcon
              iconName={is_active ? "cross-circle" : "check-square"}
              className={clsx("fs-1 cursor-pointer m-0", {
                "text-primary": !is_active,
                "text-danger": is_active,
              })}
            />
            <span className="text-muted mt-1 ms-2">
              {is_active ? "Désactiver" : "Activer"}
            </span>
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
      <ViewJobDetailModal
        isOpen={showDetails}
        job={job}
        setIsOpen={setShowDetails}
        key={String(showDetails)}
      />
    </Dropdown>
  );
};

export default CompanyJoboffersActionColumn;
