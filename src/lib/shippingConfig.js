// src/lib/shippingConfig.js

export const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// Nigerian states mapping to shipping zones - CORRECTED FOR GUO
export const NIGERIAN_STATES = {
  // GIG Logistics Zones
  Lagos: {
    gig: "south-main",
    guo: "western-states", // GUO available for Western states only
  },
  Abuja: {
    gig: "north",
    guo: null, // NO GUO
  },
  Rivers: {
    gig: "south-main",
    guo: null, // NO GUO
  },
  Delta: {
    gig: "south-main",
    guo: null, // NO GUO
  },
  Anambra: {
    gig: "south-onforwarding",
    guo: null, // NO GUO
  },
  Enugu: {
    gig: "south-onforwarding",
    guo: null, // NO GUO
  },
  Imo: {
    gig: "south-onforwarding",
    guo: null, // NO GUO
  },
  Ogun: {
    gig: "south-main",
    guo: "western-states", // GUO available - same as Lagos
  },
  Oyo: {
    gig: "south-main",
    guo: "western-states", // GUO available - same as Lagos
  },
  Kano: {
    gig: "north",
    guo: null, // NO GUO
  },
  Kaduna: {
    gig: "north",
    guo: null, // NO GUO
  },
  Edo: {
    gig: "south-main",
    guo: "western-states", // GUO available - same as Lagos
  },
  Plateau: {
    gig: "north",
    guo: null, // NO GUO
  },
  "Cross River": {
    gig: "special-cities",
    guo: null, // NO GUO - You said GUO only for Western states
  },
  "Akwa Ibom": {
    gig: "special-cities",
    guo: null, // NO GUO - You said GUO only for Western states
  },
  Ondo: {
    gig: "special-cities",
    guo: "western-states", // GUO available - same as Lagos
  },
  Kwara: {
    gig: "north",
    guo: "western-states", // GUO available - same as Lagos
  },
  Bayelsa: {
    gig: "special-cities",
    guo: null, // NO GUO
  },
  Osun: {
    gig: "south-main",
    guo: "western-states", // GUO available - same as Lagos
  },
  Benue: {
    gig: "north",
    guo: null, // NO GUO
  },
  Nasarawa: {
    gig: "north",
    guo: null, // NO GUO
  },
  Niger: {
    gig: "north",
    guo: null, // NO GUO
  },
  Borno: {
    gig: "north",
    guo: null, // NO GUO
  },
  Adamawa: {
    gig: "north",
    guo: null, // NO GUO
  },
  Taraba: {
    gig: "north",
    guo: null, // NO GUO
  },
  Gombe: {
    gig: "north",
    guo: null, // NO GUO
  },
  Yobe: {
    gig: "north",
    guo: null, // NO GUO
  },
  Zamfara: {
    gig: "north",
    guo: null, // NO GUO
  },
  Kebbi: {
    gig: "north",
    guo: null, // NO GUO
  },
  Sokoto: {
    gig: "north",
    guo: null, // NO GUO
  },
  Katsina: {
    gig: "north",
    guo: null, // NO GUO
  },
  Jigawa: {
    gig: "north",
    guo: null, // NO GUO
  },
  Bauchi: {
    gig: "north",
    guo: null, // NO GUO
  },
  Ekiti: {
    gig: "special-cities",
    guo: "western-states", // GUO available - same as Lagos
  },
  Ebonyi: {
    gig: "south-onforwarding",
    guo: null, // NO GUO
  },
  Abia: {
    gig: "south-onforwarding",
    guo: null, // NO GUO
  },
};

// Base shipping rates - CORRECTED FOR YOUR REQUIREMENTS
export const SHIPPING_RATES = {
  domestic: {
    "GIG Logistics": {
      north: 4600,
      "south-main": 6500,
      "south-onforwarding": 6500,
      "special-cities": 6500,
    },
    "GUO Logistics": {
      "western-states": 5000,
      "western-states-high-value": 6000,
    },
  },
  // DHL rates are no longer flat per zone — they are weight-based and live
  // in ./dhlRates.js, keyed off the published rate card.
};

// Helper function to check if order value requires high-value shipping - UPDATED
export const getGUORate = (stateData, subtotal) => {
  if (!stateData || !stateData.guo) return null;

  // Apply high-value rates for orders above 100,000 Naira
  if (subtotal >= 100000) {
    // For Western states (all use the same pricing)
    if (stateData.guo === "western-states") {
      return SHIPPING_RATES.domestic["GUO Logistics"][
        "western-states-high-value"
      ];
    }
  }

  // Return standard rate
  return SHIPPING_RATES.domestic["GUO Logistics"][stateData.guo];
};

// Define which states get GUO service (Western states only)
export const GUO_WESTERN_STATES = [
  "Lagos",
  "Ogun",
  "Oyo",
  "Osun",
  "Ondo",
  "Ekiti",
  "Edo",
  "Kwara",
];

// ── DHL zones ────────────────────────────────────────────────────────────
// Country -> DHL zone (1-8), from the "CURRENT JULY 2026 C03" rate card
// zoning page. Used to index DHL_EXPORT_RATES in ./dhlRates.
export const INTERNATIONAL_ZONES = {
  // Zone 1
  Ireland: 1,
  "United Kingdom": 1,

  // Zone 2
  Benin: 2,
  "Burkina Faso": 2,
  "Cabo Verde": 2,
  Cameroon: 2,
  "Central African Republic": 2,
  Chad: 2,
  Congo: 2,
  "Equatorial Guinea": 2,
  Gabon: 2,
  Gambia: 2,
  Ghana: 2,
  Guinea: 2,
  "Guinea-Bissau": 2,
  Liberia: 2,
  Mali: 2,
  Niger: 2,
  "Sao Tome and Principe": 2,
  Senegal: 2,
  "Sierra Leone": 2,
  Togo: 2,

  // Zone 3
  Algeria: 3,
  Angola: 3,
  Botswana: 3,
  Burundi: 3,
  Comoros: 3,
  Djibouti: 3,
  Egypt: 3,
  Eritrea: 3,
  Eswatini: 3,
  Ethiopia: 3,
  Kenya: 3,
  Lesotho: 3,
  Libya: 3,
  Madagascar: 3,
  Malawi: 3,
  Mauritania: 3,
  Mauritius: 3,
  Morocco: 3,
  Mozambique: 3,
  Namibia: 3,
  Rwanda: 3,
  Seychelles: 3,
  Somalia: 3,
  "South Africa": 3,
  "South Sudan": 3,
  Sudan: 3,
  Tanzania: 3,
  Tunisia: 3,
  Uganda: 3,
  Zambia: 3,
  Zimbabwe: 3,

  // Zone 4
  Canada: 4,
  Mexico: 4,
  "United States": 4,

  // Zone 5
  Albania: 5,
  Andorra: 5,
  Austria: 5,
  Belarus: 5,
  Belgium: 5,
  "Bosnia and Herzegovina": 5,
  Bulgaria: 5,
  Croatia: 5,
  Cyprus: 5,
  "Czech Republic": 5,
  Denmark: 5,
  Estonia: 5,
  Finland: 5,
  France: 5,
  Germany: 5,
  Greece: 5,
  Hungary: 5,
  Iceland: 5,
  Italy: 5,
  Kosovo: 5,
  Latvia: 5,
  Liechtenstein: 5,
  Lithuania: 5,
  Luxembourg: 5,
  Malta: 5,
  Moldova: 5,
  Monaco: 5,
  Montenegro: 5,
  Netherlands: 5,
  "North Macedonia": 5,
  Norway: 5,
  Poland: 5,
  Portugal: 5,
  Romania: 5,
  Russia: 5,
  "San Marino": 5,
  Serbia: 5,
  Slovakia: 5,
  Slovenia: 5,
  Spain: 5,
  Sweden: 5,
  Switzerland: 5,
  Turkey: 5,
  Ukraine: 5,
  "Vatican City": 5,

  // Zone 6
  Afghanistan: 6,
  Bahrain: 6,
  Iran: 6,
  Iraq: 6,
  Israel: 6,
  Jordan: 6,
  Kuwait: 6,
  Lebanon: 6,
  Oman: 6,
  Qatar: 6,
  "Saudi Arabia": 6,
  Syria: 6,
  "United Arab Emirates": 6,
  Yemen: 6,

  // Zone 7
  Armenia: 7,
  Australia: 7,
  Azerbaijan: 7,
  Bangladesh: 7,
  Bhutan: 7,
  Brunei: 7,
  Cambodia: 7,
  China: 7,
  Georgia: 7,
  India: 7,
  Indonesia: 7,
  Japan: 7,
  Kazakhstan: 7,
  "Korea, North": 7,
  "Korea, South": 7,
  Kyrgyzstan: 7,
  Laos: 7,
  Malaysia: 7,
  Maldives: 7,
  Mongolia: 7,
  Myanmar: 7,
  Nepal: 7,
  Pakistan: 7,
  Palau: 7,
  Philippines: 7,
  Singapore: 7,
  "Sri Lanka": 7,
  Taiwan: 7,
  Tajikistan: 7,
  Thailand: 7,
  "Timor-Leste": 7,
  Turkmenistan: 7,
  Uzbekistan: 7,
  Vietnam: 7,

  // Zone 8
  "Antigua and Barbuda": 8,
  Argentina: 8,
  Bahamas: 8,
  Barbados: 8,
  Belize: 8,
  Bolivia: 8,
  Brazil: 8,
  Chile: 8,
  Colombia: 8,
  "Costa Rica": 8,
  Cuba: 8,
  Dominica: 8,
  "Dominican Republic": 8,
  Ecuador: 8,
  "El Salvador": 8,
  Fiji: 8,
  Grenada: 8,
  Guatemala: 8,
  Guyana: 8,
  Haiti: 8,
  Honduras: 8,
  Jamaica: 8,
  Kiribati: 8,
  "Marshall Islands": 8,
  Micronesia: 8,
  Nauru: 8,
  "New Zealand": 8,
  Nicaragua: 8,
  Panama: 8,
  "Papua New Guinea": 8,
  Paraguay: 8,
  Peru: 8,
  "Saint Kitts and Nevis": 8,
  "Saint Lucia": 8,
  "Saint Vincent and the Grenadines": 8,
  Samoa: 8,
  "Solomon Islands": 8,
  Suriname: 8,
  Tonga: 8,
  "Trinidad and Tobago": 8,
  Tuvalu: 8,
  Uruguay: 8,
  Vanuatu: 8,
  Venezuela: 8,

  // Not listed on DHL's zoning page; grouped with neighbouring
  // territories so it still quotes rather than silently falling back to
  // the dearest zone. Confirm with DHL before relying on it.
  Palestine: 6,
};

// Fallback when a country somehow is not in the table above. Zone 8 is the
// most expensive, so an unknown destination over-quotes rather than
// under-quotes and leaves us short.
export const DEFAULT_INTERNATIONAL_ZONE = 8;

// Nigeria domestic zone (A/B/C) by destination state.
//
// DHL bills domestic on A/B/C while its zoning page names service areas
// (Lagos, Port Harcourt, Abuja, Warri, Kaduna, Rest of Nigeria). The card
// does not print the service-area -> A/B/C mapping, so this encodes the
// standard shape for a Lagos-origin shipper: A within Lagos, B to the
// other staffed service areas, C everywhere else.
export const DHL_DOMESTIC_ZONE_BY_STATE = {
  Lagos: "A",
  Rivers: "B",   // Port Harcourt
  Abuja: "B",    // FCT
  Delta: "B",    // Warri
  Kaduna: "B",
};
export const DEFAULT_DOMESTIC_ZONE = "C"; // Rest of Nigeria

// Assumed shipped weight per garment, in kg, including packaging. DHL bills
// the higher of actual and volumetric weight, so this stands in for both.
// Every extra unit in the cart adds this much again.
export const KG_PER_ITEM = 2;
