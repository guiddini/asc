import { stepPropsTypes } from "../../types/stepTypes";
import { InputComponent } from "../../../../components";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep3Props extends stepPropsTypes {
  setValue: any;
}

const WorkRequirement = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep3Props) => {
  const formdata = useWatch({
    control,
  });

  const work_requirement = formdata?.work_requirement;
  const work_requirements = formdata?.work_requirements;

  const deletework_requirement = (indexToDelete) => {
    const newArray = work_requirements.filter(
      (_, index) => index !== indexToDelete
    );
    setValue("work_requirements", newArray);
  };

  return (
    <div className="m-0">
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0 collapsed"
        data-bs-toggle="collapse"
        data-bs-target="#work_requirements"
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
          Exigences de travail
        </h4>
      </div>

      <div id="work_requirements" className="fs-6 ms-1 collapse hide">
        <div className="d-flex flex-column gap-3 mb-4">
          {work_requirements?.map((work_requirement, index) => (
            <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
              <span className="bullet me-3"></span>

              <div className="text-gray-600 fw-semibold fs-5">
                {work_requirement}
              </div>

              <span
                onClick={() => deletework_requirement(index)}
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
            name={`work_requirement`}
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
                work_requirements === null ||
                work_requirements?.length === 0
              ) {
                setValue("work_requirements", [work_requirement]);
                setValue("work_requirement", "");
              }
              if (work_requirements?.length > 0) {
                const newArray = [...work_requirements, work_requirement]; // Create a new array with the existing work_requirements plus the new work_requirement
                setValue("work_requirements", newArray);
                setValue("work_requirement", "");
              }
            }}
          >
            Ajouter
          </button>
        </div>
      </div>
      {errorMessage(errors, "work_requirements")}
    </div>
  );
};

export default WorkRequirement;
