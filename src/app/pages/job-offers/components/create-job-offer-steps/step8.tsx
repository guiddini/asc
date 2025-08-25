import { stepPropsTypes } from "../../types/stepTypes";
import { InputComponent, TextEditor } from "../../../../components";
import { useWatch } from "react-hook-form";
import clsx from "clsx";
import { KTIcon } from "../../../../../_metronic/helpers";

interface CreateJobOfferStep8Props extends stepPropsTypes {
  setValue: any;
}

export const Step8 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep8Props) => {
  const formdata = useWatch({
    control,
  });

  const email = formdata?.email;
  const emails = formdata?.emails;

  const deleteemail = (indexToDelete) => {
    const newArray = emails.filter((_, index) => index !== indexToDelete);
    setValue("emails", newArray);
  };
  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="d-flex flex-column w-100 min-h-300px">
        <h3>Réception des candidatures :</h3>
        <span className="text-muted fs-6">
          Vous pouvez ajouter plusieurs adresses e-mail dans lesquelles vous
          souhaitez recevoir une notification des candidats
        </span>
        <div className="w-100 d-flex flex-row align-items-center justify-content-between mt-4">
          <InputComponent
            control={control as any}
            errors={errors}
            label={`Email`}
            name={`email`}
            type="text"
            colMD={9}
            colXS={9}
            className="w-75"
          />
          <button
            type="button"
            className={clsx(
              "btn btn-custom-purple-dark text-white w-120px mt-6"
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
            <div className="d-flex align-items-center ps-6 mb-n1" key={index}>
              <span className="bullet me-3"></span>

              <div className="text-gray-600 fw-semibold fs-5">{email}</div>

              <span onClick={() => deleteemail(index)} className="ms-auto">
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
  );
};
