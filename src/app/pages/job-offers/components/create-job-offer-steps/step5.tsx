import { stepPropsTypes } from "../../types/stepTypes";
import { InputComponent } from "../../../../components";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep5Props extends stepPropsTypes {
  setValue: any;
}

export const Step5 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep5Props) => {
  const formdata = useWatch({
    control,
  });

  const application_term = formdata?.application_term;
  const application_terms = formdata?.application_terms;

  const deleteapplication_term = (indexToDelete) => {
    const newArray = application_terms.filter(
      (_, index) => index !== indexToDelete
    );
    setValue("application_terms", newArray);
  };
  return (
    <div className="m-0">
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0"
        data-bs-toggle="collapse"
        data-bs-target="#application_terms"
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
          Les conditions d'application
        </h4>
      </div>

      <div id="application_terms" className="fs-6 ms-1 collapse hide">
        <div className="d-flex flex-column gap-3 mb-3">
          {application_terms?.map((application_term, index) => (
            <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
              <span className="bullet me-3"></span>

              <div className="text-gray-600 fw-semibold fs-5">
                {application_term}
              </div>

              <span
                onClick={() => deleteapplication_term(index)}
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

        <div className="w-100 d-flex flex-row align-items-center justify-content-between">
          <InputComponent
            control={control as any}
            errors={errors}
            name={`application_term`}
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
            onClick={() => {
              if (
                application_terms?.length === 0 ||
                application_terms === null
              ) {
                setValue("application_terms", [application_term]);
                setValue("application_term", "");
              }
              if (application_terms?.length > 0) {
                const newArray = [...application_terms, application_term]; // Create a new array with the existing application_terms plus the new application_term
                setValue("application_terms", newArray);
                setValue("application_term", "");
              }
            }}
          >
            Ajouter
          </button>
        </div>
      </div>
      {errorMessage(errors, "application_terms")}
    </div>
  );
};
