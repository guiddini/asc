import { Control } from "react-hook-form";
import { SelectComponent } from "..";
import { useMemo } from "react";
import { useTicket } from "../../hooks";

interface TicketTypesSelectProps {
  control: Control;
  errors: any;
  colXS?: number;
  colMD?: number;
  defaultValue?: {
    label: string;
    value: string;
  };
  name?: string;
}

export const TicketTypesSelect = ({
  control,
  errors,
  colMD,
  colXS,
  defaultValue,
  name,
}: TicketTypesSelectProps) => {
  const { TICKET_TYPES, gettingTicketTypes } = useTicket();

  const TICKETS = useMemo(
    () =>
      TICKET_TYPES?.map((ticket) => {
        return {
          label: ticket?.name,
          value: ticket?.name,
        };
      }),
    []
  );

  return (
    <SelectComponent
      control={control}
      data={TICKETS}
      errors={errors}
      label="Ticket type"
      name={name || "ticket_name"}
      noOptionMessage=""
      colMD={colMD}
      colXS={colXS}
      isLoading={gettingTicketTypes}
      defaultValue={defaultValue}
    />
  );
};
