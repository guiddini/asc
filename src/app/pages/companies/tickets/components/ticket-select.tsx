import React from "react";
import { Control } from "react-hook-form";
import TicketItem from "../../../../modules/auth/components/complete-profile/ticket";

type Ticket = {
  name: string;
  ids: number[];
  quantity: number;
  type: string;
  typeId: string;
  source: string;
  role: string;
};

interface SelectComponentProps {
  control: Control;
  ownedTickets: Ticket[];
  giftedTickets?: Ticket[];
  errors?: any;
}

const TicketSelect: React.FC<SelectComponentProps> = (props) => {
  return (
    <>
      {props.ownedTickets && props.ownedTickets.length > 0 && (
        <>
          <h2 className="mb-3">Tickets détenus</h2>
          {props.ownedTickets.map((ticket, index) => (
            <TicketItem
              key={index}
              ticket={ticket}
              control={props.control as any}
              errors={props?.errors}
            />
          ))}
        </>
      )}
      {props.giftedTickets && props.giftedTickets.length > 0 && (
        <>
          <h2 className="mb-3">Tickets offertes</h2>
          {props.giftedTickets.map((ticket, index) => (
            <TicketItem
              key={index}
              ticket={ticket}
              control={props.control as any}
              errors={props?.errors}
            />
          ))}
        </>
      )}
    </>
  );
};

export default TicketSelect;
