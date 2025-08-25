import React from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { KTIcon } from "../../../../_metronic/helpers";
import { Dropzone, InputComponent, SelectComponent } from "../../../components";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { createAdsApi } from "../../../apis";
import Flatpickr from "react-flatpickr";
import { useCompany } from "../../../hooks";
import SelectedMedia from "../../home/components/selected-media";
import moment from "moment";

interface SelectAdsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

interface CreateAdsFormProps {
  name: string;
  image: File;
  company_id: {
    label: string;
    value: string;
  };
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

export const AddAdsModal: React.FC<SelectAdsProps> = ({
  isOpen,
  refetch,
  setIsOpen,
}) => {
  const closeModal = () => setIsOpen(false);

  const { MEMORIZED_COMPANIES, loadingCompanies } = useCompany();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: CreateAdsProps) => {
      return await createAdsApi(data);
    },
    mutationKey: ["create-ads-admin"],
  });

  const {
    control,
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
  } = useForm<CreateAdsProps>({
    defaultValues: {},
  });

  const onDrop = async (file: File[]) => {
    setValue("image", file[0]);
  };

  const start_date = watch("start_date");
  const end_date = watch("end_date");
  const image = watch("image");

  const companies = MEMORIZED_COMPANIES?.map((e) => {
    return {
      label: e.name,
      value: e.id,
    };
  });

  const handleCreateAd = async (data: CreateAdsFormProps) => {
    const req = {
      start_date: moment(data?.start_date).format("YYYY-MM-DD"),
      end_date: moment(data?.end_date).format("YYYY-MM-DD"),
      company_id: data?.company_id?.value,
      name: data?.name,
      link: data?.link,
      image: data?.image,
    };

    mutate(req, {
      onSuccess() {
        toast.success("Ads created successfully");
        refetch();
        closeModal();
      },
      onError() {
        toast.error("Error creating ads");
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
          <h2 className="fw-bolder">Create add :</h2>

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
              label="Company"
              name="company_id"
              noOptionMessage=""
              colMD={12}
              colXS={12}
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
              onClick={handleSubmit(handleCreateAd)}
            >
              {!isLoading && <span className="indicator-label">Create</span>}
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
