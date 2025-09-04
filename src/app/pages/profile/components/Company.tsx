import { CompanyCard } from "../../../components";
import { Company as CompanyType } from "../../../types/user";

const Company = ({ company }: { company: CompanyType }) => {
  return (
    <>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">My Company</h3>
      </div>

      <CompanyCard {...company} />
    </>
  );
};

export default Company;
