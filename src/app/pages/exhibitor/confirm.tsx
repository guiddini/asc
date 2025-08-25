import { ArrowLeft, Check } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  calculateExhibitionDemandTotal,
  checkExhibitionDemandTransactionApi,
  createExhibitionDemandApi,
} from "../../apis/exhibition";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import ContactModal from "./components/contact-modal";

type PaymentTypePros = {
  paymentOption: "Online" | "Offline";
};

interface LocationState {
  companyId: string;
  standType: { label: string; value: string };
  spaceSize: { label: string; value: string };
}

interface PricingData {
  advertisingFee: number;
  cleaningFee: number;
  registrationFee: number;
  standCost: number;
  taxValue: number;
  totalAfterTax: number;
  totalExcludingTax: number;
  totalBeforeDiscount: number;
  discountPercentage: number;
  discountValue: number;
}

export default function ExhibitionConfirmation() {
  const navigate = useNavigate();

  const { data: hasDemand } = useQuery(
    "checkExhibitionDemand",
    async () => {
      const res = await checkExhibitionDemandTransactionApi();
      return res?.data || false;
    },
    {
      retry: 1,
      onError: (error) => {
        console.error("Error checking exhibition demand:", error);
      },
    }
  );

  const [showContactModal, setShowContactModal] = useState(false);

  if (hasDemand) {
    navigate("/company/stand/reservations");
  }

  const { control, watch } = useForm<PaymentTypePros>({
    defaultValues: {
      paymentOption: "Online",
    },
  });

  const activePaymentOption = watch("paymentOption");
  const [onlinePricing, setOnlinePricing] = useState<PricingData | null>(null);
  const [offlinePricing, setOfflinePricing] = useState<PricingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const createDemandMutation = useMutation({
    mutationFn: async (formData: FormData) =>
      await createExhibitionDemandApi(formData),
    mutationKey: ["create-exhibition-demand"],
  });

  const { companyId } = useParams();
  const location = useLocation();
  const { standType, spaceSize } = location.state as LocationState;

  useEffect(() => {
    calculateFees();
  }, []);

  const calculateFees = async () => {
    setIsLoading(true);
    try {
      const onlineFormData = new FormData();
      onlineFormData.append("stand_type", standType.value);
      onlineFormData.append("stand_size", spaceSize.value);
      onlineFormData.append("payment_type", "Online");

      const offlineFormData = new FormData();
      offlineFormData.append("stand_type", standType.value);
      offlineFormData.append("stand_size", spaceSize.value);
      offlineFormData.append("payment_type", "Offline");

      const [onlineResponse, offlineResponse] = await Promise.all([
        calculateExhibitionDemandTotal(onlineFormData),
        calculateExhibitionDemandTotal(offlineFormData),
      ]);

      setOnlinePricing(onlineResponse.data);
      setOfflinePricing(offlineResponse.data);
    } catch (error) {
      console.error("Error calculating fees:", error);
      toast.error("Une erreur s'est produite lors du calcul des frais.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    const formdata = new FormData();
    formdata.append("stand_type", standType.value);
    formdata.append("stand_size", spaceSize.value);
    formdata.append("payment_type", activePaymentOption);
    formdata.append("company_id", companyId);

    createDemandMutation.mutate(formdata, {
      onSuccess(data, variables, context) {
        if (activePaymentOption === "Offline") {
          navigate("/company/stand/reservations");
        } else {
          toast.loading("Online payment proccessing");
          const returnUrl = data?.data;
          window.location.href = returnUrl;
        }
      },
      onError(error, variables, context) {
        console.error("error", error);
        toast.error(
          "Une erreur s'est produite lors de la création de la demande."
        );
      },
    });
  };

  if (isLoading || !onlinePricing || !offlinePricing) {
    return <div id="loading-state">Chargement...</div>;
  }

  const activePricing =
    activePaymentOption === "Online" ? onlinePricing : offlinePricing;

  return (
    <div id="exhibition-confirmation-container">
      <header id="exhibition-confirmation-header">
        <button id="exhibition-confirmation-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <img
          src="/media/eventili/logos/logo-bg-dark.svg"
          alt="African Startup Conference"
          id="exhibition-confirmation-logo"
        />
      </header>

      <main id="exhibition-confirmation-content">
        <span id="exhibition-confirmation-label">
          FINALISEZ VOTRE RÉSERVATION DE STAND D'EXPOSITION
        </span>

        <h1 id="exhibition-confirmation-title">Complétez Votre Réservation</h1>

        <p id="exhibition-confirmation-description">
          Choisissez votre mode de paiement préféré et confirmez votre stand
          pour présenter votre entreprise lors de l'événement.
        </p>

        <div id="exhibition-confirmation-options">
          <Controller
            name="paymentOption"
            control={control}
            render={({ field }) => (
              <>
                <div
                  id="exhibition-confirmation-online"
                  className={activePaymentOption === "Online" ? "active" : ""}
                  onClick={() => field.onChange("Online")}
                >
                  <div id="exhibition-confirmation-card-header">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <h2>Paiement En Ligne</h2>
                      <img
                        src="/media/eventili/dahabia.png"
                        alt="CIB/Dahabia"
                        width="30"
                      />
                    </div>
                    <div id="exhibition-confirmation-price">
                      <span id="exhibition-confirmation-amount">
                        {onlinePricing.totalAfterTax.toLocaleString()} Da
                      </span>
                      {onlinePricing.discountPercentage > 0 && (
                        <span id="exhibition-confirmation-discount">
                          -{onlinePricing.discountPercentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div id="exhibition-confirmation-benefit">
                    <Check id="exhibition-confirmation-check" />
                    <span>Réservez votre stand dès maintenant.</span>
                  </div>
                </div>

                <div
                  id="exhibition-confirmation-later"
                  className={activePaymentOption === "Offline" ? "active" : ""}
                  onClick={() => field.onChange("Offline")}
                >
                  <div id="exhibition-confirmation-card-header">
                    <h2>Payez Autrement</h2>
                    <div id="exhibition-confirmation-price">
                      <span id="exhibition-confirmation-amount">
                        {offlinePricing.totalAfterTax.toLocaleString()} Da
                      </span>
                    </div>
                  </div>
                  <div id="exhibition-confirmation-benefit">
                    <Check id="exhibition-confirmation-check" />
                    <span>
                      Réservez votre stand maintenant et payez plus tard.
                    </span>
                  </div>
                </div>
              </>
            )}
          />
        </div>

        <div
          id="exhibition-confirmation-help"
          role="button"
          onClick={() => setShowContactModal(true)}
        >
          <span>Besoin d'aide?</span>
          <button id="exhibition-confirmation-help-button">?</button>
        </div>

        <section id="exhibition-confirmation-invoice">
          <h3>Facture de la réservation</h3>

          <div id="exhibition-confirmation-invoice-items">
            <div id="exhibition-confirmation-invoice-item">
              <span>Stand Aménagé</span>
              <span>{activePricing.standCost.toLocaleString()} DZD</span>
            </div>
            <div id="exhibition-confirmation-invoice-item">
              <span>Drois d'inscriptions</span>
              <span>{activePricing.registrationFee.toLocaleString()} DZD</span>
            </div>
            <div id="exhibition-confirmation-invoice-item">
              <span>Nettoyage du stand</span>
              <span>{activePricing.cleaningFee.toLocaleString()} DZD</span>
            </div>
            <div id="exhibition-confirmation-invoice-item">
              <span>Display</span>
              <span>{activePricing.advertisingFee.toLocaleString()} DZD</span>
            </div>

            {activePricing.discountValue > 0 && (
              <div id="exhibition-confirmation-subtotal">
                <span>Remise ({activePricing.discountPercentage}%)</span>
                <span>-{activePricing.discountValue.toLocaleString()} DZD</span>
              </div>
            )}

            <div id="exhibition-confirmation-subtotal-line">
              <span>Total (HT)</span>
              <span>
                {activePricing.totalExcludingTax.toLocaleString()} DZD
              </span>
            </div>

            <div id="exhibition-confirmation-tax">
              <span>TVA ({(activePricing.taxValue * 100).toFixed(0)}%)</span>
              <span>
                {(
                  activePricing.totalAfterTax - activePricing.totalExcludingTax
                ).toLocaleString()}{" "}
                DZD
              </span>
            </div>

            <div id="exhibition-confirmation-total">
              <span>Total (TTC)</span>
              <span>{activePricing.totalAfterTax.toLocaleString()} DA</span>
            </div>
          </div>
        </section>

        <div id="exhibition-confirmation-actions">
          <button
            id="exhibition-confirmation-back-btn"
            onClick={() => navigate(-1)}
          >
            Retour
          </button>
          <button
            id="exhibition-confirmation-proceed-btn"
            onClick={handleProceed}
          >
            Valider
          </button>
        </div>
      </main>
      {showContactModal && (
        <ContactModal
          show={showContactModal}
          onHide={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}
