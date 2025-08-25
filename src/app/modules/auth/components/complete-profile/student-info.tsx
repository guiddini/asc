import { InputComponent, SelectComponent } from "../../../../components";
import { useUser } from "../../../../hooks";
import { Control, useWatch } from "react-hook-form";

const StudentInfo = ({
  control,
  errors,
}: {
  control: Control;
  errors: any;
}) => {
  const { loadingUniversities, MEMORIZED_UNIVERSITIES } = useUser();

  const formdata = useWatch({
    control: control,
  });

  const is_student = formdata?.type === "student";
  const is_other_uni = formdata?.university_id;
  return (
    <>
      <SelectComponent
        control={control as any}
        data={MEMORIZED_UNIVERSITIES}
        errors={errors}
        label="Université"
        name="university_id"
        colXS={12}
        colMD={6}
        isLoading={loadingUniversities}
        noOptionMessage="Aucune université trouvée"
        saveOnlyValue
        required
      />
      {is_student === true && is_other_uni === 0 ? (
        <InputComponent
          control={control as any}
          name="foreign_university"
          errors={errors}
          label="Université étrangère"
          type="text"
          colXS={12}
          colMD={6}
          required
        />
      ) : null}
    </>
  );
};

export default StudentInfo;
