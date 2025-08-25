import { Col, Modal, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../../_metronic/helpers";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessage } from "../../../../helpers/errorMessage";
import { CompanyJobApplication } from "../../company-job-applications";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import {
  acceptJobApplicationApi,
  refuseJobApplicationApi,
} from "../../../../apis";
import ApplicantDetailComponent from "./applicant-detail-component";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);

const schema = yup.object().shape({
  company_meetup_date: yup
    .string()
    .required("La date de rencontre prévue est requise")
    .typeError("La date de rencontre prévue est requise"),
  company_exact_meetup_hour: yup
    .string()
    .required("La période de rencontre prévue est requise")
    .typeError("La période de rencontre prévue est requise"),
  company_exact_meetup_minute: yup
    .string()
    .required("La période de rencontre prévue est requise")
    .typeError("La période de rencontre prévue est requise"),
  type: yup.string().notRequired(),
});

interface AcceptJobApplicationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  job: CompanyJobApplication;
}

const AcceptJobApplicationModal = ({
  isOpen,
  setIsOpen,
  job,
}: AcceptJobApplicationModalProps) => {
  const closeModal = () => setIsOpen(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      company_meetup_date: "05 Mars (1er jour)",
      company_exact_meetup_hour: "08",
      company_exact_meetup_minute: "0",
      type: null,
    },
    resolver: yupResolver(schema),
  });

  const availableDates = [
    {
      day: "05 Mars",
      label: "05 Mars (1er jour)",
      hours: [
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
      ],
      time: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ],
    },
    {
      day: "06 Mars",
      label: "06 Mars (2ème jour)",
      hours: ["09", "10", "11", "12", "13", "14", "15", "16", "17"],
      time: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ],
    },
    {
      day: "07 Mars",
      label: "07 Mars (3ème jour)",
      hours: [
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
      ],
      time: [
        "00",
        "05",
        "10",
        "15",
        "20",
        "25",
        "30",
        "35",
        "40",
        "45",
        "50",
        "55",
      ],
    },
  ];

  const { mutate: acceptMutate, isLoading: isAccepting } = useMutation({
    mutationKey: ["accept-job-application", job?.id],
    mutationFn: async ({
      id,
      company_meetup_date,
      company_meetup_time,
    }: {
      id: string | number;
      company_meetup_time: string;
      company_meetup_date: string;
    }) =>
      await acceptJobApplicationApi({
        id,
        company_meetup_date,
        company_meetup_time,
      }),
  });

  const { mutate: refuseMutate, isLoading: isRefusing } = useMutation({
    mutationKey: ["refuse-job-application", job?.id],
    mutationFn: async ({ id }: { id: string | number }) =>
      await refuseJobApplicationApi({ id }),
  });

  const onSubmit = (data: {
    company_meetup_date: string;
    company_exact_meetup_hour: string;
    company_exact_meetup_minute: string;
    type: string;
  }) => {
    const req = {
      company_meetup_date: data?.company_meetup_date,
      company_meetup_time: `${data?.company_exact_meetup_hour}:${data?.company_exact_meetup_minute}`,
      id: job?.id,
    };

    acceptMutate(req, {
      onSuccess() {
        toast.success("La demande d'emploi a été acceptée avec succès");
        closeModal();
      },
      onError(error) {
        toast.error("Erreur lors de l'acceptation de la demande d'emploi");
      },
    });
  };

  const selectedDay = watch("company_meetup_date");

  const availableHours = availableDates?.find((e) => e.day === selectedDay);
  const type = watch("type");

  const handleRefusJobApplication = async () => {
    MySwal.fire({
      title: "Êtes-vous sûr de vouloir refuser ?",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Refuser",
      showLoaderOnConfirm: true,
      preConfirm: async (motif) => {
        refuseMutate(
          {
            id: job?.id,
          },
          {
            onSuccess() {
              toast.success("La demande d'emploi a été refusée avec succès");
              closeModal();
            },
            onError(error) {
              console.log("Erreur lors du refus d'une demande d'emploi", error);
              toast.error("Erreur lors du refus d'une demande d'emploi");
            },
          }
        );
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-600px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Accepter le candidat</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>

        <Modal.Body className="pb-0 px-16 w-100">
          <ApplicantDetailComponent {...job} />

          <div className="separator my-4"></div>

          <div className="w-100 d-flex align-items-center justify-content-between">
            <span className="my-5 fs-4 text-center fw-bold">
              Détails du rendez-vous
            </span>

            {type === null && (
              <div className="d-flex flex-row gap-2">
                {job?.status !== "Refused" ? (
                  <button
                    className="btn btn-sm btn-danger text-white"
                    onClick={() => {
                      setValue("type", "refuse");
                      handleRefusJobApplication();
                    }}
                  >
                    refuser
                  </button>
                ) : null}
                {job?.status !== "Accepted" ? (
                  <button
                    className="btn btn-sm btn-custom-purple-dark text-white"
                    onClick={() => setValue("type", "accept")}
                  >
                    accepter
                  </button>
                ) : null}
              </div>
            )}
          </div>

          <Row className="mt-4">
            {type !== null && (
              <>
                {type === "accept" && (
                  <Col xs={12} md={12}>
                    <Row>
                      <Col xs={12} md={6} className="fv-row">
                        <label className="required fs-5 fw-semibold mb-2">
                          Le jour
                        </label>
                        <select
                          className="form-select form-select-solid"
                          {...register("company_meetup_date")}
                        >
                          {availableDates.map((date) => (
                            <option value={date?.day}>{date?.label}</option>
                          ))}
                        </select>
                        {errorMessage(errors, "company_meetup_date")}
                      </Col>
                      <Col xs={6} md={3} className="fv-row">
                        <label className="required fs-5 fw-semibold mb-2">
                          L'heure
                        </label>
                        <select
                          className="form-select form-select-solid"
                          {...register("company_exact_meetup_hour")}
                        >
                          {availableHours?.hours?.map((hour) => (
                            <option value={hour} key={hour}>
                              {hour}
                            </option>
                          ))}
                        </select>
                        {errorMessage(errors, "company_exact_meetup_hour")}
                      </Col>

                      <Col xs={6} md={3} className="fv-row">
                        <select
                          className="form-select form-select-solid mt-9"
                          data-control="select2"
                          data-placeholder="In Progress"
                          data-hide-search="true"
                          {...register("company_exact_meetup_minute")}
                        >
                          {availableHours?.time?.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </select>
                        {errorMessage(errors, "company_exact_meetup_minute")}
                      </Col>
                    </Row>
                  </Col>
                )}

                {type === "accept" && (
                  <Row className="my-5 w-100 mx-0 px-0">
                    <div className="notice d-flex rounded border-light border border-dashed p-6 bg-primary w-100">
                      <KTIcon
                        iconName="information"
                        className="fs-2tx text-white me-4"
                      />

                      <div className="d-flex flex-stack flex-grow-1 ">
                        <div className=" fw-semibold">
                          {/* <h4 className="text-white fw-bold">CV</h4> */}

                          <div className="fs-6 text-white">
                            Après acceptation, le candidat recevra
                            automatiquement un email contenant toutes les
                            informations nécessaires.
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                )}
              </>
            )}
          </Row>
        </Modal.Body>

        {type === "accept" && (
          <Modal.Footer className="w-100 d-flex flex-row align-items-center justify-content-between">
            <button
              onClick={() => {
                setValue("type", null);
              }}
              className="btn bg-custom-purple-light text-white"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="btn bg-custom-purple-dark text-white"
              disabled={isAccepting || isRefusing}
            >
              {type === "accept" && (
                <>
                  {isAccepting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Confirmer"
                  )}
                </>
              )}
            </button>
          </Modal.Footer>
        )}
      </div>
    </Modal>
  );
};

export default AcceptJobApplicationModal;
