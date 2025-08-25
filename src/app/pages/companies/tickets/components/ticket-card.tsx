import { useState } from "react";
import { Card, Col } from "react-bootstrap";
import { TicketsPrivilege } from "../../../../components";
import { ChevronRight, TicketIcon } from "lucide-react";

const TicketCard = ({
  ticket,
}: {
  ticket: {
    ids: string[];
    name: string;
    quantity: number;
    type: string;
    typeId: string;
  };
}) => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <Col xs={12} sm={6} md={6} lg={4} xl={3} className="mb-3 mb-lg-0">
      <Card className="h-md-150px">
        <Card.Body className="d-flex align-items-center justify-content-start column-gap-4">
          <TicketIcon width={50} height={50} stroke="#59efb2" />
          <div className="">
            <p className="fs-3 fw-bold m-0">Ticket {ticket.name}</p>
            <p className="fs-5 fw-medium m-0">Quantité : {ticket?.quantity}</p>
            <div className="w-100 d-flex flex-row align-items-center">
              <p
                className="fs-7 fw-medium m-0 cursor-pointer"
                onClick={() => {
                  setSelectedTicket(ticket?.type);
                }}
              >
                Afficher les privilèges
              </p>

              <ChevronRight stroke="#59efb2" width={16} height={16} />
            </div>
          </div>
        </Card.Body>
        <TicketsPrivilege
          isOpen={selectedTicket === null ? false : true}
          setIsOpen={setSelectedTicket}
          ticket={selectedTicket}
        />
      </Card>
    </Col>
  );
};

export default TicketCard;
