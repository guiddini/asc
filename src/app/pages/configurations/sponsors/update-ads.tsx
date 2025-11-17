import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../_metronic/helpers";
import { Dropzone, InputComponent, SelectComponent } from "../../../components";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { getAllAdsApi, updateAdsApi } from "../../../apis";
import Flatpickr from "react-flatpickr";
import { useCompany } from "../../../hooks";
import { ADProps } from "./ads";
import getMediaUrl from "../../../helpers/getMediaUrl";
import moment from "moment";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const updateValidationSchema = Yup.object().shape({
  name: Yup.string().required("Veuillez fournir un nom."),
  image_path: Yup.mixed().required("Veuillez sélectionner une image."),
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
  company_id: Yup.string()
    .required("Veuillez sélectionner une entreprise")
    .typeError("Veuillez sélectionner une entreprise"),
});

interface UpdateAdsProps {
  isOpen: boolean;
  setIsOpen: any;
  ads: ADProps;
}

interface CreateAdsFormProps {
  name: string;
  image_path: File;
  company_id: {
    label: string;
    value: string;
  };
  link: string;
  start_date: string;
  end_date: string;
}

const UpdateAds: React.FC<UpdateAdsProps> = ({ ads, isOpen, setIsOpen }) => {
  const closeModal = () => setIsOpen(null);

  const { MEMORIZED_COMPANIES, loadingCompanies } = useCompany();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: FormData) => {
      return await updateAdsApi(data);
    },
    mutationKey: ["update-ads-admin", ads?.id],
  });

  const { refetch } = useQuery({
    queryKey: ["get-all-ads"],
    queryFn: getAllAdsApi,
  });

  const defaultValues = {
    name: ads?.name,
    image_path: ads?.image_path,
    company_id: ads?.company_id,
    link: ads?.link,
    start_date: ads?.start_date,
    end_date: ads?.end_date,
  };

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<CreateAdsFormProps>({
    defaultValues: {
      name: ads?.name,
      image_path: ads?.image_path as any,
      company_id: { label: "", value: String(ads?.company_id) },
      link: ads?.link,
      start_date: ads?.start_date,
      end_date: ads?.end_date,
    },
    resolver: yupResolver(updateValidationSchema) as any,
  });

  const onDrop = async (file: File[]) => {
    setValue("image_path", file[0]);
  };

  const companies = MEMORIZED_COMPANIES?.map((e) => {
    return {
      label: e.name,
      value: e.id,
    };
  });

  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const image = watch("image_path");
  const company = companies?.find(
    (company) => company.value === ads?.company_id
  );

  const handleUpdateAd = async (data: CreateAdsFormProps) => {
    const formdata = new FormData();
    formdata.append("name", data.name);
    typeof data?.image_path !== "string" &&
      formdata.append("image", data.image_path);
    formdata.append("company_id", String(data.company_id));
    formdata.append("link", data.link);
    formdata.append(
      "start_date",
      moment(data?.start_date).format("YYYY-MM-DD")
    );
    formdata.append("end_date", moment(data?.end_date).format("YYYY-MM-DD"));
    formdata.append("ad_id", ads.id);

    mutate(formdata, {
      onSuccess() {
        toast.success("Ads updated successfully");
        refetch();
        closeModal();
      },
      onError() {
        toast.error("Error updating ads");
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
          <h2 className="fw-bolder">Update add :</h2>

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
                <span className={`fw-bold`}>Ads image</span>
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
                      toast.error(`The selected file is not supported`);
                    });
                  },
                }}
              />
              {image && (
                <div className="w-100 my-8">
                  <Col
                    xs={2}
                    md={2}
                    style={{
                      overflow: "hidden",
                      width: "120px",
                      height: "120px",
                      position: "relative",
                      display: "block",
                    }}
                    // className="h-75px mb-4 d-flex align-items-center justify-content-center position-relative overflow-hidden my-4"
                  >
                    <>
                      <button
                        className="border-0 bg-transparent position-absolute top-0 end-0"
                        onClick={() => {
                          setValue("image_path", undefined);
                        }}
                      >
                        <i className="fa-solid fa-trash text-danger"></i>
                      </button>

                      <div
                        style={{
                          width: "120px",
                          height: "120px",
                        }}
                        className="d-flex flex-column align-items-center justify-content-center"
                      >
                        <>
                          {typeof image === "string" ? (
                            <>
                              <img
                                src={getMediaUrl(ads?.image_path)}
                                className="object-fit-cover"
                                style={{
                                  width: "auto",
                                  height: "120px",
                                }}
                              />
                            </>
                          ) : (
                            <img
                              src={URL?.createObjectURL(image)}
                              className="object-fit-cover"
                              style={{
                                width: "auto",
                                height: "120px",
                              }}
                            />
                          )}
                        </>
                      </div>
                    </>
                  </Col>
                </div>
              )}
            </div>
            <InputComponent
              control={control as any}
              errors={errors}
              label="Name"
              name="name"
              type="text"
            />

            <InputComponent
              control={control as any}
              errors={errors}
              label="Link"
              name="link"
              type="text"
            />

            <SelectComponent
              control={control as any}
              data={companies}
              isLoading={loadingCompanies}
              errors={errors}
              label="Startup"
              name="company_id"
              noOptionMessage=""
              colMD={12}
              colXS={12}
              defaultValue={company}
              saveOnlyValue
            />

            <Col xs={12} md={6}>
              <div className="mb-0">
                <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                  <span className={`fw-bold`}>Start date :</span>
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
                    placeholder="Pick date"
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
            </Col>

            <Col xs={12} md={6}>
              <div className="mb-0">
                <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                  <span className={`fw-bold`}>End date :</span>
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
                    placeholder="Pick date"
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
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="w-100">
          <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-6">
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-custom-blue-dark text-white"
              onClick={closeModal}
            >
              <span className="indicator-label">Retour</span>
            </button>
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-custom-purple-dark text-white"
              disabled={isLoading}
              onClick={handleSubmit(handleUpdateAd)}
            >
              {!isLoading && <span className="indicator-label">Update</span>}
              {isLoading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  Please wait...
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

export default UpdateAds;
