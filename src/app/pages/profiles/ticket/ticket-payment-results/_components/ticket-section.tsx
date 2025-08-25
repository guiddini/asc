import { PricingCard } from "../../_components/pricing-card";
import { tickets } from "../../../../../utils/tickets";

const TicketSection = () => {
  return (
    <div id="pricing-grid">
      {tickets?.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </div>
  );
};

export default TicketSection;
