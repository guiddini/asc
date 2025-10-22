import React from "react";

import { CompanyDetailProps } from "../../../../types/company";

interface CompanyDescriptionProps {
  company: CompanyDetailProps;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({ company }) => {
  return (
    <div className="fs-5 fw-semibold text-gray-600">
      <p
        dangerouslySetInnerHTML={{ __html: company?.desc }}
        className="mb-8 p-2"
      />
    </div>
  );
};

export default CompanyDescription;
