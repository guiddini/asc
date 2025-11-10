import { Modal } from "react-bootstrap";
import { useScrollNavigation } from "../../hooks/useScrollNavigation";
import { tickets } from "../../utils/tickets";
import { Dispatch, SetStateAction } from "react";

interface Ticket {
  category: string;
  title: string;
  duration: string;
  features: { text: string }[];
  price: number;
  pricePerPerson?: boolean;
  slug: string;
}

const TicketColumn = ({
  price,
  features,
  title,
}: {
  title: string;
  price?: number;
  features: { text: string }[];
}) => {
  return (
    <div className="d-flex h-100 align-items-center">
      <div className="w-100 d-flex flex-column flex-center rounded-3 bg-light bg-opacity-75 py-15 px-10">
        <div className="mb-7 text-center">
          <div className="text-center">
            <span
              className="fs-3x fw-bold text-primary"
              data-kt-plan-price-month={price}
              data-kt-plan-price-annual={price}
            >
              {price}
            </span>
            <span className="mb-2 text-primary">DA</span>
            <span className="fs-7 fw-semibold opacity-50">
              /<span data-kt-element="period">3 JOURS</span>
            </span>
          </div>
        </div>
        <div className="w-100 mb-10">
          {features?.map((privilege, index) => (
            <div className="d-flex align-items-center mb-5" key={index}>
              <span className="fw-semibold fs-6 text-gray-800 flex-grow-1 pe-3">
                - {privilege?.text}
              </span>
              <i className="ki-outline ki-check-circle fs-1 text-success"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const TicketsPrivilege = ({
  isOpen,
  setIsOpen,
  ticket,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<string>>;
  ticket: string;
}) => {
  const closeModal = () => setIsOpen(null);

  const selectedTicket = tickets.find(
    (t) => t.slug?.toLocaleLowerCase() === ticket?.toLocaleLowerCase()
  ) as Ticket | undefined;

  const navigateAndScroll = useScrollNavigation();

  return (
    <Modal
      show={isOpen}
      onHide={closeModal}
      backdrop={true}
      id="kt_modal_create_app"
      tabIndex={-1}
      aria-hidden="true"
      dialogClassName="modal-dialog modal-dialog-centered mw-900px"
    >
      <Modal.Body>
        <div
          className="content d-flex flex-column flex-column-fluid"
          id="kt_content"
        >
          <div id="kt_content_container" className="container-xxl">
            <div className="card" id="kt_pricing">
              <div className="card-body p-lg-17">
                <div className="d-flex flex-column">
                  <div className="mb-13 text-center">
                    <h1 className="fs-2hx fw-bold mb-5">
                      Ticket {selectedTicket?.category}
                    </h1>
                    <div className="fs-5  fw-bold">
                      If you need more information about our pricing, please{" "}
                      <span role="button" className="link-primary">
                        visit our website
                      </span>
                    </div>
                  </div>
                  <div className="row g-10 justify-content-center">
                    {selectedTicket && (
                      <TicketColumn
                        title={selectedTicket.title}
                        price={selectedTicket.price}
                        features={selectedTicket.features}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
