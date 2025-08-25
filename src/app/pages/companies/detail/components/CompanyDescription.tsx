import React from "react";

import clsx from "clsx";
import { CompanyDetailProps } from "../../../../types/company";
import { TextEditor } from "../../../../components";

interface CompanyDescriptionProps {
  company: CompanyDetailProps;
  editable: boolean;
  watch: any;
  control: any;
  setValue: any;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({
  company,
  editable,
  watch,
  control,
  setValue,
}) => {
  return (
    <div className="fs-5 fw-semibold text-gray-600">
      <p
        dangerouslySetInnerHTML={{
          __html: watch("desc"),
        }}
        className={clsx("mb-8 p-2", {
          "border border-primary ": editable,
        })}
      />
      {editable && (
        <TextEditor
          control={control}
          name="description"
          setValue={setValue}
          withPreview={false}
        />
      )}
    </div>
  );
};

export default CompanyDescription;
