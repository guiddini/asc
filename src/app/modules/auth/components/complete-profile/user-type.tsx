import { Control, useWatch } from "react-hook-form";
import { ItemSelect } from "../../../../components";

const UserType = ({ next, control }: { next: any; control: Control }) => {
  const watch = useWatch({
    control: control,
  });

  const type = watch?.type;
  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-15">
        <h2 className="fw-bold d-flex align-items-center text-dark">
          Choisissez le type de compte
        </h2>
        <div className="text-muted fw-semibold fs-6">
          Si vous avez besoin de plus d'informations, veuillez nous contacter{" "}
          <a
            href="https://algeriafintech.com/"
            target="_blank"
            className="link-primary fw-bold"
          >
            Page d'aide
          </a>
          .
        </div>
      </div>
      <div className="fv-row">
        <div className="row">
          <ItemSelect
            className="h-md-150px mb-6"
            inputName="type"
            control={control}
            name="corporate"
            icon="microsoft"
            title="Entreprise/Startup"
            desc="Vous travaillez pour une grande entreprise ou organisation"
          />

          <ItemSelect
            className="h-md-150px mb-6"
            inputName="type"
            control={control}
            name="institution"
            icon="badge"
            title="Institution"
            desc="Vous travaillez dans une institution publique ou une organisation"
          />

          <ItemSelect
            className="h-md-150px"
            inputName="type"
            control={control}
            name="independant"
            icon="brifecase-tick"
            title="Indépendant"
            desc="Vous êtes indépendant freelance ou auto entrepreneure"
          />

          <ItemSelect
            className="h-md-150px mt-4 mt-md-0"
            inputName="type"
            control={control}
            name="student"
            icon="teacher"
            title="Étudiant"
            desc="Vous êtes étudiant à l'université ou dans une école "
          />
        </div>
      </div>

      <div className="d-flex flex-row align-items-center justify-content-end mt-6">
        <button
          type="button"
          id="kt_sign_in_submit"
          className="btn btn-custom-purple-dark text-white"
          disabled={type === undefined ?? null}
          onClick={() => {
            if (type !== undefined ?? null) {
              next();
            }
          }}
        >
          <span className="indicator-label">Continuer</span>
        </button>
      </div>
    </div>
  );
};

export default UserType;
