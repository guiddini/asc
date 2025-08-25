import { useParams } from "react-router-dom";
import SuccessPayment from "./_components/success-payment";
import FailedPayment from "./_components/failed-payment";
import { useQuery } from "react-query";
import { getTicketTransactionApi } from "../../../../apis";
import Navbar from "../../_components/navbar";

export interface SubscriptionTransaction {
  id: string;
  ticket_id: string;
  user_id: string;
  order_id: string;
  gateway_order_id: string;
  gateway_bool: string;
  gateway_response_message: string;
  gateway_error_code: string;
  gateway_code: string | null;
  status: string;
  quantity: number;
  total: number;
  created_at: string;
  updated_at: string;
  email: string | null;
}

const TicketPaymentResults = () => {
  const { transactionID } = useParams();
  const { data, isSuccess, isError } = useQuery({
    queryFn: () => getTicketTransactionApi(String(transactionID)),
    enabled: !!transactionID,
    queryKey: ["ticket-payment-results", transactionID],
  });

  const transactionData = data?.data;

  // Conditionally render based on transaction status
  if (isError) {
    return <div>Error loading payment details.</div>;
  }

  if (!transactionData) {
    return <div>Loading...</div>;
  }

  // Check for success or failure based on gateway_bool and gateway_response_message
  const isSuccessPayment =
    transactionData.gateway_bool === "1" &&
    transactionData.status === "Success";
  const isFailedPayment =
    transactionData.gateway_bool !== "1" || transactionData.status === "Failed";

  return (
    <div>
      <Navbar />
      {isSuccessPayment ? (
        <SuccessPayment subscriptionData={transactionData} />
      ) : isFailedPayment ? (
        <FailedPayment subscriptionData={transactionData} />
      ) : (
        <div>Unknown transaction status</div>
      )}
    </div>
  );
};

export default TicketPaymentResults;
