import React, { useState, useEffect, useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useFieldArray, Control, useWatch } from "react-hook-form";
import Select from "react-select";
import { InputComponent } from "../../../components";
import { KTIcon } from "../../../../_metronic/helpers";
import { errorMessage } from "../../../helpers/errorMessage";

type Role = {
  label: string;
  value: string;
};

type TicketData = {
  label: string;
  value: string;
  roles: Role[];
};

type TicketFormProps = {
  // formMethods: UseFormReturn<TicketFormValues>;
  ROLES: Role[];
  TICKETS: {
    label: string;
    value: string;
    roles: string[];
  }[];
  control: Control;
  errors: any;
  setValue: any;
};

const TicketForm: React.FC<TicketFormProps> = ({
  ROLES,
  TICKETS,
  control,
  errors,
  setValue,
}) => {
  const formdata = useWatch({
    control: control,
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const [ticketData, setTicketData] = useState<TicketData[] | null>(null);

  const getTicketAvailableRoles = (ticket_slug: string) => {
    const res = ticketData?.find((t) => t?.value === ticket_slug);

    return res?.roles || [];
  };

  const onChangeTicketRole = (
    ticket_slug: string,
    previousRole: Role,
    e: Role,
    index: number
  ) => {
    const resIndex = ticketData.findIndex(
      (ticket) => ticket?.value === ticket_slug
    );

    if (previousRole?.label) {
      // Update the state ticketData with the new roles array
      setTicketData((prev) => {
        const updatedData = [...prev];
        updatedData[resIndex] = {
          ...updatedData[resIndex],
          roles: [...updatedData[resIndex]?.roles, previousRole],
        };
        return updatedData;
      });
    }

    setValue(`tickets[${index}].ticket_role`, e);

    // Update the state ticketData with the filtered roles array
    setTicketData((prev) => {
      const updatedData = [...prev];
      updatedData[resIndex] = {
        ...updatedData[resIndex],
        roles: updatedData[resIndex]?.roles.filter(
          (role) => role.value !== e.value
        ),
      };
      return updatedData;
    });
  };

  const onRemoveTicket = (
    ticket_slug: string,
    removedRole: Role,
    index: number
  ) => {
    const resIndex = ticketData.findIndex(
      (ticket) => ticket?.value === ticket_slug
    );

    // Restore the removed role to the ticketData
    if (removedRole?.label) {
      setTicketData((prev) => {
        const updatedData = [...prev];
        updatedData[resIndex] = {
          ...updatedData[resIndex],
          roles: [...updatedData[resIndex]?.roles, removedRole],
        };
        return updatedData;
      });
    }

    // Remove the ticket
    remove(index);
  };

  useEffect(() => {
    const organizeData = () => {
      const res = TICKETS?.map((ticket) => {
        return {
          ...ticket,
          roles: ROLES,
        };
      });

      setTicketData(res);
    };

    organizeData();
  }, [ROLES]);

  return (
    <>
      <div className="d-flex flex-row align-items-center justify-content-between mb-5 mt-8">
        <label className="fw-bold fs-4">- Tickets :</label>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            append({
              quantity: 0,
              ticket_role: null,
              ticket_type: null,
            })
          }
        >
          Add Ticket
        </button>
      </div>
      {fields.map((item, index) => {
        const previousTicketType = formdata?.tickets[index]?.ticket_type;
        const previousRole = formdata?.tickets[index]?.ticket_role;

        return (
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

                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    background: "transparent",
                  }),

                  input: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    background: "transparent",
                  }),

                  noOptionsMessage: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    backgroundColor: "#fff",
                  }),

                  container: (baseStyles) => ({
                    ...baseStyles,
                  }),
                }}
                onChange={(e: any) => {
                  setValue(`tickets[${index}].ticket_type`, e);
                }}
                noOptionsMessage={() => {
                  return (
                    <p className="pt-3">Rien ne correspond à votre recherche</p>
                  );
                }}
                classNames={{}}
                placeholder="Sélectionner..."
              />
              {errorMessage(
                errors?.tickets && errors?.tickets[index],
                "ticket_type"
              )}
            </Col>

            <InputComponent
              control={control as any}
              errors={errors?.tickets && errors?.tickets[index]}
              error="quantity"
              label="Quantity"
              name={`tickets[${index}].quantity`}
              type="number"
              colMD={3}
              colXS={12}
            />

            <Col xs={12} md={3}>
              <label className="d-flex align-items-center fs-5 fw-semibold mb-3">
                <span className={`fw-bold required`}>Role</span>
              </label>
              <Select
                options={
                  getTicketAvailableRoles(previousTicketType?.value) || []
                }
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

                  singleValue: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    background: "transparent",
                  }),

                  input: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    background: "transparent",
                  }),

                  noOptionsMessage: (baseStyles, state) => ({
                    ...baseStyles,
                    color: "#26272F",
                    backgroundColor: "#fff",
                  }),

                  container: (baseStyles) => ({
                    ...baseStyles,
                  }),
                }}
                isDisabled={!previousTicketType?.label}
                onChange={(e: any) => {
                  onChangeTicketRole(
                    previousTicketType?.value,
                    previousRole,
                    e,
                    index
                  );
                }}
                noOptionsMessage={() => {
                  return (
                    <p className="pt-3">Rien ne correspond à votre recherche</p>
                  );
                }}
                placeholder="Sélectionner..."
                key={previousTicketType}
              />
              {errorMessage(
                errors?.tickets && errors?.tickets[index],
                "ticket_role"
              )}
            </Col>
            <Col xs={12} md={2}>
              <label className="d-flex align-items-center fs-5 fw-semibold mb-2">
                <span className={`fw-bold required opacity-0`}>
                  Ticket type
                </span>
              </label>
              <button
                className="btn btn-danger"
                type="button"
                onClick={() =>
                  onRemoveTicket(previousTicketType?.value, previousRole, index)
                }
              >
                <KTIcon
                  iconName="trash"
                  className={`fs-1 cursor-pointer m-0 text-light `}
                />
                Remove
              </button>
            </Col>
          </Row>
        );
      })}

      {/* <button type="submit">Submit</button> */}
    </>
  );
};

export default TicketForm;
