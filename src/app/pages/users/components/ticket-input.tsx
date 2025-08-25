import React, { useMemo } from "react";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { Control, Controller } from "react-hook-form";
import { Col, Row } from "react-bootstrap";
import clsx from "clsx";
import { errorMessage, isError } from "../../../helpers/errorMessage";
import { useQuery } from "react-query";
import { getAllRolesApi } from "../../../apis";
import { InputComponent, SelectComponent } from "../../../components";

const TicketInput = ({
  control,
  label,
  errors,
  name,
}: {
  control: Control;
  label: string;
  name: string;
  errors: any;
}) => {
  const getIcon = () => {
    switch (name) {
      case "free":
        return (
          <span className="symbol symbol-50px me-3">
            <span className="symbol-label" id="ticket-icon-container">
              <img
                src={toAbsoluteUrl("/media/svg/afes/tickets/free.svg")}
                className="w-100 h-100"
              />
            </span>
          </span>
        );
      case "vip":
        return (
          <span className="symbol symbol-50px me-3">
            <span className="symbol-label" id="ticket-icon-container">
              <img
                src={toAbsoluteUrl("/media/svg/afes/tickets/premium.svg")}
                className="w-100 h-100"
              />
            </span>
          </span>
        );

      case "bussiness":
        return (
          <span className="symbol symbol-50px me-3">
            <span className="symbol-label" id="ticket-icon-container">
              <img
                src={toAbsoluteUrl("/media/svg/afes/tickets/business.svg")}
                className="w-100 h-100"
              />
            </span>
          </span>
        );

      case "basic":
        return (
          <span className="symbol symbol-50px me-3">
            <span className="symbol-label" id="ticket-icon-container">
              <img
                src={toAbsoluteUrl("/media/svg/afes/tickets/basic.svg")}
                className="w-100 h-100"
              />
            </span>
          </span>
        );

      default:
        break;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRolesApi,
  });

  const ROLES = useMemo(
    () =>
      data?.data?.map((role) => {
        return {
          label: role?.display_name,
          value: role?.name,
        };
      }),
    [data]
  );

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onBlur, onChange, ref, value } }) => {
        return (
          <Row xs={12} md={12} className="my-md-4">
            <Col xs={12} md={4}>
              <span className="d-flex align-items-center">
                {getIcon()}
                <span className="d-flex flex-column">
                  <span className="fw-bolder fs-6 ">{label}</span>
                  <span className="text-black">show privilege</span>
                </span>
              </span>
            </Col>

            <InputComponent
              control={control}
              errors={errors}
              label="Quantity"
              name="quantity"
              type="number"
              colXS={12}
              colMD={4}
            />

            <SelectComponent
              control={control}
              data={ROLES}
              errors={errors}
              label="Role"
              name="ticket_role"
              colXS={12}
              colMD={4}
            />
          </Row>
        );
      }}
    />
  );
};

export default TicketInput;
