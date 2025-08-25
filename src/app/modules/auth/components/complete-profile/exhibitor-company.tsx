import { CreateCompanyForm } from "../../../../components";

const ExhibitorCompany = ({ next }: { next: () => void }) => {
  return (
    <div className="w-100">
      <div className="pb-10 pb-lg-12">
        <h2 className="fw-bold text-dark">Détails de l'entreprise</h2>
        <div className="text-muted fw-semibold fs-6">
          Ajoutez les détails de l'entreprise
        </div>
      </div>
      <CreateCompanyForm next={next} />
    </div>
  );
};

export default ExhibitorCompany;
