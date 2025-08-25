import React, { useMemo } from "react";
import { Row, Col } from "react-bootstrap";
import { InputComponent } from "../../../components";
import { Control, useFieldArray, useWatch } from "react-hook-form";
import { useQuery } from "react-query";
import { getAllRolesApi } from "../../../apis";
import Select from "react-select";
import { useTicket } from "../../../hooks";
import { errorMessage } from "../../../helpers/errorMessage";

interface CreateUserFormProps {
  control: Control;
  errors: any;
  setValue: (name: string, value: any, options?: object) => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  control,
  errors,
  setValue,
}) => {
  const { TICKET_TYPES } = useTicket();

  const TICKETS = useMemo(
    () =>
      TICKET_TYPES?.map((ticket) => ({
        label: ticket?.name || "",
        value: ticket?.slug || "",
        roles: [],
      })) || [],
    [TICKET_TYPES]
  );

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesApi,
  });

  const ROLES = useMemo(
    () =>
      rolesData?.data?.map((role) => ({
        label: role.display_name || "",
        value: role.name || "",
      })) || [],
    [rolesData, rolesLoading]
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const formData = useWatch({ control, name: "tickets" });

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
      <InputComponent
        control={control}
        label="Email"
        errors={errors}
        name="email"
        type="email"
        colMD={6}
        colXS={12}
      />
      <InputComponent
        control={control}
        label="Password"
        errors={errors}
        name="password"
        type="password"
        colMD={6}
        colXS={12}
      />

      <div className="d-flex flex-row align-items-center justify-content-between mb-5 mt-8">
        <label className="fw-bold fs-4">- Tickets :</label>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            append({
              quantity: 0,
              ticket_type: null,
            })
          }
        >
          Add Ticket
        </button>
      </div>

      {fields.map((item, index) => (
        <Row key={item.id} xs={12} md={12} className="gap-4 gap-md-0">
          <Col xs={12} md={4}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
              <span className={`fw-bold required`}>Ticket type</span>
            </label>
            <Select
              options={TICKETS}
              isClearable
              closeMenuOnSelect={true}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: "#000",
                  backgroundColor: "#fff",
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "#fff",
                  color: "#000",
                }),
                singleValue: (baseStyles) => ({
                  ...baseStyles,
                  color: "#26272F",
                  background: "transparent",
                }),
                input: (baseStyles) => ({
                  ...baseStyles,
                  color: "#26272F",
                  background: "transparent",
                }),
                noOptionsMessage: (baseStyles) => ({
                  ...baseStyles,
                  color: "#26272F",
                  backgroundColor: "#fff",
                }),
              }}
              onChange={(e) => {
                setValue(`tickets[${index}].ticket_type`, e);
              }}
              noOptionsMessage={() => (
                <p className="pt-3">Rien ne correspond à votre recherche</p>
              )}
              placeholder="Sélectionner..."
            />
            {errorMessage(
              errors?.tickets && errors?.tickets[index],
              "ticket_type"
            )}
          </Col>

          <InputComponent
            control={control}
            errors={errors?.tickets && errors?.tickets[index]}
            error="quantity"
            label="Quantity"
            name={`tickets[${index}].quantity`}
            type="number"
            colMD={3}
            colXS={12}
          />

          <Col xs={12} md={2}>
            <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
              <span className={`fw-bold required opacity-0`}>Ticket type</span>
            </label>
            <button
              className="btn btn-danger"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </Col>
        </Row>
      ))}
    </Row>
  );
};

export default CreateUserForm;
