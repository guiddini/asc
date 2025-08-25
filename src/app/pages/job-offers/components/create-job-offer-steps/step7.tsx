import { stepPropsTypes } from "../../types/stepTypes";
import { InputComponent, TextEditor } from "../../../../components";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep7Props extends stepPropsTypes {
  setValue: any;
}

export const Step7 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep7Props) => {
  const formdata = useWatch({
    control,
  });

  const work_skill = formdata?.work_skill;
  const work_skills = formdata?.work_skills;

  const deletework_skill = (indexToDelete) => {
    const newArray = work_skills.filter((_, index) => index !== indexToDelete);
    setValue("work_skills", newArray);
  };
  return (
    <div className="m-0">
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0"
        data-bs-toggle="collapse"
        data-bs-target="#work_skills"
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
          Compétences
        </h4>
      </div>

      <div id="work_skills" className="fs-6 ms-1 collapse hide">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-column gap-3 mb-3">
            {work_skills?.map((work_skill, index) => (
              <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
                <span className="bullet me-3"></span>

                <div className="text-gray-600 fw-semibold fs-5">
                  {work_skill}
                </div>

                <span
                  onClick={() => deletework_skill(index)}
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

          <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-4">
            <InputComponent
              control={control as any}
              errors={errors}
              name={`work_skill`}
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
                if (work_skills?.length === 0 || work_skills === null) {
                  setValue("work_skills", [work_skill]);
                  setValue("work_skill", "");
                }
                if (work_skills?.length < 5) {
                  const newArray = [...work_skills, work_skill]; // Create a new array with the existing work_skills plus the new work_skill
                  setValue("work_skills", newArray);
                  setValue("work_skill", "");
                }
              }}
            >
              Ajouter
            </button>
          </div>
          {errorMessage(errors, "work_skills")}
        </div>
      </div>
    </div>
  );
};
