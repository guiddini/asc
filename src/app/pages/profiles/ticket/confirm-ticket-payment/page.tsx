import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Lottie from "react-lottie";
import Loader from "../../../../../../public/media/eventili/lotties/loader.json";

interface PaymentParams {
  orderNumber: string;
  orderId: string;
  total: string;
  bool: string;
}

const ConfirmTicketPayment = () => {
  const location = useLocation();
  const [paymentParams, setPaymentParams] = useState<PaymentParams | null>(
    null
  );
  const { orderID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const orderNumber = searchParams.get("orderNumber") as string;
    const orderId: string = searchParams.get("orderId") as string;
    const total: string = searchParams.get("total") as string;
    const bool = searchParams.get("bool") as string;
    if (orderNumber || orderId || total || bool) {
      setPaymentParams({
        orderId,
        bool,
        orderNumber,
        total,
      });
    }
  }, [location]);

  useEffect(() => {
    if (paymentParams) {
      const redirect = `https://test.satim.guiddini.dz/SATIM-WFGWX-YVC9B-4J6C9/${
        import.meta.env.VITE_APP_SATIM_LICENSE
      }/returnCib.php?gatewayOrderId=${paymentParams.orderId}&orderNumber=${
        paymentParams.orderNumber
      }&returnUrl=${
        import.meta.env.VITE_APP_PANEL_BASEURL
      }/profiles/asc/tickets/results/${orderID}`;
      window.location.href = redirect;
    }
  }, [paymentParams, navigate]);
  // return paymentParams ? null : (
  return (
    <div id="ticket-payment-confirmation">
      <Lottie
        isClickToPauseDisabled={true}
        options={{
          loop: true,
          animationData: Loader,
        }}
        height={350}
      />
      <h2>Paiement en cours</h2>
      <p>
        Veuillez patienter pendant que nous traitons votre paiement. Ne fermez
        pas cette fenêtre.
      </p>
    </div>
  );
};

export default ConfirmTicketPayment;
