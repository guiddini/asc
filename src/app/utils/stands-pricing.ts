interface PricingInput {
  standType: string;
  spaceSize: string;
}

interface PricingOutput {
  standPrice: number;
  registrationFee: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const calculatePricing = (input: PricingInput): PricingOutput => {
  // Define pricing rules
  const standPrices: { [key: string]: number } = {
    "stand-amenage-9": 120000,
    "stand-amenage-12": 160000,
    "stand-amenage-18": 240000,
    "stand-amenage-21": 280000,
    "stand-amenage-30": 400000,
    "espace-nu-9": 90000,
    "espace-nu-12": 120000,
    "espace-nu-18": 180000,
    "espace-nu-21": 210000,
    "espace-nu-30": 300000,
    "startup-amenage-3": 40000,
    "startup-nu-3": 30000,
  };

  const standPrice = standPrices[`${input.standType}-${input.spaceSize}`] || 0;
  const registrationFee = 0;

  const subtotal = standPrice + registrationFee;
  const tax = subtotal * 0.19; // 19% TVA
  const total = subtotal + tax;

  return {
    standPrice,
    registrationFee,
    subtotal,
    tax,
    total,
  };
};
