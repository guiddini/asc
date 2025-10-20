import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useParams, Link } from "react-router-dom";
import { showExhibitionDemandApi } from "../../../apis/exhibition";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";

interface TransactionData {
  data: {
    type: string;
    id: string;
    attributes: {
      amount: string;
      order_number: string;
      order_id: string;
      status: string;
      deposit_amount: string;
      auth_code: string;
      params: any[];
      action_code: string;
      action_code_description: string;
      error_code: string;
      error_message: string;
      confirmation_status: string;
      license_env: string;
      form_url: string;
      svfe_response: any;
      pan: any;
      ip_address: any;
      approval_code: any;
      updated_at: string;
    };
    links: {
      self: string;
      href: string;
    };
  };
  meta: {
    code: string;
    message: string;
  };
}

const OnlinePaymentResultsPage = () => {
  const { demand_id } = useParams();
  const [transactionData, setTransactionData] =
    useState<TransactionData | null>(null);

  const { mutate, isLoading, error } = useMutation({
    mutationFn: () => showExhibitionDemandApi(demand_id),
    mutationKey: ["exhibition-demand", demand_id],
    onSuccess: (data: TransactionData) => {
      setTransactionData(data);
    },
    onError: (error) => {},
  });

  useEffect(() => {
    if (demand_id) {
      mutate();
    }
  }, [mutate, demand_id]);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading payment results...</p>
      </div>
    );
  }

  if (error || !transactionData) {
    return (
      <div className="container py-5">
        <Card>
          <Card.Body className="text-center py-5">
            <XCircle size={64} className="text-danger mb-3" />
            <h3>Error Loading Payment Results</h3>
            <p className="text-muted">
              Unable to retrieve transaction information.
            </p>
            <Link to="/startup/demand">
              <Button variant="primary">
                <ArrowLeft size={16} className="me-2" />
                Back to Reservations
              </Button>
            </Link>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const { attributes } = transactionData.data;
  const isSuccess = ["completed", "success", "paid"].includes(
    attributes.status.toLowerCase()
  );
  const gatewayMessage =
    attributes.action_code_description ||
    attributes.error_message ||
    "No message available";

  return (
    <div className="container py-5">
      <Card>
        <Card.Body>
          {/* Header */}
          <div className="text-center mb-4">
            {isSuccess ? (
              <>
                <CheckCircle size={64} className="text-success mb-3" />
                <h2 className="text-success">Payment Successful!</h2>
                <p className="text-muted">{gatewayMessage}</p>
              </>
            ) : (
              <>
                <XCircle size={64} className="text-danger mb-3" />
                <h2 className="text-danger">Payment Failed</h2>
                <p className="text-muted">
                  There was an issue processing your payment.
                </p>
              </>
            )}
          </div>

          {/* Transaction Details */}
          <div className="row">
            <div className="col-md-8 mx-auto">
              <div className="table-responsive">
                <table className="table table-borderless">
                  <tbody>
                    {isSuccess && (
                      <>
                        <tr>
                          <td className="fw-semibold">Amount Paid:</td>
                          <td>{attributes?.amount}.00 DZD</td>
                        </tr>
                        {attributes.approval_code && (
                          <tr>
                            <td className="fw-semibold">Authorization Code:</td>
                            <td>{attributes.approval_code}</td>
                          </tr>
                        )}
                        {attributes.order_number && (
                          <tr>
                            <td className="fw-semibold">Order number:</td>
                            <td>{attributes.order_number}</td>
                          </tr>
                        )}
                        {attributes.order_id && (
                          <tr>
                            <td className="fw-semibold">Transaction ID:</td>
                            <td>{attributes.order_id}</td>
                          </tr>
                        )}
                        <tr>
                          <td className="fw-semibold">Payment Method:</td>
                          <td>
                            <img
                              src="/media/eventili/dahabia.png"
                              alt="Dahabia"
                              className="me-2"
                              style={{
                                width: 18,
                                height: 18,
                                objectFit: "contain",
                              }}
                            />
                            CIB / EDAHABIA
                          </td>
                        </tr>
                      </>
                    )}
                    <tr>
                      <td className="fw-semibold">Transaction Date:</td>
                      <td>
                        {new Date(attributes.updated_at).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* SATIM Contact Information */}
          <div className="row mt-5">
            <div className="col-md-8 mx-auto">
              <div className="border-top pt-4">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <p className="mb-0 text-muted">
                    En cas de problème avec votre carte CIB, contactez la SATIM
                  </p>
                  <br />
                  <img
                    src="/media/eventili/satim.png"
                    alt="SATIM"
                    style={{ height: "40px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-4">
            <Link to="/startup/demand">
              <Button variant="primary">
                <ArrowLeft size={16} className="me-2" />
                Back to Reservations
              </Button>
            </Link>
            {/* {isSuccess && transactionData.data.links?.href && (
              <a
                href={transactionData.data.links.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary ms-2"
              >
                Download Receipt
              </a>
            )} */}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OnlinePaymentResultsPage;
