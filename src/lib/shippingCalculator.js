import {
  NIGERIAN_STATES,
  SHIPPING_RATES,
  INTERNATIONAL_ZONES,
  getGUORate,
} from "./shippingConfig";

export const calculateShippingRates = (country, state, cartItems) => {
  const rates = [];
  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );

  if (country.toLowerCase() === "nigeria") {
    // Domestic shipping
    const stateData = NIGERIAN_STATES[state];

    if (stateData) {
      // GIG Logistics rate
      const gigRate = SHIPPING_RATES.domestic["GIG Logistics"][stateData.gig];
      rates.push({
        provider: "GIG Logistics",
        service: "Standard Delivery",
        cost: gigRate,
        deliveryDays: "3-5 business days",
        estimatedDelivery: calculateDeliveryDate(3, 5),
        zone: stateData.gig,
      });

      // GUO Logistics rate (if available for this state)
      if (stateData.guo) {
        const guoRate = getGUORate(stateData, subtotal);
        if (guoRate !== null) {
          rates.push({
            provider: "GUO Logistics",
            service: "Standard Delivery",
            cost: guoRate,
            deliveryDays: "3-6 business days",
            estimatedDelivery: calculateDeliveryDate(3, 6),
            zone: stateData.guo,
            notes: subtotal >= 100000 ? "High-value order rate applied" : "",
          });
        }
      }

      // DHL Nigeria rate
      const dhlRate = SHIPPING_RATES.domestic["DHL Nigeria"][stateData.dhl];
      rates.push({
        provider: "DHL Nigeria",
        service: "Express Delivery",
        cost: dhlRate,
        deliveryDays: "2-4 business days",
        estimatedDelivery: calculateDeliveryDate(2, 4),
        zone: stateData.dhl,
      });
    }
  } else {
    // International shipping - DHL only
    const zone = INTERNATIONAL_ZONES[country] || "zone8";
    const intlRate = SHIPPING_RATES.international["DHL International"][zone];

    rates.push({
      provider: "DHL International",
      service: "International Express",
      cost: intlRate,
      deliveryDays: "5-10 business days",
      estimatedDelivery: calculateDeliveryDate(5, 10),
      zone: zone,
    });
  }

  // Sort rates by cost (cheapest first)
  return rates.sort((a, b) => a.cost - b.cost);
};

const calculateDeliveryDate = (minDays, maxDays) => {
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);

  minDate.setDate(today.getDate() + minDays);
  maxDate.setDate(today.getDate() + maxDays);

  return {
    min: minDate.toLocaleDateString(),
    max: maxDate.toLocaleDateString(),
  };
};

export const getNigerianStates = () => {
  return Object.keys(NIGERIAN_STATES).sort();
};

// Helper function to check if state has GUO service
export const hasGUOService = (state) => {
  const stateData = NIGERIAN_STATES[state];
  return stateData && stateData.guo !== null;
};

// Helper function to get GUO service note
export const getGUOServiceNote = (state, subtotal) => {
  const stateData = NIGERIAN_STATES[state];
  if (!stateData || !stateData.guo) return "";

  if (subtotal >= 100000) {
    return "High-value order rate (₦6,000) applies";
  }

  return "Standard rate (₦5,000) applies";
};

// Add this function to get GUO rate explanation
export const getGUORateExplanation = (state, subtotal) => {
  const stateData = NIGERIAN_STATES[state];
  if (!stateData || !stateData.guo) return "";

  const baseRate = SHIPPING_RATES.domestic["GUO Logistics"]["western-states"];
  const highValueRate =
    SHIPPING_RATES.domestic["GUO Logistics"]["western-states-high-value"];

  if (subtotal >= 100000) {
    return `GUO Logistics: ₦${baseRate.toLocaleString()} → ₦${highValueRate.toLocaleString()} (High-value order)`;
  }

  return `GUO Logistics: ₦${baseRate.toLocaleString()} (Standard rate)`;
};
