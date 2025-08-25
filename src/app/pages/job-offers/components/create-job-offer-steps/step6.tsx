import React from "react";
import { stepPropsTypes } from "../../types/stepTypes";
import { Col, Row } from "react-bootstrap";
import { InputComponent, TextEditor } from "../../../../components";
import { useFieldArray, useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep6Props extends stepPropsTypes {
  setValue: any;
}

export const Step6 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep6Props) => {
  const formdata = useWatch({
    control,
  });

  const work_role = formdata?.work_role;
  const work_roles = formdata?.work_roles;

  const deletework_role = (indexToDelete) => {
    const newArray = work_roles.filter((_, index) => index !== indexToDelete);
    setValue("work_roles", newArray);
  };
  return (
    <div className="m-0">
      <div
        className="d-flex align-items-center collapsible py-3 toggle mb-0"
        data-bs-toggle="collapse"
        data-bs-target="#work_roles"
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
          Responsabilités
        </h4>
      </div>

      <div id="work_roles" className="fs-6 ms-1 collapse hide">
        <div className="d-flex flex-column w-100">
          <div className="d-flex flex-column gap-3 mb-3">
            {work_roles?.map((work_role, index) => (
              <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
                <span className="bullet me-3"></span>

                <div className="text-gray-600 fw-semibold fs-5">
                  {work_role}
                </div>

                <span
                  onClick={() => deletework_role(index)}
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
              name={`work_role`}
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
                if (work_roles?.length === 0 || work_roles === null) {
                  setValue("work_roles", [work_role]);
                  setValue("work_role", "");
                }
                if (work_roles?.length > 0) {
                  const newArray = [...work_roles, work_role]; // Create a new array with the existing work_roles plus the new work_role
                  setValue("work_roles", newArray);
                  setValue("work_role", "");
                }
              }}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
      {errorMessage(errors, "work_roles")}
    </div>
  );
};
