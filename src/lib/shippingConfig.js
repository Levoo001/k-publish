// src/lib/shippingConfig.js

// Nigerian states mapping to shipping zones
export const NIGERIAN_STATES = {
    // GIG Logistics Zones
    'Lagos': { gig: 'south-main', dhl: 'south-west' },
    'Abuja': { gig: 'north', dhl: 'north-central' },
    'Rivers': { gig: 'south-main', dhl: 'south-south' },
    'Delta': { gig: 'south-main', dhl: 'south-south' },
    'Anambra': { gig: 'south-onforwarding', dhl: 'south-south' },
    'Enugu': { gig: 'south-onforwarding', dhl: 'south-south' },
    'Imo': { gig: 'south-onforwarding', dhl: 'south-south' },
    'Ogun': { gig: 'south-main', dhl: 'south-west' },
    'Oyo': { gig: 'south-main', dhl: 'south-west' },
    'Kano': { gig: 'north', dhl: 'north-remote' },
    'Kaduna': { gig: 'north', dhl: 'north-central' },
    'Edo': { gig: 'south-main', dhl: 'south-south' },
    'Plateau': { gig: 'north', dhl: 'north-central' },
    'Cross River': { gig: 'special-cities', dhl: 'south-south-remote' },
    'Akwa Ibom': { gig: 'special-cities', dhl: 'south-south-remote' },
    'Ondo': { gig: 'special-cities', dhl: 'south-west' },
    'Kwara': { gig: 'north', dhl: 'north-central' },
    'Bayelsa': { gig: 'south-onforwarding', dhl: 'south-south-remote' },
    'Osun': { gig: 'south-main', dhl: 'south-west' },
    'Benue': { gig: 'north', dhl: 'north-central' },
    'Nasarawa': { gig: 'north', dhl: 'north-central' },
    'Niger': { gig: 'north', dhl: 'north-remote' },
    'Borno': { gig: 'north', dhl: 'north-remote' },
    'Adamawa': { gig: 'north', dhl: 'north-remote' },
    'Taraba': { gig: 'north', dhl: 'north-remote' },
    'Gombe': { gig: 'north', dhl: 'north-remote' },
    'Yobe': { gig: 'north', dhl: 'north-remote' },
    'Zamfara': { gig: 'north', dhl: 'north-remote' },
    'Kebbi': { gig: 'north', dhl: 'north-remote' },
    'Sokoto': { gig: 'north', dhl: 'north-remote' },
    'Katsina': { gig: 'north', dhl: 'north-remote' },
    'Jigawa': { gig: 'north', dhl: 'north-remote' },
    'Bauchi': { gig: 'north', dhl: 'north-remote' },
    'Ekiti': { gig: 'special-cities', dhl: 'south-west' },
    'Ebonyi': { gig: 'south-onforwarding', dhl: 'south-south' },
    'Abia': { gig: 'south-onforwarding', dhl: 'south-south' }
};

// Base shipping rates
export const SHIPPING_RATES = {
    domestic: {
        'GIG Logistics': {
            'north': 4600,
            'south-main': 5500,
            'south-onforwarding': 6500,
            'special-cities': 6500
        },
        'DHL Nigeria': {
            'north-central': 5500,
            'north-remote': 7500,
            'south-west': 5500,
            'south-remote': 7500,
            'south-south': 11700,
            'south-south-remote': 14000
        }
    },
    international: {
        'DHL International': {
            'zone1': 65000, // UK, Ireland
            'zone2': 72000, // West Africa
            'zone3': 79000, // USA, Canada, Mexico
            'zone4': 87000, // Europe
            'zone5': 93000, // Africa
            'zone6': 96000, // Middle East
            'zone7': 104000, // Asia & Australia
            'zone8': 108000 // Americas & Oceania
        }
    }
};

// International zones mapping
export const INTERNATIONAL_ZONES = {
    'United Kingdom': 'zone1',
    'Ireland': 'zone1',
    'United States': 'zone3',
    'Canada': 'zone3',
    'Ghana': 'zone2',
    'South Africa': 'zone5',
    'Germany': 'zone4',
    'France': 'zone4',
    'China': 'zone7',
    'Australia': 'zone7',
    'United Arab Emirates': 'zone6',
    // Add more countries as needed
};