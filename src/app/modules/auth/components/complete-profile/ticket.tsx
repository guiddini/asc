import { Col } from "react-bootstrap";
import { Control, Controller } from "react-hook-form";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import clsx from "clsx";
import { isError } from "../../../../helpers/errorMessage";

const TicketItem = ({
  ticket,
  control,
  errors,
}: {
  ticket: {
    name: string;
    ids: number[];
    quantity: number;
    type: string;
    typeId: string;
    source: string;
    role: string;
  };
  control: Control;
  errors?: any;
}) => {
  const getIcon = () => {
    switch (ticket.type) {
      case "free":
        return (
          <span className="w-50px me-3">
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
          <span className="w-50px me-3">
            <span className="symbol-label" id="ticket-icon-container">
              <img
                src={toAbsoluteUrl("/media/svg/afes/tickets/premium.svg")}
                className="w-100 h-100"
              />
            </span>
          </span>
        );

      case "business":
        return (
          <span className="w-50px me-3">
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
          <span className="w-50px me-3">
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

  return (
    <Controller
      control={control}
      name="ticket"
      disabled={ticket?.quantity === 0}
      render={({ field: { onChange, value, disabled } }) => {
        return (
          <Col xs={12} md={12}>
            <label
              className={clsx(
                "d-flex align-items-center justify-content-between cursor-pointer mb-6",
                {
                  "border border-1 border-danger p-2 rounded-2": isError(
                    errors,
                    "ticket"
                  ),
                }
              )}
            >
              <span className="d-flex align-items-center me-20">
                {getIcon()}
                <span className="d-flex flex-column">
                  <span className="fw-bolder fs-6 ">{ticket.name}</span>
                  <span className="text-black">
                    Rôle du ticket : {ticket?.role}
                  </span>
                </span>
              </span>

              <span className="form-check form-check-custom form-check-solid">
                <span className="fw-bolder fs-7 me-4">
                  ({ticket.quantity} ticket disponible)
                </span>
                <input
                  className={clsx("form-check-input", {
                    "border border-4 border-danger": isError(errors, "ticket"),
                  })}
                  type="radio"
                  name="appFramework"
                  value={ticket.name}
                  checked={
                    value?.name === ticket?.name &&
                    value?.source === ticket?.source &&
                    value?.role === ticket?.role
                  }
                  onChange={() => {
                    if (!disabled || ticket?.quantity !== 0) {
                      onChange(ticket);
                    }
                  }}
                  disabled={disabled || ticket?.quantity === 0}
                />
              </span>
            </label>
          </Col>
        );
      }}
    />
  );
};

export default TicketItem;
