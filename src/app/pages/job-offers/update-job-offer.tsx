import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getOneJobOfferApi, updateJobOfferApi } from "../../apis";
import { useForm } from "react-hook-form";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  CommuneSelect,
  InputComponent,
  SelectComponent,
  TextEditor,
  WillayasSelect,
} from "../../components";
import { errorMessage } from "../../helpers/errorMessage";
import WorkRequirement from "./components/create-job-offer-steps/work-requirement";
import { Step4, Step5, Step6, Step7 } from "./components";
import { KTIcon } from "../../../_metronic/helpers";
import clsx from "clsx";
import htmlToDraftBlocks from "../../helpers/htmlToDraftJS";
import { useMutation } from "react-query";
import { Willaya } from "../../types/resources";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import UpdateJobOfferSchema from "./validation/update-job-offer-schema";
import { useSelector } from "react-redux";
import { canEditCompany } from "../../features/userSlice";
import { JobOffer } from "./types/job-offer-type";

interface CustomJobOffer extends JobOffer {
  wilaya: Willaya;
  commune: Willaya;
}

export const UpdateJobOffer = () => {
  const { companyID, jobID } = useParams();
  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, companyID)
  );
  const navigate = useNavigate();
  if (!isCompanyEditor) navigate("/home");
  const [job, setJob] = useState<CustomJobOffer | null>(null);

  // work type
  const work_types = [
    { label: "Temps plein", value: "plein_temps" },
    { label: "Temps partiel", value: "temps_partiel" },
    { label: "Contrat", value: "contrat" },
    { label: "Temporaire", value: "temporaire" },
    { label: "Bénévole", value: "benevole" },
    { label: "Stage", value: "stage" },
  ];

  const default_work_type = work_types?.find(
    (work_type) => work_type?.value === job?.work_type
  );

  // work position type
  const work_position_types = [
    { label: "Sur site", value: "sur_site" },
    { label: "Hybride", value: "hybride" },
    { label: "A distance", value: "a_distance" },
  ];

  const default_work_position_type = work_position_types?.find(
    (work_position_type) => work_position_type?.value === job?.workplace_type
  );

  const defaultWillaya = {
    label: job?.wilaya?.name,
    value: job?.wilaya?.id,
  };

  const defaultCommune = {
    label: job?.commune?.name,
    value: job?.commune?.id,
  };

  const defaultValues = job?.id && {
    emails: job?.application_receipts_emails,
    application_terms: job?.application_terms,
    desc: job?.description === null ? "" : job?.description,
    description:
      job?.description === null ? "" : htmlToDraftBlocks(job?.description),
    name: job?.name,
    work_benefits: job?.work_benefits,
    work_requirements: job?.work_requirements,
    work_roles: job?.work_roles,
    work_skills: job?.work_skills,
    work_type: default_work_type,
    workplace_address: job?.workplace_address,
    wilaya: defaultWillaya,
    workplace_type: default_work_position_type,
    email: "",
    commune: defaultCommune,
  };

  useEffect(() => {
    const getJobs = async () => {
      await getOneJobOfferApi(jobID)
        .then((res) => {
          setJob(res?.data);
        })
        .catch((err) => {});
    };

    getJobs();
  }, [jobID]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: defaultValues,
    resolver: yupResolver(UpdateJobOfferSchema as any),
  });

  const email = watch("email");
  const emails = watch("emails");

  const deleteemail = (indexToDelete) => {
    const newArray = emails.filter((_, index) => index !== indexToDelete);
    setValue("emails", newArray);
  };

  useEffect(() => {
    if (reset) {
      reset(defaultValues);
    }
  }, [reset, job?.id]);

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: FormData) => await updateJobOfferApi(data),
    mutationKey: ["update-job-offer", jobID],
  });

  const handleUpdate = async (data: any) => {
    let formData = new FormData();

    formData.append("name", data.name);
    formData.append("description", data.desc);
    formData.append("joboffer_id", jobID);
    formData.append("workplace_type", data.workplace_type?.value);
    formData.append("workplace_wilaya_id", data.wilaya?.value);

    formData.append("workplace_commune_id", data.commune?.value);

    formData.append("workplace_address", data.workplace_address); // You might want to verify this, as it seems the same as commune_id
    formData.append("work_type", data.work_type?.value);
    if (data.work_requirements?.length > 0) {
      data.work_requirements.forEach((requirement, index) => {
        formData.append(`work_requirements[${index}]`, requirement);
      });
    }

    if (data.work_roles?.length > 0) {
      data.work_roles.forEach((role, index) => {
        formData.append(`work_roles[${index}]`, role);
      });
    }

    if (data.work_benefits?.length > 0) {
      data.work_benefits.forEach((benefit, index) => {
        formData.append(`work_benefits[${index}]`, benefit);
      });
    }
    if (data.application_terms?.length > 0) {
      data.application_terms.forEach((term, index) => {
        formData.append(`application_terms[${index}]`, term);
      });
    }

    if (data?.emails?.length > 0) {
      data.emails.forEach((email, index) => {
        formData.append(`application_receipts_emails[${index}]`, email);
      });
    }

    if (data?.work_skills?.length > 0) {
      data.work_skills.forEach((skill, index) => {
        formData.append(`work_skills[${index}]`, skill);
      });
    }
    formData.append("job_offer_status", job?.job_offer_status);

    mutate(formData, {
      onSuccess(data, variables, context) {
        toast.success("L'offre d'emploi a été modifiée avec succès");
      },
      onError(error, variables, context) {
        toast.error("Erreur lors de l'édition d'une offre d'emploi");
      },
    });
  };

  const wilaya_id = watch("wilaya")?.value;

  return (
    <>
      {job?.id ? (
        <div className="card">
          <div className="card-body p-12">
            <Row>
              <InputComponent
                control={control as any}
                errors={errors}
                label="Intitulé de poste"
                name="name"
                type="text"
                colMD={12}
                colXS={12}
                placeholder="Ajouter le poste pour lequel vous recrutez"
              />

              <SelectComponent
                control={control as any}
                errors={errors}
                data={work_position_types}
                label="Type de lieu de travail"
                name="workplace_type"
                colMD={6}
                colXS={12}
                className="my-2"
                defaultValue={default_work_position_type}
                key={default_work_position_type?.label}
              />

              <SelectComponent
                control={control as any}
                errors={errors}
                data={work_types}
                label="Type d'emploi"
                name="work_type"
                colMD={6}
                colXS={12}
                className="my-2"
                defaultValue={default_work_type}
                key={String(default_work_type)}
              />

              <WillayasSelect
                control={control as any}
                errors={errors}
                colXS={12}
                colMD={6}
                defaultValue={defaultWillaya}
              />

              <CommuneSelect
                willaya_id={wilaya_id}
                control={control as any}
                errors={errors}
                colXS={12}
                colMD={6}
                key={wilaya_id}
                defaultValue={defaultCommune}
              />

              <InputComponent
                control={control as any}
                errors={errors}
                label="Lieu de travail"
                name="workplace_address"
                type="text"
                colMD={12}
                colXS={12}
                className="mt-2"
              />
              <Col xs={12} md={12}>
                <label className="form-label">Description</label>
                <TextEditor
                  control={control as any}
                  name="description"
                  setValue={setValue}
                  withPreview={false}
                  className="min-h-350px mh-350px"
                />

                {errorMessage(errors, "desc")}
              </Col>

              <Col xs={12} md={6} lg={6}>
                <WorkRequirement
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
              </Col>

              <Col xs={12} md={6} lg={6}>
                <Step4
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
              </Col>

              <Col xs={12} md={6} lg={6}>
                <Step5
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
              </Col>

              <Col xs={12} md={6} lg={6}>
                <Step6
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
              </Col>

              <Col xs={12} md={6} lg={6}>
                <Step7
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
              </Col>

              <Col xs={12} md={6} lg={6} className="">
                <div className="m-0">
                  <div
                    className="d-flex align-items-center collapsible py-3 toggle mb-0"
                    data-bs-toggle="collapse"
                    data-bs-target="#emails"
                    aria-expanded="true"
                  >
                    <div className="btn btn-sm btn-icon mw-20px btn-active-color-primary me-5">
                      <i className="ki-duotone ki-minus-square toggle-on text-primary fs-1">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      <i className="ki-duotone ki-plus-square toggle-off fs-1 text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>

                    <h4 className="text-gray-700 fw-bold cursor-pointer mb-0">
                      Réception des candidatures :
                    </h4>
                  </div>
                </div>
                <div className="d-flex flex-column w-100">
                  <div id="emails" className="fs-6 ms-1 collapse hide">
                    <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-4">
                      <InputComponent
                        control={control as any}
                        errors={errors}
                        name={`email`}
                        type="text"
                        colMD={9}
                        colXS={9}
                        className="w-75"
                      />
                      <button
                        type="button"
                        className={clsx(
                          "btn btn-custom-purple-dark text-white w-120px mb-3"
                        )}
                        disabled={emails?.length === 5}
                        onClick={() => {
                          if (emails?.length < 5) {
                            const newArray = [...emails, email]; // Create a new array with the existing emails plus the new email
                            setValue("emails", newArray);
                            setValue("email", "");
                          }
                        }}
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="d-flex flex-column gap-3 mt-3">
                      {emails?.map((email, index) => (
                        <div
                          className="d-flex align-items-center ps-6 mb-n1"
                          key={index}
                        >
                          <span className="bullet me-3"></span>

                          <div className="text-gray-600 fw-semibold fs-5">
                            {email}
                          </div>

                          <span
                            onClick={() => deleteemail(index)}
                            className="ms-auto"
                          >
                            <KTIcon
                              iconName="trash"
                              className="fs-1 cursor-pointer m-0 text-danger"
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="card-footer mt-16">
              <div className="d-flex flex-row align-items-center justify-content-between mt-6">
                <button
                  type="button"
                  className="btn btn-custom-blue-dark text-white"
                  onClick={() => navigate(-1)}
                >
                  <span className="indicator-label">Retour</span>
                </button>
                <button
                  type="button"
                  id="kt_sign_in_submit"
                  className="btn btn-custom-purple-dark text-white"
                  disabled={isLoading}
                  onClick={handleSubmit(handleUpdate)}
                >
                  {!isLoading && (
                    <span className="indicator-label">Mettre à jour</span>
                  )}
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
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            minHeight: "75vh",
          }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <Spinner animation="border" color="#000" />
        </div>
      )}
    </>
  );
};
