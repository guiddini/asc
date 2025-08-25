import { ArrowUpRight, CircleCheck, MoveUpRight } from "lucide-react";
import React, { useState } from "react";
import { ConfirmationModal } from "./ticket-confirmation-modal";
import { useSearchParams } from "react-router-dom";

interface PricingFeature {
  text: string;
}

interface PricingCardProps {
  category?: string;
  title: string;
  duration: string;
  features: PricingFeature[];
  pricePerPerson?: boolean;
  price: number;
  slug: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  category,
  title,
  duration,
  features,
  pricePerPerson = false,
  price,
  slug,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const canViewModal = isModalOpen && searchParams.toString() === "";

  return (
    <div className="pricing-card">
      {category && <div className="pricing-category">{category}</div>}
      <div className="pricing-header">
        <h3 className="pricing-title">{title}</h3>
        <div className="pricing-duration">{duration}</div>
      </div>

      <div className="pricing-features">
        <p className="features-title">Ce ticket inclut :</p>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>
              <CircleCheck
                className="pricing-check-icon"
                fill="#50D7A0"
                stroke="#fff"
              />
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {pricePerPerson && (
        <div className="price-per-person">
          <span>TARIF PAR</span>
          <span>PERSONNE</span>
        </div>
      )}

      <button
        className="reserve-button"
        onClick={() => {
          setIsModalOpen(true);
          setSearchParams({});
        }}
      >
        Réserver un ticket
        <ArrowUpRight className="arrow-icon" />
      </button>

      {canViewModal && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          ticketData={{
            category,
            title,
            price,
            slug,
          }}
        />
      )}
    </div>
  );
};
