import { Route, Routes } from "react-router-dom";
import { EntityProfilePage } from "./page";
import ProfileLayout from "./layout";
import TicketsPage from "./ticket/page";
import ConfirmTicketPayment from "./ticket/confirm-ticket-payment/page";
import TicketPaymentResults from "./ticket/ticket-payment-results/page";
import TickerBoughtSuccess from "./ticket/success-page/page";

const ProfileRoutes = () => {
  return (
    <Routes>
      {/* <Route element={<ProfileLayout />}>
      </Route> */}
      <Route path="/:slug" element={<EntityProfilePage />} />
      <Route path="/:slug/tickets" element={<TicketsPage />} />
      <Route
        path="/:slug/tickets/confirm/:orderID"
        element={<ConfirmTicketPayment />}
      />
      <Route
        path="/:slug/tickets/results/:transactionID"
        element={<TicketPaymentResults />}
      />
      <Route path="/:slug/tickets/success" element={<TickerBoughtSuccess />} />
    </Routes>
  );
};

export default ProfileRoutes;
