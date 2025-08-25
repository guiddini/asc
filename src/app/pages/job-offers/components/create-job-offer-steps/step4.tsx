import { stepPropsTypes } from "../../types/stepTypes";
import { InputComponent } from "../../../../components";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep4Props extends stepPropsTypes {
  setValue: any;
}

export const Step4 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep4Props) => {
  const formdata = useWatch({
    control,
  });

  const work_benefit = formdata?.work_benefit;
  const work_benefits = formdata?.work_benefits;

  const deletework_benefit = (indexToDelete) => {
    const newArray = work_benefits.filter(
      (_, index) => index !== indexToDelete
    );
    setValue("work_benefits", newArray);
  };

  return (
    <div className="m-0">
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0 collapsed"
        data-bs-toggle="collapse"
        data-bs-target="#work_benefits"
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
          Les avantages du travail
        </h4>
      </div>

      <div id="work_benefits" className="fs-6 ms-1 collapse hide">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-column gap-3 mb-3">
            {work_benefits?.map((work_benefit, index) => (
              <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
                <span className="bullet me-3"></span>

                <div className="text-gray-600 fw-semibold fs-5">
                  {work_benefit}
                </div>

                <span
                  onClick={() => deletework_benefit(index)}
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
              name={`work_benefit`}
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
                if (work_benefits === null || work_benefits?.length === 0) {
                  setValue("work_benefits", [work_benefit]);
                  setValue("work_benefit", "");
                }
                if (work_benefits?.length > 0) {
                  const newArray = [...work_benefits, work_benefit]; // Create a new array with the existing work_benefits plus the new work_benefit
                  setValue("work_benefits", newArray);
                  setValue("work_benefit", "");
                }
              }}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
      {errorMessage(errors, "work_benefits")}
    </div>
  );
};
