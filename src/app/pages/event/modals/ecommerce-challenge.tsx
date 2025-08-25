import { Modal, Row } from "react-bootstrap";
import StadeSelect from "../components/stade-select";
import { useFieldArray, useForm } from "react-hook-form";
import { InputComponent, SelectComponent } from "../../../components";

const EcommerceChallenge = () => {
  const {
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      group: [
        {
          lname: "",
          fname: "",
        },
      ],
    },
  });

  const { fields, append } = useFieldArray({
    control: control,
    name: "group",
  });
  return (
    <>
      <Modal.Body className="p-10">
        <h3 className="mb-5">Êtes-vous :</h3>
        <Row>
          <StadeSelect
            className=" mb-6"
            inputName="stade"
            control={control as any}
            name="idéation"
            icon="microsoft"
            title="Startup"
            // desc="Vous êtes au stade de la réflexion et de la génération d'idées. Vous explorez des solutions créatives pour répondre à un besoin ou une opportunité."
            colXS={12}
            colMD={6}
            colLG={6}
          />

          <StadeSelect
            className=" mb-6"
            inputName="stade"
            control={control as any}
            name="planification"
            icon="badge"
            title="Porteur de project"
            // desc=" Vous êtes à l'étape de la planification stratégique. Vous définissez vos objectifs, allouez des ressources et établissez un plan d'action détaillé."
            colMD={6}
            colXS={12}
            colLG={6}
          />

          <StadeSelect
            className=""
            inputName="stade"
            control={control as any}
            name="développement"
            icon="brifecase-tick"
            title="Freelance"
            // desc="Vous êtes en plein dans la mise en œuvre de votre idée. Vous construisez des prototypes, développez des produits ou des solutions, et travaillez à les améliorer continuellement."
            colMD={6}
            colXS={12}
            colLG={6}
          />

          <StadeSelect
            className="mt-4"
            inputName="stade"
            control={control as any}
            name="student"
            icon="teacher"
            title="Étudiant"
            // desc="Vous êtes en plein dans la mise en œuvre de votre idée. Vous construisez des prototypes, développez des produits ou des solutions, et travaillez à les améliorer continuellement."
            colMD={6}
            colXS={12}
            colLG={6}
          />

          <InputComponent
            control={control as any}
            label="Nom de l'établissement d'enseignement si vous êtes (Etudiants)"
            name="name"
            errors={errors}
            colMD={6}
            colXS={12}
            type="text"
          />

          <InputComponent
            control={control as any}
            label="Domaine d'études (Etudiants)"
            name="name"
            errors={errors}
            colMD={6}
            colXS={12}
            type="text"
          />

          <InputComponent
            control={control as any}
            label="Nom de votre startup / projet innovant"
            name="name"
            errors={errors}
            colMD={6}
            colXS={12}
            type="text"
          />

          <InputComponent
            control={control as any}
            label="Site web de votre startup / Projet innovant si disponible"
            name="name"
            errors={errors}
            colMD={6}
            colXS={12}
            type="text"
          />

          <SelectComponent
            control={control as any}
            data={[
              {
                label: 'Groupe " MAX 4 membres"',
                value: "group",
              },
              {
                label: "Individuel",
                value: "individuel",
              },
            ]}
            label="Allez-vous participer en tant que"
            errors={errors}
            name="type"
            colMD={6}
            colXS={12}
            className="mt-7"
          />
        </Row>
        <Row>
          <div className="">
            <h2>Les details de group :</h2>
            <button
              type="button"
              id="kt_sign_in_submit"
              className="btn btn-custom-purple-dark text-white"
            >
              <span className="indicator-label">Ajouter</span>
            </button>
          </div>
          {fields?.map((field, index) => {
            return (
              <InputComponent
                key={field.id}
                control={control as any}
                label="Nom"
                name={`group.${index}.lname`}
                errors={errors}
                colMD={6}
                colXS={12}
                type="text"
              />
            );
          })}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn mb-3 order-last order-md-first text-light"
          style={{
            backgroundColor: "#00c4c4",
          }}
          // onClick={() => setShowModal(true)}
        >
          Participer
        </button>
      </Modal.Footer>
    </>
  );
};

export default EcommerceChallenge;
