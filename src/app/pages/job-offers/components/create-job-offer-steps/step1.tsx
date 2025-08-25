import { stepPropsTypes } from "../../types/stepTypes";
import {
  CommuneSelect,
  InputComponent,
  SelectComponent,
  WillayasSelect,
} from "../../../../components";
import { Row } from "react-bootstrap";
import { useWatch } from "react-hook-form";
import { useUser } from "../../../../hooks";

export const Step1 = ({ control, errors }: stepPropsTypes) => {
  const formdata = useWatch({
    control,
  });

  const willaya_id = formdata?.wilaya?.value || null;

  const { loadingOccupations, MEMORIZED_OCCUPATIONS } = useUser();

  const defaultWillaya = formdata?.wilaya?.value;
  const defaultCommune = formdata?.commune?.value;

  return (
    <Row className="current" data-kt-stepper-element="content">
      <InputComponent
        control={control}
        errors={errors}
        label="Intitulé de poste"
        name="name"
        type="text"
        colMD={12}
        colXS={12}
        placeholder="Ajouter le poste pour lequel vous recrutez"
        required
      />

      <SelectComponent
        control={control}
        errors={errors}
        data={[
          { label: "Sur site", value: "sur_site" },
          { label: "Hybride", value: "hybride" },
          { label: "A distance", value: "a_distance" },
        ]}
        label="Type de lieu de travail"
        name="workplace_type"
        colMD={6}
        colXS={12}
        className="my-2"
      />

      <SelectComponent
        control={control}
        errors={errors}
        data={[
          { label: "Temps plein", value: "plein_temps" },
          { label: "Temps partiel", value: "temps_partiel" },
          { label: "Contrat", value: "contrat" },
          { label: "Temporaire", value: "temporaire" },
          { label: "Bénévole", value: "benevole" },
          { label: "Stage", value: "stage" },
        ]}
        label="Type d'emploi"
        name="work_type"
        colMD={6}
        colXS={12}
        className="my-2"
      />

      <WillayasSelect
        control={control as any}
        errors={errors}
        colXS={12}
        colMD={6}
        defaultValueID={defaultWillaya}
      />

      <CommuneSelect
        willaya_id={willaya_id}
        control={control as any}
        errors={errors}
        colXS={12}
        colMD={6}
        key={willaya_id}
        defaultValueID={defaultCommune}
      />

      <InputComponent
        control={control}
        errors={errors}
        label="Lieu de travail"
        name="workplace_address"
        type="text"
        colMD={12}
        colXS={12}
        className="mt-2"
      />
    </Row>
  );
};
