import { InputComponent, SelectComponent } from "../../../../components";
import { Control } from "react-hook-form";

const InstitutionInfo = ({
  control,
  errors,
}: {
  control: Control;
  errors: any;
}) => {
  return (
    <>
      <SelectComponent
        control={control as any}
        data={[
          {
            label: "Public",
            value: "public",
          },
          {
            label: "Ministère",
            value: "ministere",
          },
          {
            label: "Association",
            value: "association",
          },
          {
            label: "Organisme",
            value: "organisme",
          },
        ]}
        errors={errors}
        label="Type d'institution"
        name="institution_type"
        colXS={12}
        colMD={6}
        noOptionMessage="Aucun type trouvé"
        saveOnlyValue
        required
      />

      <InputComponent
        control={control as any}
        label="Nom de l'institution"
        name="institution_name"
        errors={errors}
        type="text"
        colXS={12}
        colMD={6}
        required
      />
    </>
  );
};

export default InstitutionInfo;
