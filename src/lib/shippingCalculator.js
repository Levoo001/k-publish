// src/lib/shippingCalculator.js

import { NIGERIAN_STATES, SHIPPING_RATES, INTERNATIONAL_ZONES } from './shippingConfig';

export const calculateShippingRates = (country, state, cartItems) => {
    const rates = [];

    if (country.toLowerCase() === 'nigeria') {
        // Domestic shipping - both GIG and DHL
        const stateData = NIGERIAN_STATES[state];

        if (stateData) {
            // GIG Logistics rate
            const gigRate = SHIPPING_RATES.domestic['GIG Logistics'][stateData.gig];
            rates.push({
                provider: 'GIG Logistics',
                service: 'Standard Delivery',
                cost: gigRate,
                deliveryDays: '3-5 business days',
                estimatedDelivery: calculateDeliveryDate(3, 5),
                zone: stateData.gig
            });

            // DHL Nigeria rate
            const dhlRate = SHIPPING_RATES.domestic['DHL Nigeria'][stateData.dhl];
            rates.push({
                provider: 'DHL Nigeria',
                service: 'Express Delivery',
                cost: dhlRate,
                deliveryDays: '2-4 business days',
                estimatedDelivery: calculateDeliveryDate(2, 4),
                zone: stateData.dhl
            });
        }
    } else {
        // International shipping - DHL only
        const zone = INTERNATIONAL_ZONES[country] || 'zone8'; // Default to most expensive zone
        const intlRate = SHIPPING_RATES.international['DHL International'][zone];

        rates.push({
            provider: 'DHL International',
            service: 'International Express',
            cost: intlRate,
            deliveryDays: '5-10 business days',
            estimatedDelivery: calculateDeliveryDate(5, 10),
            zone: zone
        });
    }

    return rates;
};

const calculateDeliveryDate = (minDays, maxDays) => {
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);

    minDate.setDate(today.getDate() + minDays);
    maxDate.setDate(today.getDate() + maxDays);

    return {
        min: minDate.toLocaleDateString(),
        max: maxDate.toLocaleDateString()
    };
};

export const getNigerianStates = () => {
    return Object.keys(NIGERIAN_STATES).sort();
};