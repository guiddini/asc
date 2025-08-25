import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JobsReducer, UserResponse } from "../../types/reducers";
import { Link, useParams } from "react-router-dom";
import { Col, Row, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { applyToJobApi, getOneJobOfferApi } from "../../apis";
import { addJob } from "../../features/jobsSlice";
import { Dropzone } from "../../components";
import toast from "react-hot-toast";
import { useCompany } from "../../hooks";
import { Company } from "../../types/user";
import SelectedMedia from "../home/components/selected-media";
import { useMutation } from "react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { errorMessage } from "../../helpers/errorMessage";
import { t } from "i18next";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import getMediaUrl from "../../helpers/getMediaUrl";

const schema = yup.object().shape({
  user_website: yup
    .string()
    .typeError("Le site Web doit être une URL valide")
    .notRequired(),
  user_cv: yup.mixed().required("Le CV est requis"),
  user_phone_number: yup
    .string()
    .matches(/^[0-9]{10}$/, t(`completeProfile.validation.phone.matches`))
    .required(t(`completeProfile.validation.phone.required`)),
});

export const JobOfferDetailPage = () => {
  const { jobID } = useParams();
  const { user } = useSelector((state: UserResponse) => state.user);
  const jobs = useSelector((state: JobsReducer) => state.jobs.jobs);
  const [fetching, setFetching] = useState<boolean>(false);
  const job = jobs.find((job) => Number(job.id) === Number(jobID));
  const dispatch = useDispatch();

  useEffect(() => {
    const getJobs = async () => {
      setFetching(true);
      await getOneJobOfferApi(jobID)
        .then((res) => {
          dispatch(addJob(res?.data));
          setFetching(false);
        })
        .catch((err) => {
          setFetching(false);
        });
    };

    if (jobs.length === 0 || job === undefined) getJobs();
  }, [jobID, job]);

  const {
    formState: { errors },
    setValue,
    watch,
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      user_cv: null,
      user_phone_number: user?.info?.phone,
    },
    resolver: yupResolver(schema),
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setValue("user_cv", file);
  };

  const { MEMORIZED_COMPANIES } = useCompany();

  const company: Company = MEMORIZED_COMPANIES?.find(
    (company) => company.id === job?.company_id
  );

  const user_cv: any = watch("user_cv");

  const { mutate, isLoading } = useMutation({
    mutationKey: ["apply-for-job", jobID],
    mutationFn: async (data: {
      company_job_offer_id: string | number;
      user_website: string;
      user_cv: File;
      user_phone_number: string | number;
    }) => await applyToJobApi(data),
  });

  const handleApplyToJob = async (data: {
    user_website: string;
    user_cv: File;
    user_phone_number: string | number;
  }) => {
    mutate(
      {
        ...data,
        company_job_offer_id: jobID,
      },
      {
        onSuccess(data, variables, context) {
          toast.success("Votre candidature a été envoyée avec succès");
        },
        onError(error, variables, context) {
          toast.error(
            "Une erreur est survenue lors de l'envoi de votre candidature"
          );
        },
      }
    );
  };

  return (
    <div
      className="content d-flex flex-column flex-column-fluid"
      id="kt_content"
    >
      <div id="kt_content_container" className="container-xxl">
        {fetching ? (
          <div
            style={{
              height: "70vh",
            }}
            className="w-100 d-flex justify-content-center align-items-center bg-white"
          >
            <Spinner animation="border" color="#000" />
          </div>
        ) : (
          <div className="card">
            <PageTitle>{job?.name}</PageTitle>
            <div className="card-body pb-0">
              <div className="position-relative">
                <div className="overlay overlay-show">
                  <div
                    className="bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-250px"
                    style={{
                      backgroundImage: `url(${toAbsoluteUrl(
                        "media/afes/job-cover.jpg"
                      )})`,
                    }}
                  ></div>
                  <div
                    className="overlay-layer rounded bg-black"
                    style={{
                      opacity: "0.5",
                    }}
                  ></div>
                </div>
                <div className="position-absolute text-white mb-8 ms-10 bottom-0">
                  <div className="w-100 d-flex flex-row align-items-center gap-3">
                    <img
                      src={getMediaUrl(company?.logo)}
                      alt={`${job?.company_id}-logo`}
                      className="w-60px rounded-circle"
                    />
                    <div>
                      <h3 className="text-white fs-2qx fw-bold mb-3 m">
                        {job?.name}
                      </h3>
                      <div className="fs-5 fw-semibold shadow-sm">
                        Offre d'emploi proposée par{" "}
                        <Link
                          className="text-white fw-bold text-hover-primary text-decoration-underline"
                          to={`/company/${job?.company_id}`}
                        >
                          {company?.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Row xs={12} md={12} lg={12} className="mt-5">
                <Col
                  xs={12}
                  md={6}
                  lg={6}
                  className="w-100 mb-7 bg-light p-8 rounded-3"
                >
                  <div>
                    <h2 className="fs-1 text-gray-800 w-bolder mb-6">
                      A propos de l'offre d'emploi
                    </h2>
                    <p
                      className="fw-semibold fs-6 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: job?.description,
                      }}
                    />
                  </div>
                  <div className="w-100 d-flex flex-row align-items-start justify-content-between gap-4 flex-wrap pt-8">
                    {job?.work_skills?.length > 0 && (
                      <div className="">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Compétences
                        </h4>
                        <div className="my-2">
                          {job?.work_skills?.map((term, index) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={index}
                            >
                              <span className="bullet me-3"></span>
                              <div className="text-gray-600 fw-semibold fs-6">
                                {term}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job?.work_requirements?.length > 0 && (
                      <div className="">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Les exigences
                        </h4>
                        <div className="my-2">
                          {job?.work_requirements?.map((req, index) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={index}
                            >
                              <span className="bullet me-3"></span>
                              <div className="text-gray-600 fw-semibold fs-6">
                                {req}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job?.work_benefits?.length > 0 && (
                      <div className="">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Les avantages
                        </h4>
                        <div className="my-2">
                          {job?.work_benefits?.map((term, index) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={index}
                            >
                              <span className="bullet me-3"></span>
                              <div className="text-gray-600 fw-semibold fs-6">
                                {term}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job?.application_terms?.length > 0 && (
                      <div className="">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Les conditions
                        </h4>
                        <div className="my-2">
                          {job?.application_terms?.map((term, index) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={index}
                            >
                              <span className="bullet me-3"></span>
                              <div className="text-gray-600 fw-semibold fs-6">
                                {term}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {job?.work_roles?.length > 0 && (
                      <div className="">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Responsabilités
                        </h4>
                        <div className="my-2">
                          {job?.work_roles?.map((term, index) => (
                            <div
                              className="d-flex align-items-center mb-3"
                              key={index}
                            >
                              <span className="bullet me-3"></span>
                              <div className="text-gray-600 fw-semibold fs-6">
                                {term}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Col>

                <Col xs={12} md={12} lg={12} className="flex-lg-row-fluid mt-4">
                  <form
                    className="form mb-15"
                    id="kt_careers_form"
                    onSubmit={handleSubmit(handleApplyToJob)}
                  >
                    <Row className="mb-5">
                      <Col xs={12} md={6}>
                        <Row>
                          <Col
                            xs={12}
                            md={6}
                            className="d-flex flex-column mb-5 fv-row"
                          >
                            <label className="fs-5 fw-semibold mb-2">
                              Numéro de téléphone
                            </label>
                            <input
                              className="form-control form-control-solid"
                              type="number"
                              name="user_phone_number"
                              {...register("user_phone_number")}
                            />
                            {errorMessage(errors, "user_phone_number")}
                          </Col>

                          <Col
                            xs={12}
                            md={6}
                            className="d-flex flex-column mb-5 fv-row"
                          >
                            <label className="fs-5 fw-semibold mb-2">
                              Portfolio
                            </label>
                            <input
                              className="form-control form-control-solid"
                              placeholder=""
                              name="website"
                              {...register("user_website")}
                            />
                            {errorMessage(errors, "user_website")}
                          </Col>
                        </Row>
                      </Col>

                      <Col xs={12} md={6}>
                        <Col
                          xs={12}
                          md={12}
                          className="d-flex flex-column mb-5 fv-row"
                        >
                          <label className="fs-5 fw-semibold mb-2">CV</label>
                          <Dropzone
                            dropzone={{
                              accept: {
                                "application/pdf": [],
                              },
                              multiple: false,
                              onDrop: onDrop,
                              onError(err) {},
                              onDropRejected(fileRejections, event) {
                                fileRejections?.forEach((file) => {
                                  toast.error(
                                    `Le fichier sélectionné n'est pas supporté`
                                  );
                                });
                              },
                            }}
                            description="PDF seulement !"
                          />

                          {errorMessage(errors, "user_cv")}

                          {user_cv !== null &&
                            user_cv?.type === "application/pdf" && (
                              <div className="w-100 mt-8">
                                <SelectedMedia
                                  file={user_cv as any}
                                  remove={(e) => {
                                    e?.preventDefault();
                                    setValue("user_cv", null);
                                  }}
                                />
                              </div>
                            )}
                        </Col>
                      </Col>
                    </Row>

                    <div className="separator mb-8"></div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="kt_careers_submit_button"
                    >
                      {!isLoading && (
                        <span className="indicator-label">Postuler</span>
                      )}
                      {isLoading && (
                        <span
                          className="indicator-progress"
                          style={{ display: "block" }}
                        >
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                      {/* <span className="indicator-progress">
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span> */}
                    </button>
                  </form>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
