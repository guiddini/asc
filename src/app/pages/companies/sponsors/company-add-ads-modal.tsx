import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../_metronic/helpers";
import { Dropzone, InputComponent } from "../../../components";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { createAdsDemandApi } from "../../../apis";
import Flatpickr from "react-flatpickr";
import SelectedMedia from "../../home/components/selected-media";
import moment from "moment";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessage } from "../../../helpers/errorMessage";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";

interface SelectAdsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

interface CreateAdsFormProps {
  name: string;
  image: File;
  link: string;
  start_date: string;
  end_date: string;
}

interface CreateAdsProps {
  name: string;
  image: File;
  company_id: string;
  link: string;
  start_date: string;
  end_date: string;
}

const adsValidationSchema = Yup.object().shape({
  name: Yup.string().required("Veuillez fournir un nom."),
  image: Yup.mixed().required("Veuillez sélectionner une image."),
  link: Yup.string()
    .required("Veuillez spécifier un lien.")
    .url("Veuillez fournir une URL valide."),
  start_date: Yup.date().required("Veuillez sélectionner une date de début."),
  end_date: Yup.date()
    .required("Veuillez sélectionner une date de fin.")
    .min(
      Yup.ref("start_date"),
      "La date de fin doit être postérieure à la date de début."
    ),
});

export const CompanyAddAdsModal: React.FC<SelectAdsProps> = ({
  isOpen,
  refetch,
  setIsOpen,
}) => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const company_id = user?.company?.id;
  const closeModal = () => setIsOpen(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: CreateAdsProps) => {
      return await createAdsDemandApi(data);
    },
    mutationKey: ["create-ads-company", company_id],
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<CreateAdsProps>({
    defaultValues: {},
    resolver: yupResolver(adsValidationSchema) as any,
  });

  const onDrop = async (file: File[]) => {
    setValue("image", file[0]);
  };

  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const image = watch("image");

  const handleCreateAd = async (data: CreateAdsFormProps) => {
    const req = {
      start_date: moment(data?.start_date).format("YYYY-MM-DD"),
      end_date: moment(data?.end_date).format("YYYY-MM-DD"),
      company_id: company_id,
      name: data?.name,
      link: data?.link,
      image: data?.image,
    };

    mutate(req, {
      onSuccess() {
        toast.success("Demande de publicité créée avec succès");
        refetch();
        closeModal();
      },
      onError() {
        toast.error("Erreur lors de la création de la publicité");
      },
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
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Créer une annonce :</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            style={{ cursor: "pointer" }}
            onClick={closeModal}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12 pb-5">
          <Row>
            <div className="mb-4">
              <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                <span className={`fw-bold`}>Image de la publicité</span>
              </label>
              <Dropzone
                dropzone={{
                  accept: {
                    "image/*": [],
                  },
                  multiple: false,
                  onDrop: onDrop,
                  onError(err) {},
                  onDropRejected(fileRejections, event) {
                    fileRejections?.forEach((file) => {
                      toast.error(
                        `Le fichier sélectionné n'est pas pris en charge`
                      );
                    });
                  },
                }}
              />
              {errorMessage(errors, "image")}
              {image && (
                <div className="w-100 my-8">
                  <SelectedMedia
                    file={image}
                    id={2}
                    remove={() => setValue("image", undefined)}
                  />
                </div>
              )}
            </div>
            <InputComponent
              control={control as any}
              errors={errors}
              label="Nom"
              name="name"
              type="text"
            />

            <InputComponent
              control={control as any}
              errors={errors}
              label="Lien"
              name="link"
              type="text"
            />

            <Col xs={12} md={6}>
              <div className="mb-0">
                <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                  <span className={`fw-bold`}>Date de début :</span>
                </label>

                <div
                  className="input-group"
                  id="kt_td_picker_time_only"
                  data-td-target-input="nearest"
                  data-td-target-toggle="nearest"
                >
                  <Flatpickr
                    value={start_date}
                    onChange={([time]) => {
                      setValue("start_date", time);
                    }}
                    className="form-control"
                    id="kt_td_picker_time_only_input"
                    placeholder="Choisir la date"
                  />
                  <span
                    className="input-group-text"
                    data-td-target="#kt_td_picker_time_only"
                    data-td-toggle="datetimepicker"
                  >
                    <i className="ki-duotone ki-calendar fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>{" "}
                  </span>
                </div>
              </div>
              {errorMessage(errors, "start_date")}
            </Col>

            <Col xs={12} md={6}>
              <div className="mb-0">
                <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                  <span className={`fw-bold`}>Date de fin :</span>
                </label>

                <div
                  className="input-group"
                  id="kt_td_picker_time_only"
                  data-td-target-input="nearest"
                  data-td-target-toggle="nearest"
                >
                  <Flatpickr
                    value={end_date}
                    onChange={([time]) => {
                      setValue("end_date", time);
                    }}
                    className="form-control"
                    id="kt_td_picker_time_only_input"
                    placeholder="Choisir la date"
                  />
                  <span
                    className="input-group-text"
                    data-td-target="#kt_td_picker_time_only"
                    data-td-toggle="datetimepicker"
                  >
                    <i className="ki-duotone ki-calendar fs-2">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>{" "}
                  </span>
                </div>
              </div>{" "}
              {errorMessage(errors, "end_date")}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-primary"
              onClick={closeModal}
            >
              <span className="indicator-label">Retour</span>
            </button>
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-success"
              disabled={isLoading}
              onClick={handleSubmit(handleCreateAd)}
            >
              {!isLoading && <span className="indicator-label">Créer</span>}
              {isLoading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Veuillez patienter...
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
