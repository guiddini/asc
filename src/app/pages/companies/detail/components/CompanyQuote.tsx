import React from "react";

import { CompanyDetailProps } from "../../../../types/company";

interface CompanyQuoteProps {
  company: CompanyDetailProps;
}

const CompanyQuote: React.FC<CompanyQuoteProps> = ({ company }) => {
  return (
    <div className="card bg-light mb-18">
      <div className="card-body py-15">
        <div className="fs-2 fw-semibold text-muted text-center mb-3">
          <span className="fs-1 lh-1 text-gray-700">" </span>
          <span className="p-2">{company?.quote_text}</span>
          <span className="fs-1 lh-1 text-gray-700"> "</span>
        </div>
        <div className="fs-2 fw-semibold text-muted text-center mt-4">
          <span className="fs-4 fw-bold text-gray-600 p-2 ">{company?.quote_author}</span>
        </div>
      </div>
    </div>
  );
};

export default CompanyQuote;
