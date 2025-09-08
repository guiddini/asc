import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "../../../../hooks";
import getMediaUrl from "../../../../helpers/getMediaUrl";
import {
  CommuneSelect,
  CountriesSelect,
  SelectComponent,
  WillayasSelect,
} from "../../../../components";
import { Col, Row, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import { updateUserApi } from "../../../../apis";
import toast from "react-hot-toast";
import { errorResponse } from "../../../../types/responses";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProfileSchema } from "../validation/updateProfileSchema";
import { errorMessage } from "../../../../helpers/errorMessage";
import { compressImage } from "../../../../utils/compress-image";

type selectProps = {
  label: string;
  value: string | number;
};

const InfoSettings = ({ user }: { user: any }) => {
  const {
    loadingActivities,
    loadingOccupations,
    MEMORIZED_ACTIVITIES,
    MEMORIZED_OCCUPATIONS,
    MEMORIZED_UNIVERSITIES,
  } = useUser();

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

  const defaultActivitiesAreas = user.activity_areas?.map((a) => {
    return {
      label: a?.label_fr,
      value: a?.id,
    };
  });

  const defaultCountry = {
    label: user?.info?.country?.name_fr,
    value: user?.info?.country?.id,
  };
  const is_occupation_name =
    user?.info?.occupation === null || user?.info?.occupation === "null";

  const defaultOccupation = {
    label: !is_occupation_name
      ? "Autre"
      : user?.info?.occupationFound?.label_fr,
    value: !is_occupation_name ? 0 : user?.info?.occupationFound?.id,
  };

  const defaultCommune = {
    label: user?.info?.commune?.name,
    value: user?.info?.commune?.id,
  };

  const defaultWillaya = {
    label: user?.info?.wilaya?.name,
    value: user?.info?.wilaya?.id,
  };

  const is_other_university = user?.info?.university_id === null;

  const defaultUniversity = {
    label: user?.info?.university?.name || "Autre",
    value: user?.info?.university?.id || 0,
  };

  const defaultInstitution = institutions?.find(
    (e) => e.value === user?.info?.institution_type
  );

  const defaultValues = {
    avatar: user.avatar,
    fname: user.fname,
    lname: user.lname,
    email: user.email,
    phone: user.info?.phone,
    country: defaultCountry,
    wilaya: defaultWillaya,
    commune: defaultCommune,
    address: user.info?.address,
    type: user.info?.type,
    university: defaultUniversity,
    university_id: user?.info?.university_id,
    foreign_university: user.info?.foreign_university,
    occupation: user.info?.occupation,
    occupation_id: defaultOccupation,
    institution_type: defaultInstitution,
    institution_name: user.info?.institution_name,
    activity_area_ids: defaultActivitiesAreas,
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    watch,
    reset,
    setValue,
  } = useForm<any>({
    defaultValues: defaultValues as any,
    resolver: yupResolver(updateProfileSchema),
  });

  const willaya_id = watch("wilaya")?.value || null;

  const occupation = MEMORIZED_OCCUPATIONS?.find(
    (o) => o.value === Number(user?.info?.occupation_id)
  );

  const { mutate, isLoading } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (data: any) => await updateUserApi(data),
  });

  useEffect(() => {
    if (reset) {
      reset(defaultValues);
    }
  }, [reset]);

  const logo_image = useMemo(() => {
    if (user) {
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
  }, [watch("avatar"), user?.id]);

  const user_type = user.info?.type;

  const is_algeria = watch("country")?.label === "Algérie" ? true : false;

  const handleUpdate = async (data) => {
    const formdata = new FormData();
    formdata.append("user_id", user?.id);
    if (typeof data?.avatar !== "string") {
      // const compressedImage: any = await compressImage(data.avatar);
      formdata.append("avatar", data.avatar);
    }

    data?.country !== null &&
      formdata.append("country_id", data.country?.value);
    if (is_algeria) {
      data?.wilaya?.value !== null &&
        formdata.append("wilaya_id", data.wilaya?.value);
      data?.commune?.value !== null &&
        formdata.append("commune_id", data.commune?.value);
    }

    formdata.append("phone", data.phone);
    formdata.append("fname", data.fname);
    formdata.append("lname", data.lname);
    formdata.append("type", data.type);
    formdata.append("address", data.address);

    if (user_type === "institution") {
      data?.institution_type?.value !== null &&
        formdata.append("institution_type", data?.institution_type?.value);
      formdata.append("institution_name", data?.institution_name);
    }

    if (user_type === "student") {
      formdata.append("university_id", data.university?.value);
      data?.foreign_university !== null &&
        formdata.append("foreign_university", data.foreign_university);
    }

    if (user_type === "corporate" || user_type === "independant") {
      data?.occupation_id !== null &&
        data?.occupation_id?.value !== 0 &&
        formdata.append("occupation_id", data?.occupation_id?.value);

      if (data?.occupation_id?.value !== 0) {
        formdata.append("occupation", null);
      } else {
        formdata.append("occupation", data?.occupation);
      }
      data?.activity_area_ids !== null &&
        data?.activity_area_ids?.forEach((element, i) => {
          formdata.append(`activity_area_ids[${i}]`, element?.value);
        });
    }
    mutate(formdata, {
      onSuccess() {
        toast.success("Le profil a été mis à jour avec succès");
      },
      onError(error: errorResponse) {
        toast.error(
          `Erreur de mise à jour du profil ${error?.response?.data?.message}`
        );
      },
    });
  };

  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_profile_details"
        aria-expanded="true"
        aria-controls="kt_account_profile_details"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">Profile Details</h3>
        </div>
      </div>

      <div id="kt_account_profile_details" className="collapse show">
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
              {errorMessage(errors, "avatar")}
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
                      placeholder="First Name"
                      {...register("fname")}
                    />
                    {errorMessage(errors, "fname")}
                  </div>

                  <div className="col-lg-6 fv-row">
                    <input
                      type="text"
                      className="form-control form-control-lg form-control-solid"
                      placeholder="Last Name"
                      {...register("lname")}
                    />
                    {errorMessage(errors, "lname")}
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
                  disabled
                  className="form-control form-control-lg form-control-solid disabled"
                  placeholder="email address"
                  {...register("email")}
                />
                {errorMessage(errors, "email")}
              </div>
            </div>

            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">Phone Number</span>
              </label>

              <div className="col-lg-8 fv-row">
                <input
                  type="tel"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Phone Number"
                  {...register("phone")}
                />
                {errorMessage(errors, "phone")}
              </div>
            </div>
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                <span className="required">Interests</span>
              </label>

              <SelectComponent
                control={control as any}
                data={MEMORIZED_ACTIVITIES}
                errors={errors}
                label="Interests"
                name="activity_area_ids"
                colXS={12}
                colMD={6}
                isLoading={loadingActivities}
                noOptionMessage="No activity_area_ids"
                required
                isMulti
                defaultValue={defaultActivitiesAreas}
              />
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
                    defaultValue={defaultCountry}
                  />

                  {is_algeria && (
                    <>
                      <WillayasSelect
                        control={control as any}
                        errors={errors}
                        colMD={6}
                        colXS={6}
                        defaultValue={defaultWillaya}
                      />

                      <CommuneSelect
                        willaya_id={willaya_id}
                        control={control as any}
                        errors={errors}
                        colMD={6}
                        colXS={6}
                        key={String(willaya_id)}
                        defaultValue={defaultCommune}
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
                    {errorMessage(errors, "address")}
                  </Col>
                </Row>
              </div>
            </div>

            {/* type institution => institution type,institution_name,institution_occupation */}
            {user?.info?.type === "institution" && (
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
                        label="Institution Type"
                        name="institution_type"
                        colXS={12}
                        colMD={6}
                        defaultValue={defaultInstitution}
                        noOptionMessage="No type found"
                        required
                      />

                      <Col className="mt-2">
                        <label className="fw-bold fs-6">
                          <span className="required">Institution Name</span>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg form-control-solid"
                          placeholder="Institution Name"
                          {...register("institution_name")}
                        />
                        {errorMessage(errors, "institution_name")}
                      </Col>
                    </Row>
                  </div>
                </div>
              </>
            )}

            {/* type student => university_id,foreign_university */}
            {user?.info?.type === "student" && (
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
                        defaultValue={defaultUniversity}
                        noOptionMessage="No type found"
                        required
                      />

                      {is_other_university && (
                        <Col className="mt-2">
                          <label className="fw-bold fs-6">
                            <span className="required">
                              International University
                            </span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg form-control-solid"
                            placeholder="Université étrangère"
                            {...register("foreign_university")}
                          />
                          {errorMessage(errors, "foreign_university")}
                        </Col>
                      )}
                    </Row>
                  </div>
                </div>
              </>
            )}

            {/* type exhibitor/independant => activity_area_ids,occupation_id */}
            {(user?.info?.type === "independant" ||
              user?.info?.type === "corporate") && (
              <>
                <div className="separator mb-4"></div>
                <div className="row mb-6">
                  <label className="col-lg-4 col-form-label fw-bold fs-6">
                    <span className="required">Company</span>
                  </label>

                  <div className="col-lg-8 fv-row">
                    <Row>
                      {occupation && (
                        <SelectComponent
                          control={control as any}
                          data={MEMORIZED_OCCUPATIONS}
                          errors={errors}
                          defaultValue={defaultOccupation}
                          label="Occupation"
                          name="occupation_id"
                          colXS={12}
                          colMD={6}
                          isLoading={loadingOccupations}
                          noOptionMessage="no occupation_id"
                          //
                          required
                        />
                      )}

                      {watch("occupation_id") &&
                        typeof watch("occupation_id") === "object" &&
                        (watch("occupation_id") as selectProps).value === 0 && (
                          <Col className="mt-2">
                            <label className="fw-bold fs-6">
                              <span className="required">Occupation Name</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-lg form-control-solid"
                              placeholder="Nom de l'occupation"
                              {...register("occupation")}
                            />
                            {errorMessage(errors, "occupation")}
                          </Col>
                        )}
                    </Row>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="card-footer d-flex justify-content-end py-6 px-9">
            <button
              type="submit"
              className="btn btn-custom-purple-dark text-white"
            >
              {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InfoSettings;
