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
    { label: "Public", value: "public" },
    { label: "Ministere", value: "ministere" },
    { label: "Association", value: "association" },
    { label: "Organisme", value: "organisme" },
  ];

  const participationGoals = [
    { label: "Networking", value: "networking" },
    { label: "Find Investors", value: "investors" },
    { label: "Partnerships", value: "partnerships" },
    { label: "Learning", value: "learning" },
  ];

  const defaultActivitiesAreas = user.activity_areas?.map((a) => ({
    label: a?.label_fr,
    value: a?.id,
  }));

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
    job_title: user.info?.job_title || "",
    company: user.info?.company || "",
    participation_goal: user.info?.participation_goal || "",
    about_me: user.info?.about_me || "",
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
    if (reset) reset(defaultValues);
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
  const is_algeria = watch("country")?.label === "Algérie";

  const handleUpdate = async (data) => {
    const formdata = new FormData();
    formdata.append("user_id", user?.id);

    if (typeof data?.avatar !== "string") {
      formdata.append("avatar", data.avatar);
    }

    data?.country && formdata.append("country_id", data.country?.value);

    if (is_algeria) {
      data?.wilaya?.value && formdata.append("wilaya_id", data.wilaya?.value);
      data?.commune?.value &&
        formdata.append("commune_id", data.commune?.value);
    }

    formdata.append("phone", data.phone);
    formdata.append("fname", data.fname);
    formdata.append("lname", data.lname);
    formdata.append("type", data.type);
    formdata.append("address", data.address);

    formdata.append("job_title", data.job_title);
    formdata.append("company", data.company);
    formdata.append("participation_goal", data.participation_goal);
    formdata.append("about_me", data.about_me);

    if (user_type === "institution") {
      data?.institution_type?.value &&
        formdata.append("institution_type", data?.institution_type?.value);
      formdata.append("institution_name", data?.institution_name);
    }

    if (user_type === "student") {
      formdata.append("university_id", data.university?.value);
      data?.foreign_university &&
        formdata.append("foreign_university", data.foreign_university);
    }

    if (user_type === "corporate" || user_type === "independant") {
      data?.occupation_id?.value &&
        data?.occupation_id?.value !== 0 &&
        formdata.append("occupation_id", data?.occupation_id?.value);

      if (data?.occupation_id?.value !== 0) {
        formdata.append("occupation", null);
      } else {
        formdata.append("occupation", data?.occupation);
      }

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
            {/* Avatar */}
            {/* ... reste de ton code pour avatar et info basiques ... */}

            {/* Job Title */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Job Title
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Job Title"
                  {...register("job_title")}
                />
                {errorMessage(errors, "job_title")}
              </div>
            </div>

            {/* Company */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Company
              </label>
              <div className="col-lg-8 fv-row">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Company"
                  {...register("company")}
                />
                {errorMessage(errors, "company")}
              </div>
            </div>

            {/* Participation Goals */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                Participation Goals
              </label>
              <div className="col-lg-8 fv-row">
                <SelectComponent
                  control={control as any}
                  data={participationGoals}
                  errors={errors}
                  label="Participation Goals"
                  name="participation_goal"
                  colXS={12}
                  colMD={6}
                  noOptionMessage="No goals found"
                  required
                />
              </div>
            </div>

            {/* About Me */}
            <div className="row mb-6">
              <label className="col-lg-4 col-form-label fw-bold fs-6">
                About Me
              </label>
              <div className="col-lg-8 fv-row">
                <textarea
                  className="form-control form-control-lg form-control-solid"
                  placeholder="Tell us about yourself..."
                  rows={4}
                  {...register("about_me")}
                />
                {errorMessage(errors, "about_me")}
              </div>
            </div>
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
