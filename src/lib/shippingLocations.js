// src/lib/shippingLocations.js

export const SHIPPING_LOCATIONS = {
  domestic: [
    {
      provider: 'GIG Logistics',
      options: [
        { id: 'gig-north', name: 'North', fee: 4600 },
        { id: 'gig-south-main', name: 'South Main Cities', fee: 5500 },
        { id: 'gig-south-onforwarding', name: 'South Onforwarding Cities', fee: 6500 },
        { id: 'gig-special-cities', name: 'Special Cities (Calabar, Uyo, Akure, etc.)', fee: 6500 },
      ]
    },
    {
      provider: 'DHL Nigeria',
      options: [
        { id: 'dhl-north-central', name: 'North & North Central', fee: 5500 },
        { id: 'dhl-north-remote', name: 'Remote North Locations', fee: 7500 },
        { id: 'dhl-south-west', name: 'South/West & South East (Zone B)', fee: 5500 },
        { id: 'dhl-south-remote', name: 'Remote South West Locations', fee: 7500 },
        { id: 'dhl-south-south', name: 'South/South, South/West & South East', fee: 11700 },
        { id: 'dhl-south-south-remote', name: 'Remote South/South & South East', fee: 14000 },
      ]
    }
  ],
  international: [
    {
      provider: 'DHL International',
      options: [
        { id: 'int-zone1', name: 'Zone 1 (UK, Ireland, etc.)', fee: 65000 },
        { id: 'int-zone2', name: 'Zone 2 (West Africa)', fee: 72000 },
        { id: 'int-zone3', name: 'Zone 3 (USA, Canada, Mexico)', fee: 79000 },
        { id: 'int-zone4', name: 'Zone 4 (Europe)', fee: 87000 },
        { id: 'int-zone5', name: 'Zone 5 (Africa)', fee: 93000 },
        { id: 'int-zone6', name: 'Zone 6 (Middle East)', fee: 96000 },
        { id: 'int-zone7', name: 'Zone 7 (Asia & Australia)', fee: 104000 },
        { id: 'int-zone8', name: 'Zone 8 (Americas & Oceania)', fee: 108000 },
      ]
    }
  ]
};