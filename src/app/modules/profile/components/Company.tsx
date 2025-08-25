import { useState } from "react";
import CreateCompanyModal from "../../../pages/companies/create/CreateCompanyModal";

const Company = () => {
  const [open, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="d-flex flex-wrap flex-stack mb-6">
        <h3 className="fw-bolder my-2">My Company</h3>

        <div className="d-flex my-2">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary btn-sm"
          >
            Add
          </button>
        </div>
      </div>

      <CreateCompanyModal isOpen={open} setIsOpen={setIsOpen} />
    </>
  );
};

export default Company;
