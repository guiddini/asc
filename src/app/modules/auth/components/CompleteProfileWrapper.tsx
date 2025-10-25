import { useEffect, useRef, useState } from "react";
import { StepperComponent } from "../../../../_metronic/assets/ts/components";
import UserInfo from "./complete-profile/User-Info";
import UserTicket from "./complete-profile/user-ticket";
import UserType from "./complete-profile/user-type";
import { useForm } from "react-hook-form";
import CompletedProfile from "./complete-profile/completed-profile";
import { useCompleteProfile } from "../../../hooks";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useSelector } from "react-redux";
import { UserResponse } from "../../../types/reducers";
import { Link } from "react-router-dom";

const CompleteProfileWrapper = () => {
  const { user } = useSelector((state: UserResponse) => state.user);
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };
  const { isCompanyInfoCompleted, isTicketInfoCompleted, isUserInfoCompleted } =
    useCompleteProfile();

  const { control, watch } = useForm();

  const type = watch("type");
  const can_create_company = user?.can_create_company === 1;

  const assingFirstStep = () => {
    const userInfoNav = document.querySelector("#user-info-nav");
    const userInfoContainer = document.querySelector("#user-info-container");

    // user ticket steps
    const userTicketNav = document.querySelector("#user-ticket-nav");
    const userTicketContainer = document.querySelector(
      "#user-ticket-container"
    );

    // exhibitor steps
    const ExhibitorNav = document.querySelector("#exhibitor-info-nav");
    const ExhibitorContainer = document.querySelector(
      "#exhibitor-info-container"
    );

    // completed profile steps
    const CompletedPofileNav = document.querySelector("#completed-info-nav");
    const CompletedPofileContainer = document.querySelector(
      "#completed-info-container"
    );

    if (!isUserInfoCompleted()) {
      userInfoNav?.classList.add("current");
      userInfoContainer?.classList.add("current");
      stepper?.setIndex(1);
    } else if (isUserInfoCompleted() && !isTicketInfoCompleted()) {
      userTicketNav?.classList.add("current");
      userTicketContainer?.classList.add("current");
      stepper?.setIndex(3); // Skip the ticket information step
    } else if (isUserInfoCompleted() && isTicketInfoCompleted()) {
      if (can_create_company) {
        ExhibitorNav?.classList.add("current");
        ExhibitorContainer?.classList.add("current");
        stepper?.setIndex(4); // Skip the ticket information step
      } else {
        CompletedPofileNav?.classList.add("current");
        CompletedPofileContainer?.classList.add("current");
        stepper?.setIndex(4); // Skip the ticket information step
      }
    } else if (isUserInfoCompleted() && isTicketInfoCompleted()) {
      if (can_create_company) {
        ExhibitorNav?.classList.add("current");
        ExhibitorContainer?.classList.add("current");
        stepper?.setIndex(4); // Skip the ticket information step
      } else {
        CompletedPofileNav?.classList.add("current");
        CompletedPofileContainer?.classList.add("current");
        stepper?.setIndex(4); // Skip the ticket information step
      }
    }
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
    if (stepper) {
      if (can_create_company) {
        stepper.initTotalSteps(5);
      } else {
        stepper.initTotalSteps(4);
      }
    }
  }, [stepperRef, type]);

  useEffect(() => {
    assingFirstStep();
  }, [stepper]);

  const lastStep = stepper?.steps?.length;

  return (
    <div className="d-flex flex-column flex-root">
      <div
        ref={stepperRef}
        className="d-flex flex-column flex-lg-row flex-column-fluid stepper stepper-pills stepper-column stepper-multistep"
        id="kt_create_account_stepper"
      >
        <div className="d-flex flex-column flex-lg-row-auto w-lg-350px w-xl-500px">
          <div
            className="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center"
            id="complete-profile-wrapper"
          >
            <div className="d-flex flex-center py-10 py-lg-20 mt-lg-20">
              <img
                alt="Logo"
                src={toAbsoluteUrl(`/media/afes/fintech-center.png`)}
                className="h-100px h-md-150px"
              />
            </div>
            <div className="d-flex flex-row-fluid justify-content-center p-10">
              <div className="stepper-nav">
                {/* Étape du type de compte */}
                <div
                  id="user-info-nav"
                  className="stepper-item"
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-wrapper">
                    <div className="stepper-icon rounded-3">
                      <i className="ki-duotone ki-check fs-2 stepper-check"></i>
                      <span className="stepper-number">1</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title fs-2">Account Type</h3>
                      <div className="stepper-desc fw-normal">
                        Select your type of account
                      </div>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                {/* Informations sur le compte */}
                <div className="stepper-item" data-kt-stepper-element="nav">
                  <div className="stepper-wrapper">
                    <div className="stepper-icon rounded-3">
                      <i className="ki-duotone ki-check fs-2 stepper-check"></i>
                      <span className="stepper-number">2</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title fs-2">Account Information</h3>
                      <div className="stepper-desc fw-normal">
                        Set up your account information
                      </div>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                {/* Détails des tickets */}
                {/* {!isTicketInfoCompleted() && (
                )} */}
                <div
                  id="user-ticket-nav"
                  className="stepper-item"
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-wrapper">
                    <div className="stepper-icon">
                      <i className="ki-duotone ki-check fs-2 stepper-check"></i>
                      <span className="stepper-number">3</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title fs-2">Ticket Details</h3>
                      <div className="stepper-desc fw-normal">Assign a ticket</div>
                    </div>
                  </div>
                  <div className="stepper-line h-40px"></div>
                </div>
                {/* Uniquement pour l'exposant pour compléter les détails de l'entreprise */}
                {can_create_company ? (
                  <div
                    id="exhibitor-info-nav"
                    className="stepper-item"
                    data-kt-stepper-element="nav"
                  >
                    <div className="stepper-wrapper">
                      <div className="stepper-icon">
                        <i className="ki-duotone ki-check fs-2 stepper-check"></i>
                        <span className="stepper-number">
                          {isTicketInfoCompleted() ? 3 : 4}
                        </span>
                      </div>
                      <div className="stepper-label">
                        <h3 className="stepper-title fs-2">Company Details</h3>
                        <div className="stepper-desc fw-normal">
                          Add company details
                        </div>
                      </div>
                    </div>
                    <div className="stepper-line h-40px"></div>
                  </div>
                ) : null}

                <div
                  className="stepper-item"
                  id="completed-info-nav"
                  data-kt-stepper-element="nav"
                >
                  <div className="stepper-wrapper">
                    <div className="stepper-icon">
                      <i className="ki-duotone ki-check fs-2 stepper-check"></i>
                      <span className="stepper-number">{lastStep}</span>
                    </div>
                    <div className="stepper-label">
                      <h3 className="stepper-title">Completed</h3>
                      <div className="stepper-desc fw-normal">Your account is created</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex flex-center flex-wrap px-5 py-10">
              <div className="d-flex fw-normal">
                <Link
                  to="/privacy-policy"
                  className="text-light px-5"
                  target="_blank"
                >
                  Terms
                </Link>
                <a
                  href="https://algeriafintech.com/"
                  className="text-light px-5"
                  target="_blank"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex flex-column flex-lg-row-fluid py-10">
          <div className="d-flex flex-center flex-column flex-column-fluid">
            <div className="w-lg-650px w-xl-700px p-10 p-lg-15 mx-auto">
              <form className="my-auto pb-5" id="kt_create_account_form">
                <div data-kt-stepper-element="content" id="user-info-container">
                  <UserType
                    control={control as any}
                    next={() => stepper.goNext()}
                  />
                </div>
                <div data-kt-stepper-element="content">
                  <UserInfo
                    next={() => {
                      stepper.goNext();
                      if (isTicketInfoCompleted()) {
                        stepper.goNext();
                      }
                    }}
                    type={type}
                    key={type && Math.random()}
                  />
                </div>

                <div
                  data-kt-stepper-element="content"
                  id="user-ticket-container"
                >
                  <UserTicket next={() => stepper.goNext()} />
                </div>

                <div
                  data-kt-stepper-element="content"
                  id="completed-info-container"
                >
                  <CompletedProfile />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileWrapper;
