import React, { useMemo } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  CommuneSelect,
  CountriesSelect,
  SelectComponent,
  WillayasSelect,
} from "../../../components";
import { getUserDataApi, updateUserApi } from "../../../apis";
import { useEffect } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { Modal } from "react-bootstrap";
import { useUser } from "../../../hooks";
import getMediaUrl from "../../../helpers/getMediaUrl";

interface CreateUserModalProps {
  setUserID: (USER: any) => void;
  userID: string | number | null;
  refetch: () => void;
}

type selectProps = {
  label: string;
  value: string | number;
};

interface FormData {
  user_id: string;
  avatar?: File | string;
  country_id?: string | selectProps;
  wilaya_id?: string | selectProps;
  commune_id?: string | selectProps;
  phone: string;
  type: string;
  address: string;
  university_id: selectProps | string;
  foreign_university?: string | null;
  occupation_id: string | selectProps;
  occupation?: string;
  activity_area_ids?: string[] | null;
  fname: string;
  lname: string;
  email: string;
  institution_name: string;
  institution_occupation: string;
}

const UpdateUserModal: React.FC<CreateUserModalProps> = ({
  setUserID,
  userID,
  refetch,
}) => {
  const {
    isLoading,
    data,
    mutate: getUserData,
  } = useMutation({
    mutationKey: ["get-USER-data", userID],
    mutationFn: async () => await getUserDataApi(String(userID)),
  });

  useEffect(() => {
    if (userID !== null) {
      getUserData();
    }
  }, [userID]);

  const USER: any = useMemo(() => {
    if (!isLoading) {
      return data?.data?.user;
    }
  }, [userID]);

  const {
    loadingActivities,
    loadingOccupations,
    MEMORIZED_ACTIVITIES,
    MEMORIZED_OCCUPATIONS,
    MEMORIZED_UNIVERSITIES,
  } = useUser();

  const defaultValues = {
    avatar: USER?.avatar,
    fname: USER?.fname,
    lname: USER?.lname,
    email: USER?.email,
    phone: USER?.info?.phone,
    country_id: USER?.info?.country,
    wilaya_id: USER?.info?.wilaya_id,
    commune_id: USER?.info?.commune_id,
    address: USER?.info?.address,
    type: USER?.info?.type,
    university_id: USER?.info?.university_id,
    foreign_university: USER?.info?.foreign_university,
    occupation: USER?.info?.occupation,
    occupation_id: MEMORIZED_OCCUPATIONS?.find(
      (o) => o.value === Number(USER?.info?.occupation_id)
    ),
    institution_name: USER?.info?.institution_name,
    institution_occupation: USER?.info?.institution_occupation,
    activity_area_ids: USER?.info?.activity_area_ids
      ? USER?.info?.activity_area_ids
      : [],
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    watch,
    reset,
    setValue,
  } = useForm<FormData>({
    defaultValues: defaultValues,
  });

  const institutions = [
    {
      label: "Public",
      value: "public",
    },
    {
      label: "Ministere",
      value: "ministere",
    },
    {
      label: "Association",
      value: "association",
    },
    {
      label: "Organisme",
      value: "organisme",
    },
  ];

  // const is_other_occupation = watch("info.occupation_id") === String(0);
  const country = watch("country_id");

  const is_algeria =
    typeof country === "string" ? false : country?.label === "Algérie";
  const willaya_id = watch("wilaya_id") || null;
  const occupation = MEMORIZED_OCCUPATIONS?.find(
    (o) => o.value === Number(USER?.info?.occupation_id)
  );

  const { mutate, isLoading: updating } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: any) => await updateUserApi(data),
  });

  useEffect(() => {
    if (reset) {
      reset(defaultValues);
    }
  }, [reset]);

  const logo_image = useMemo(() => {
    if (USER) {
      const watchedImage = watch("avatar");

      if (watchedImage) {
        switch (typeof watchedImage) {
          case "string":
            return getMediaUrl(watchedImage);
          default:
            return URL?.createObjectURL(watchedImage);
        }
      }
    }
  }, [watch("avatar"), USER?.id]);

  const handleUpdate = async (data) => {
    const formdata = new FormData();
    formdata.append("user_id", USER?.id);
    typeof data?.avatar !== "string" && formdata.append("avatar", data.avatar);
    data?.country !== null &&
      formdata.append("country_id", data.country?.value);
    data?.wilaya !== null && formdata.append("wilaya_id", data.wilaya?.value);
    data?.commune !== null &&
      formdata.append("commune_id", data.commune?.value);

    formdata.append("phone", data.phone);
    formdata.append("type", data.type);
    formdata.append("address", data.address);
    formdata.append("university_id", data.university_id);
    data?.foreign_university !== null &&
      formdata.append("foreign_university", data.foreign_university);
    data?.occupation_id !== null &&
      formdata.append("occupation_id", data.occupation_id?.value);
    data?.occupation !== null && formdata.append("occupation", data.occupation);
    data?.activity_area_ids !== null &&
      data?.activity_area_ids?.forEach((element, i) => {
        formdata.append(`activity_area_ids[${i}]`, element);
      });

    mutate(formdata, {
      onSuccess(data, variables, context) {},
    });
  };

  const closeModal = () => setUserID(null);

  return (
    <Modal
      show={userID !== null ? true : false}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="fw-bolder">Update User</h2>

          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-1" />
          </div>
        </div>
        <Modal.Body className="p-12">
          {!isLoading ? (
            <Row xs={12} md={12}>
              <form onSubmit={handleSubmit(handleUpdate)} className="form">
                <div className="card-body border-top p-9">
                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      Avatar
                    </label>
                    <div className="col-lg-8">
                      <div
                        className="image-input image-input-outline"
                        data-kt-image-input="true"
                      >
                        <div className="symbol symbol-100px w-100 bg-light overlay">
                          <div
                            className="image-input-wrapper w-125px h-125px"
                            style={{
                              backgroundImage: `url(${logo_image})`,
                            }}
                          ></div>

                          <div className="overlay-layer card-rounded bg-dark bg-opacity-25">
                            <label htmlFor="company_logo">
                              <span
                                className="btn btn-primary d-flex align-items-center justify-content-center"
                                style={{
                                  padding: "0.5rem",
                                }}
                              >
                                <i className="ki-duotone ki-pencil p-0">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                </i>
                              </span>

                              <input
                                type="file"
                                name="file"
                                id="company_logo"
                                accept="image/png, image/jpg, image/jpeg"
                                className="btn btn-primary"
                                onChange={(e) =>
                                  setValue("avatar", e.target.files[0])
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Full Name
                    </label>

                    <div className="col-lg-8">
                      <div className="row">
                        <div className="col-lg-6 fv-row">
                          <input
                            type="text"
                            className="form-control form-control-lg form-control-solid mb-3 mb-lg-0"
                            placeholder="First name"
                            {...register("fname")}
                          />
                        </div>

                        <div className="col-lg-6 fv-row">
                          <input
                            type="text"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="Last name"
                            {...register("lname")}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label required fw-bold fs-6">
                      Email
                    </label>

                    <div className="col-lg-8 fv-row">
                      <input
                        type="email"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Email"
                        {...register("email")}
                      />
                    </div>
                  </div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Phone</span>
                    </label>

                    <div className="col-lg-8 fv-row">
                      <input
                        type="tel"
                        className="form-control form-control-lg form-control-solid"
                        placeholder="Phone number"
                        {...register("phone")}
                      />
                    </div>
                  </div>

                  <div className="separator mb-4"></div>

                  <div className="row mb-6">
                    <label className="col-lg-4 col-form-label fw-bold fs-6">
                      <span className="required">Address</span>
                    </label>

                    <div className="col-lg-8 fv-row">
                      <Row>
                        <CountriesSelect
                          control={control as any}
                          errors={errors}
                          colMD={6}
                          colXS={6}
                        />

                        {is_algeria && (
                          <>
                            <WillayasSelect
                              control={control as any}
                              errors={errors}
                              colMD={6}
                              colXS={6}
                            />

                            <CommuneSelect
                              willaya_id={
                                typeof willaya_id === "string"
                                  ? willaya_id
                                  : willaya_id?.value
                              }
                              control={control as any}
                              errors={errors}
                              colMD={6}
                              colXS={6}
                              key={willaya_id as any}
                            />
                          </>
                        )}

                        <Col className="mt-2">
                          <label className="fw-bold fs-6">
                            <span className="required">Address</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="Address"
                            {...register("address")}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>

                  {/* type institution => institution type,institution_name,institution_occupation */}
                  {USER?.info?.type === "institution" && (
                    <>
                      <div className="separator mb-4"></div>
                      <div className="row mb-6">
                        <label className="col-lg-4 col-form-label fw-bold fs-6">
                          <span className="required">Institution</span>
                        </label>

                        <div className="col-lg-8 fv-row">
                          <Row>
                            <SelectComponent
                              control={control as any}
                              data={institutions}
                              errors={errors}
                              label="Institution type"
                              name="institution_type"
                              colXS={12}
                              colMD={6}
                              defaultValue={institutions?.find(
                                (e) => e.value === USER?.info?.institution_type
                              )}
                              noOptionMessage="No type found"
                              saveOnlyValue
                              required
                            />

                            <Col className="mt-2">
                              <label className="fw-bold fs-6">
                                <span className="required">
                                  Institution name
                                </span>
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-lg form-control-solid"
                                placeholder="Institution name"
                                {...register("institution_name")}
                              />
                            </Col>

                            <Col className="mt-2">
                              <label className="fw-bold fs-6">
                                <span className="required">
                                  Institution occupation
                                </span>
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-lg form-control-solid"
                                placeholder="Institution occupation"
                                {...register("institution_occupation")}
                              />
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </>
                  )}

                  {/* type student => university_id,foreign_university */}
                  {USER?.info?.type === "student" && (
                    <>
                      <div className="separator mb-4"></div>
                      <div className="row mb-6">
                        <label className="col-lg-4 col-form-label fw-bold fs-6">
                          <span className="required">Student</span>
                        </label>

                        <div className="col-lg-8 fv-row">
                          <Row>
                            <SelectComponent
                              control={control as any}
                              data={MEMORIZED_UNIVERSITIES}
                              errors={errors}
                              label="University"
                              name="university_id"
                              colXS={12}
                              colMD={6}
                              defaultValue={MEMORIZED_UNIVERSITIES?.find(
                                (e) => e.value === USER?.info?.university_id
                              )}
                              noOptionMessage="No type found"
                              saveOnlyValue
                              required
                            />

                            {watch("university_id") &&
                              typeof watch("university_id") === "object" &&
                              (watch("university_id") as selectProps).value && (
                                <Col className="mt-2">
                                  <label className="fw-bold fs-6">
                                    <span className="required">
                                      Foreign university
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg form-control-solid"
                                    placeholder="Foreign university"
                                    {...register("foreign_university")}
                                  />
                                </Col>
                              )}
                          </Row>
                        </div>
                      </div>
                    </>
                  )}

                  {/* type exhibitor/independant => activity_area_ids,occupation_id */}
                  {(USER?.info?.type === "independant" ||
                    USER?.info?.type === "corporate") && (
                    <>
                      <div className="separator mb-4"></div>
                      <div className="row mb-6">
                        <label className="col-lg-4 col-form-label fw-bold fs-6">
                          <span className="required">Corporate</span>
                        </label>

                        <div className="col-lg-8 fv-row">
                          <Row>
                            <SelectComponent
                              control={control as any}
                              data={MEMORIZED_ACTIVITIES}
                              errors={errors}
                              label="Activity"
                              name="activity_area_ids"
                              colXS={12}
                              colMD={6}
                              isLoading={loadingActivities}
                              noOptionMessage="No activity_area_ids"
                              saveOnlyValue
                              required
                              isMulti
                              maxLimit={5}
                            />

                            {occupation && (
                              <SelectComponent
                                control={control as any}
                                data={MEMORIZED_OCCUPATIONS}
                                errors={errors}
                                defaultValue={occupation}
                                label="Occupation"
                                name="occupation_id"
                                colXS={12}
                                colMD={6}
                                isLoading={loadingOccupations}
                                noOptionMessage="no occupation_id"
                                // saveOnlyValue
                                required
                              />
                            )}

                            {watch("occupation_id") &&
                              typeof watch("occupation_id") === "object" &&
                              (watch("occupation_id") as selectProps).value ===
                                0 && (
                                <Col className="mt-2">
                                  <label className="fw-bold fs-6">
                                    <span className="required">
                                      Occupation name
                                    </span>
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control form-control-lg form-control-solid"
                                    placeholder="Occupation name"
                                    {...register("occupation")}
                                  />
                                </Col>
                              )}
                          </Row>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="card-footer d-flex justify-content-end py-6 px-9">
                  <button type="submit" className="btn btn-primary">
                    {!isLoading && "Save Changes"}
                    {isLoading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        Please wait...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </Row>
          ) : (
            <div
              style={{
                height: "50vh",
              }}
              className="w-100 d-flex justify-content-center align-items-center bg-white"
            >
              <Spinner animation="border" color="#000" />
            </div>
          )}
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
              disabled={updating}
              onClick={handleSubmit(handleUpdate)}
            >
              {!updating && <span className="indicator-label">Update</span>}
              {updating && (
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

export default UpdateUserModal;
