import { useRef, useState } from "react";
import { StepperComponent } from "../../../_metronic/assets/ts/components";
import { Modal, Spinner } from "react-bootstrap";
import { KTIcon } from "../../../_metronic/helpers";
import { Step1, Step2, Step3, Step8 } from "./components";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CreateJobOfferSchema from "./validation/create-job-offer-schema";
import { useMutation } from "react-query";
import { createJobOfferApi } from "../../apis";
import { CreateJobOfferProps } from "./types/job-offer-type";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { addJob } from "../../features/jobsSlice";
import { useDispatch, useSelector } from "react-redux";
import { UserResponse } from "../../types/reducers";
import { canEditCompany } from "../../features/userSlice";

export const CreateJobOffer = () => {
  const { companyID } = useParams();
  const isCompanyEditor = useSelector((state) =>
    canEditCompany(state, companyID)
  );
  const navigate = useNavigate();
  if (!isCompanyEditor) navigate("/home");

  const { user } = useSelector((state: UserResponse) => state.user);
  const dispatch = useDispatch();

  const company: any = user?.company;

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      work_requirements: [],
      work_roles: [],
      work_benefits: [],
      work_skills: [],
      application_terms: [],
      emails: [company?.email],
      workplace_address: company?.address,
      wilaya: {
        label: "",
        value: company?.wilaya_id,
      },
      commune: {
        label: "",
        value: company?.commune_id,
      },
      step: 1,
    },
    resolver: yupResolver(CreateJobOfferSchema),
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: async (data: FormData) => await createJobOfferApi(data),
    mutationKey: ["create-job-offer"],
  });

  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };

  const step = watch("step");

  const prevStep = () => {
    if (!stepper) {
      return;
    }
    setValue("step", step - 1);
    stepper.goPrev();
  };

  const nextStep = () => {
    setValue("step", step + 1);
    stepper.goNext();
  };

  const submit = (data: CreateJobOfferProps) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("company_id", company?.id);
    formData.append("description", data.desc);
    formData.append("workplace_type", data.workplace_type?.label);
    formData.append("workplace_wilaya_id", String(data.wilaya?.value));
    formData.append("workplace_commune_id", String(data.commune?.value));
    formData.append("workplace_address", data.workplace_address);
    formData.append("work_type", data.work_type?.label);

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

    mutate(formData, {
      onSuccess(response) {
        toast.success("L'offre d'emploi a été créée avec succès");
        dispatch(addJob(response));
        navigate(`/job-offers/${companyID}`);
      },
      onError(error) {
        toast.error("Erreur lors de la création d'une offre d'emploi");
      },
    });
  };

  return (
    <>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div id="kt_content_container" className="container-xxl">
          <div className="card">
            <div className="card-body p-lg-17">
              <div className="position-relative mb-17">
                <div className="overlay overlay-show">
                  <div
                    className="bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-250px"
                    //   style="background-image:url('assets/media/stock/1600x800/img-1.jpg')"
                  ></div>
                  <div
                    className="overlay-layer rounded bg-black"
                    //   style="opacity: 0.4"
                  ></div>
                </div>
                <div className="position-absolute text-white mb-8 ms-10 bottom-0">
                  <h3 className="text-white fs-2qx fw-bold mb-3 m">
                    Careers at KeenThemes
                  </h3>
                  <div className="fs-5 fw-semibold">
                    You sit down. You stare at your screen. The cursor blinks.
                  </div>
                </div>
              </div>
              <div className="d-flex flex-column flex-lg-row mb-17">
                <div className="flex-lg-row-fluid me-0 me-lg-20">
                  <form
                    action="m-0"
                    className="form mb-15"
                    method="post"
                    id="kt_careers_form"
                  >
                    <div className="row mb-5">
                      <div className="col-md-6 fv-row">
                        <label className="required fs-5 fw-semibold mb-2">
                          Expected Salary
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder=""
                          name="salary"
                        />
                      </div>
                      <div className="col-md-6 fv-row">
                        <label className="required fs-5 fw-semibold mb-2">
                          Srart Date
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-solid"
                          placeholder=""
                          name="start_date"
                        />
                      </div>
                    </div>
                    <div className="d-flex flex-column mb-5 fv-row">
                      <label className="fs-5 fw-semibold mb-2">
                        Website (If Any)
                      </label>
                      <input
                        className="form-control form-control-solid"
                        placeholder=""
                        name="website"
                      />
                    </div>
                    <div className="d-flex flex-column mb-5">
                      <label className="fs-6 fw-semibold mb-2">
                        Experience (Optional)
                      </label>
                      <textarea
                        className="form-control form-control-solid"
                        rows={2}
                        name="experience"
                        placeholder=""
                      ></textarea>
                    </div>
                    <div className="d-flex flex-column mb-8">
                      <label className="fs-6 fw-semibold mb-2">
                        Application
                      </label>
                      <textarea
                        className="form-control form-control-solid"
                        rows={9}
                        name="application"
                        placeholder=""
                      ></textarea>
                    </div>
                    <div className="separator mb-8"></div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      id="kt_careers_submit_button"
                    >
                      <span className="indicator-label">Apply Now</span>
                      <span className="indicator-progress">
                        Please wait...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                  </form>
                </div>
                <div className="flex-lg-row-auto w-100 w-lg-275px w-xxl-350px">
                  <div className="card bg-light">
                    <div className="card-body">
                      <div className="mb-7">
                        <h2 className="fs-1 text-gray-800 w-bolder mb-6">
                          About Us
                        </h2>
                        <p className="fw-semibold fs-6 text-gray-600">
                          First, a disclaimer – the entire process of writing a
                          blog post often takes more than a couple of hours,
                          even if you can type eighty words as per minute and
                          your writing skills are sharp.
                        </p>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Requirements
                        </h4>
                        <div className="my-2">
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with JavaScript
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Good time-management skills
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with React
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with HTML / CSS
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-8">
                        <h4 className="text-gray-700 w-bolder mb-0">
                          Our Achievements
                        </h4>
                        <div className="my-2">
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with JavaScript
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Good time-management skills
                            </div>
                          </div>
                          <div className="d-flex align-items-center mb-3">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with React
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="bullet me-3"></span>
                            <div className="text-gray-600 fw-semibold fs-6">
                              Experience with HTML / CSS
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        href="pages/blog/post.html"
                        className="link-primary fs-6 fw-semibold"
                      >
                        Explore More
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        id="kt_modal_create_app"
        tabIndex={-1}
        aria-hidden="true"
        dialogClassName="modal-dialog modal-dialog-centered mw-900px"
        show={true}
        onEntered={loadStepper}
        backdrop={true}
      >
        <div className="modal-header">
          <h2>Créer une offre d'emploi</h2>
          {/* begin::Close */}
          <div
            className="btn btn-sm btn-icon btn-active-color-primary"
            onClick={() => navigate(`/job-offers/${companyID}`)}
          >
            <KTIcon className="fs-1" iconName="cross" />
          </div>
          {/* end::Close */}
        </div>

        <div className="modal-body py-lg-10 px-lg-10">
          {/*begin::Stepper */}
          <div
            ref={stepperRef}
            className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
            id="kt_modal_create_app_stepper"
          >
            {/* begin::Aside*/}
            <div className="d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px">
              {/* begin::Nav*/}
              <div className="stepper-nav ps-lg-10">
                {/* begin::Step 1*/}
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                >
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">1</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">
                        À propos de l'offre d'emploi
                      </h3>

                      {/* <div className="stepper-desc">Name your App</div> */}
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 1*/}

                {/* begin::Step 2*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">2</span>
                    </div>
                    {/* begin::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Description</h3>

                      {/* <div className="stepper-desc">
                Define your app framework
              </div> */}
                    </div>
                    {/* begin::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 2*/}

                {/* begin::Step 3*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">3</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Détails</h3>
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}

                  {/* begin::Line*/}
                  <div className="stepper-line h-40px"></div>
                  {/* end::Line*/}
                </div>
                {/* end::Step 3*/}

                {/* begin::Step 4*/}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">4</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">Emails</h3>

                      {/* <div className="stepper-desc">Provide storage details</div> */}
                    </div>
                    {/* end::Label*/}
                  </div>
                  {/* end::Wrapper*/}
                </div>
                {/* begin::Step 5*/}
              </div>
              {/* end::Nav*/}
            </div>
            {/* begin::Aside*/}

            {/*begin::Content */}
            <div className="flex-row-fluid pb-lg-5 px-lg-15 pt-0">
              {/*begin::Form */}
              <form noValidate id="kt_modal_create_app_form">
                <Step1 control={control as any} errors={errors} />
                <Step2
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />
                <Step3
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />

                <Step8
                  control={control as any}
                  errors={errors}
                  setValue={setValue}
                />

                {/*begin::Actions */}
                <div className="d-flex flex-stack pt-10 mt-auto">
                  <div className="me-2">
                    <button
                      type="button"
                      className="btn btn-lg btn-light-primary me-3"
                      data-kt-stepper-action="previous"
                      onClick={prevStep}
                    >
                      <KTIcon iconName="arrow-left" className="fs-3 me-1" />{" "}
                      Rerour
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-lg btn-primary"
                      data-kt-stepper-action="submit"
                      onClick={handleSubmit(submit)}
                      disabled={isLoading}
                    >
                      Soumettre
                      {isLoading ? (
                        <Spinner
                          animation="border"
                          color="#fff"
                          size="sm"
                          className="ms-4 me-0"
                        />
                      ) : (
                        <KTIcon
                          iconName="arrow-right"
                          className="fs-3 ms-2 me-0"
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      className="btn btn-lg btn-primary"
                      data-kt-stepper-action="next"
                      onClick={handleSubmit(nextStep)}
                    >
                      Suivant{" "}
                      <KTIcon
                        iconName="arrow-right"
                        className="fs-3 ms-1 me-0"
                      />
                    </button>
                  </div>
                </div>
                {/*end::Actions */}
              </form>
              {/*end::Form */}
            </div>
            {/*end::Content */}
          </div>
          {/* end::Stepper */}
        </div>
      </Modal>
    </>
  );
};
