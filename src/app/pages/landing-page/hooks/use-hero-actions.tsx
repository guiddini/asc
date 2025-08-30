import { useState } from "react";

interface HeroActionsReturn {
  handleBookTickets: () => void;
  handlePartnerWithUs: () => void;
  isBookingLoading: boolean;
  isPartnerLoading: boolean;
}

export const useHeroActions = (): HeroActionsReturn => {
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isPartnerLoading, setIsPartnerLoading] = useState(false);

  const handleBookTickets = async () => {
    setIsBookingLoading(true);

    try {
      // Simulate API call or redirect logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to booking page or open booking modal
      window.location.href = "/tickets/book";
    } catch (error) {
      console.error("Error booking tickets:", error);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handlePartnerWithUs = async () => {
    setIsPartnerLoading(true);

    try {
      // Simulate API call or redirect logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to partnership page or open partnership modal
      window.location.href = "/partners/join";
    } catch (error) {
      console.error("Error opening partnership:", error);
    } finally {
      setIsPartnerLoading(false);
    }
  };

  return {
    handleBookTickets,
    handlePartnerWithUs,
    isBookingLoading,
    isPartnerLoading,
  };
};
