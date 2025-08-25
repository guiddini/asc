import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { InputComponent } from "../../../components";
import { Control, SetFieldValue, useWatch } from "react-hook-form";
import { generateGuestCode } from "../../../apis";
import { useMutation, useQueries, useQuery } from "react-query";
import { TicketTypesSelect } from "../../../components/common/ticket-types-select";

interface CreateGuestFormProps {
  control: Control;
  errors: any;
  setValue: SetFieldValue<any>;
}

const CreateGuestForm: React.FC<CreateGuestFormProps> = ({
  control,
  errors,
  setValue,
}) => {
  const { isLoading, mutate } = useMutation({
    mutationKey: ["generate-guest-code"],
    mutationFn: async () => {
      await generateGuestCode().then((res) => {
        setValue("code", res.data);
      });
    },
  });

  const formdata = useWatch({
    control: control,
  });

  return (
    <Row xs={12} md={12}>
      <InputComponent
        control={control}
        label="Prénom"
        errors={errors}
        name="fname"
        type="text"
        colMD={6}
        colXS={12}
      />
      <InputComponent
        control={control}
        label="Nom"
        errors={errors}
        name="lname"
        type="text"
        colMD={6}
        colXS={12}
      />
      <TicketTypesSelect
        control={control}
        errors={errors}
        colMD={6}
        colXS={12}
      />
      <Col xs={12} md={6}>
        <Row xs={12} md={12}>
          <InputComponent
            control={control}
            label="Code"
            errors={errors}
            name="code"
            type="text"
            colXS={8}
            colMD={8}
            // disabled
            defaultValue={formdata?.code}
          />
          <Col xs={2} md={2}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold opacity-0`}>S</span>
            </label>

            <button
              onClick={() => {
                mutate();
              }}
              id="kt_sign_in_submit"
              className="btn btn-custom-purple-light text-white"
              disabled={isLoading}
            >
              {!isLoading && <span className="indicator-label">Generate</span>}
              {isLoading && (
                <span
                  className="indicator-progress"
                  style={{ display: "block" }}
                >
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default CreateGuestForm;
