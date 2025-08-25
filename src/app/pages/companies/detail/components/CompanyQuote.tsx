import React from "react";

import clsx from "clsx";
import { CompanyDetailProps } from "../../../../types/company";

interface CompanyQuoteProps {
  company: CompanyDetailProps;
  editable: boolean;
  watch: any;
  setValue: any;
}

const CompanyQuote: React.FC<CompanyQuoteProps> = ({
  company,
  editable,
  watch,
  setValue,
}) => {
  return (
    <div className="card bg-light mb-18">
      <div className="card-body py-15">
        <div className="fs-2 fw-semibold text-muted text-center mb-3">
          <span className="fs-1 lh-1 text-gray-700">" </span>
          <span
            className={clsx("p-2", {
              "border border-primary ": editable,
            })}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              setValue("quote_text", e.currentTarget.textContent);
            }}
          >
            {watch("quote_text")}
          </span>
          <span className="fs-1 lh-1 text-gray-700"> "</span>
        </div>
        <div className="fs-2 fw-semibold text-muted text-center mt-4">
          <span
            className={clsx("fs-4 fw-bold text-gray-600 p-2 ", {
              "border border-primary ": editable,
            })}
            contentEditable={editable}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              setValue("quote_author", e.currentTarget.textContent);
            }}
          >
            {watch("quote_author")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompanyQuote;
