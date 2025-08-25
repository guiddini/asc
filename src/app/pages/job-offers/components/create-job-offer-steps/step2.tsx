import React from "react";
import { stepPropsTypes } from "../../types/stepTypes";
import { Row } from "react-bootstrap";
import { TextEditor } from "../../../../components";
import { errorMessage } from "../../../../helpers/errorMessage";

interface CreateJobOfferStep2Props extends stepPropsTypes {
  setValue: any;
}

export const Step2 = ({
  control,
  errors,
  setValue,
}: CreateJobOfferStep2Props) => {
  return (
    <Row className="pb-5" data-kt-stepper-element="content">
      <label className="form-label">Description</label>
      <TextEditor
        control={control}
        name="description"
        setValue={setValue}
        withPreview={false}
        className="min-h-350px mh-350px"
      />

      {errorMessage(errors, "desc")}
    </Row>
  );
};
