import {
  NIGERIAN_STATES,
  SHIPPING_RATES,
  INTERNATIONAL_ZONES,
  DEFAULT_INTERNATIONAL_ZONE,
  DHL_DOMESTIC_ZONE_BY_STATE,
  DEFAULT_DOMESTIC_ZONE,
  KG_PER_ITEM,
  getGUORate,
} from "./shippingConfig";
import {
  DHL_EXPORT_RATES,
  DHL_DOMESTIC_RATES,
  DHL_MAX_KG,
  lookupRate,
} from "./dhlRates";

const DOMESTIC_ZONE_INDEX = { A: 0, B: 1, C: 2 };

// Chargeable weight for a cart. Every garment is billed at KG_PER_ITEM, so
// each extra unit adds that much again.
export const getCartWeightKg = (cartItems) =>
  (cartItems || []).reduce((kg, item) => kg + (item?.quantity || 0) * KG_PER_ITEM, 0);

// DHL publishes rates to DHL_MAX_KG and refers anything heavier to an
// account manager. Rather than leaving a shopper with no way to check out,
// quote the heaviest published break and flag that it needs confirming.
const quoteDhl = (table, weightKg, zoneIndex) => {
  const capped = Math.min(weightKg, DHL_MAX_KG);
  const cost = lookupRate(table, capped, zoneIndex);
  if (cost === null) return null;
  return {
    cost,
    needsQuote: weightKg > DHL_MAX_KG,
  };
};

export const calculateShippingRates = (country, state, cartItems) => {
  const rates = [];
  const subtotal = cartItems.reduce(
    (total, item) => total + (item?.price || 0) * (item?.quantity || 0),
    0
  );
  const weightKg = getCartWeightKg(cartItems);

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

      // DHL Nigeria — weight-based, from the published domestic rate card
      const domesticZone =
        DHL_DOMESTIC_ZONE_BY_STATE[state] || DEFAULT_DOMESTIC_ZONE;
      const dhl = quoteDhl(
        DHL_DOMESTIC_RATES,
        weightKg,
        DOMESTIC_ZONE_INDEX[domesticZone],
      );
      if (dhl) {
        rates.push({
          provider: "DHL Nigeria",
          service: "Express Delivery",
          cost: dhl.cost,
          deliveryDays: "2-4 business days",
          estimatedDelivery: calculateDeliveryDate(2, 4),
          zone: `Zone ${domesticZone}`,
          weightKg,
          notes: dhl.needsQuote
            ? `Over ${DHL_MAX_KG}kg — final shipping confirmed after ordering`
            : "",
        });
      }
    }
  } else {
    // International shipping - DHL only, weight-based
    const zone = INTERNATIONAL_ZONES[country] || DEFAULT_INTERNATIONAL_ZONE;
    const dhl = quoteDhl(DHL_EXPORT_RATES, weightKg, zone - 1);

    if (dhl) {
      rates.push({
        provider: "DHL International",
        service: "International Express",
        cost: dhl.cost,
        deliveryDays: "5-10 business days",
        estimatedDelivery: calculateDeliveryDate(5, 10),
        zone: `Zone ${zone}`,
        weightKg,
        notes: dhl.needsQuote
          ? `Over ${DHL_MAX_KG}kg — final shipping confirmed after ordering`
          : "",
      });
    }
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
