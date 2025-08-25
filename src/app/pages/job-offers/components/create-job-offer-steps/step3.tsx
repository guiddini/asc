import { stepPropsTypes } from "../../types/stepTypes";
import { Step4, Step5, Step6, Step7 } from "..";
import WorkRequirement from "./work-requirement";

interface CreateJobOfferStep3Props extends stepPropsTypes {
  setValue: any;
}

export const Step3 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep3Props) => {
  return (
    <div className="pb-5" data-kt-stepper-element="content">
      <div className="d-flex flex-column w-100 min-h-400px scroll-y mh-400px">
        <WorkRequirement
          control={control}
          errors={errors}
          setValue={setValue}
        />
        <Step4 control={control} errors={errors} setValue={setValue} />
        <Step5 control={control} errors={errors} setValue={setValue} />
        <Step6 control={control} errors={errors} setValue={setValue} />
        <Step7 control={control} errors={errors} setValue={setValue} />
      </div>
    </div>
  );
};
