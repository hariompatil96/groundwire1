import React, { useEffect, useState, useRef } from 'react';
import { GoogleMap, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { usePost } from '@/utils/hooks/useApi';
import { API_ROUTES } from '@/constants/api';
import { useDispatch } from 'react-redux';
import { US_STATE_CENTERS } from "@/utils/utils"

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#1d2c4d" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#8ec3b9" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#1a3646" }] },
    {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [{ color: "#4b6878" }],
    },
    {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#64779e" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6f9ba5" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#3c9daa" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#304a7d" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#98a5be" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#1d2c4d" }],
    },
    {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [{ color: "#98a5be" }],
    },
    {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#406d80" }],
    },
    {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#0e1626" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#4e6d70" }],
    },
];

const mapOptions = {
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true, // This enables the fullscreen button
};

const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const getSvgParams = (count) => {
    const countStr = count.toString();
    const digits = countStr.length;

    // Larger base size for better visibility
    const baseSize = digits <= 2 ? 42 : digits <= 4 ? 48 : 54;
    const width = baseSize;
    // Make height taller to accommodate the pointer
    const height = Math.round(baseSize * 1.4);

    // Larger font size for better readability
    const fontSize = digits <= 2 ? 15 : digits <= 4 ? 14 : 13;

    return { width, height, fontSize };
};

const createPinSvg = (width, height, fontSize, displayText) => {
    // Calculate center points
    const centerX = width / 2;
    const pinBodyHeight = height * 0.7; // Pin body takes 70% of total height
    const pointerHeight = height * 0.3; // Pointer takes 30% of total height

    // Radius of the pin head
    const radius = (width / 2) - 2;

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <!-- Drop shadow filter -->
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
        <feOffset dx="0" dy="1" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <!-- Pin shape -->
      <g filter="url(#dropShadow)">
        <!-- Main circle part -->
        <circle cx="${centerX}" cy="${pinBodyHeight / 2}" r="${radius}" fill="#018594" />
        
        <!-- Triangle pointer part -->
        <path d="
          M${centerX - radius / 2} ${pinBodyHeight - radius / 2}
          L${centerX} ${height}
          L${centerX + radius / 2} ${pinBodyHeight - radius / 2}
          Z" 
          fill="#018594" />
      </g>
      
      <!-- Inner white circle for text -->
      <circle cx="${centerX}" cy="${pinBodyHeight / 2}" r="${radius - 5}" fill="white" />
      
      <!-- Text with better positioning -->
      <text 
        x="${centerX}" 
        y="${pinBodyHeight / 2}" 
        text-anchor="middle" 
        dominant-baseline="central"
        font-family="Arial, Helvetica, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        fill="#018594">
        ${displayText}
      </text>
    </svg>`;
};

const USA_BOUNDS = {
    north: 49.3457868, // north lat
    south: 24.7433195, // south lat
    east: -66.9513812, // east lng
    west: -124.7844079, // west lng
};

const isLocationInUSA = (lat, lng) => {

    // Alaska bounds
    const ALASKA_BOUNDS = {
        north: 71.5388001,
        south: 51.2097,
        east: -129.9795,
        west: -179.9
    };

    // Hawaii bounds
    const HAWAII_BOUNDS = {
        north: 28.5,
        south: 18.7,
        east: -154.6,
        west: -178.5
    };

    // Check if coordinates are within USA mainland
    if (lat >= USA_BOUNDS.south && lat <= USA_BOUNDS.north &&
        lng >= USA_BOUNDS.west && lng <= USA_BOUNDS.east) {
        return true;
    }

    // Check if coordinates are within Alaska
    if (lat >= ALASKA_BOUNDS.south && lat <= ALASKA_BOUNDS.north &&
        lng >= ALASKA_BOUNDS.west && lng <= ALASKA_BOUNDS.east) {
        return true;
    }

    // Check if coordinates are within Hawaii
    if (lat >= HAWAII_BOUNDS.south && lat <= HAWAII_BOUNDS.north &&
        lng >= HAWAII_BOUNDS.west && lng <= HAWAII_BOUNDS.east) {
        return true;
    }

    return false;
};

const US_STATES = {
    "Alabama": { lat: 32.3182, lng: -86.9023 },
    "Alaska": { lat: 61.3707, lng: -152.4044 },
    "Arizona": { lat: 33.7298, lng: -111.4312 },
    "Arkansas": { lat: 34.9697, lng: -92.3731 },
    "California": { lat: 36.1162, lng: -119.6816 },
    "Colorado": { lat: 39.0598, lng: -105.3111 },
    "Connecticut": { lat: 41.5978, lng: -72.7554 },
    "Delaware": { lat: 39.3185, lng: -75.5071 },
    "Florida": { lat: 27.7663, lng: -81.6868 },
    "Georgia": { lat: 33.0406, lng: -83.6431 },
    "Hawaii": { lat: 21.0943, lng: -157.4983 },
    "Idaho": { lat: 44.2405, lng: -114.4788 },
    "Illinois": { lat: 40.3495, lng: -88.9861 },
    "Indiana": { lat: 39.8494, lng: -86.2583 },
    "Iowa": { lat: 42.0115, lng: -93.2105 },
    "Kansas": { lat: 38.5266, lng: -96.7265 },
    "Kentucky": { lat: 37.6681, lng: -84.6701 },
    "Louisiana": { lat: 31.1695, lng: -91.8678 },
    "Maine": { lat: 44.6939, lng: -69.3819 },
    "Maryland": { lat: 39.0639, lng: -76.8021 },
    "Massachusetts": { lat: 42.2302, lng: -71.5301 },
    "Michigan": { lat: 43.3266, lng: -84.5361 },
    "Minnesota": { lat: 45.6945, lng: -93.9002 },
    "Mississippi": { lat: 32.7416, lng: -89.6787 },
    "Missouri": { lat: 38.4561, lng: -92.2884 },
    "Montana": { lat: 46.9219, lng: -110.4544 },
    "Nebraska": { lat: 41.1254, lng: -98.2681 },
    "Nevada": { lat: 38.3135, lng: -117.0554 },
    "New Hampshire": { lat: 43.4525, lng: -71.5639 },
    "New Jersey": { lat: 40.2989, lng: -74.5210 },
    "New Mexico": { lat: 34.8405, lng: -106.2485 },
    "New York": { lat: 42.1657, lng: -74.9481 },
    "North Carolina": { lat: 35.6301, lng: -79.8064 },
    "North Dakota": { lat: 47.5289, lng: -99.7840 },
    "Ohio": { lat: 40.3888, lng: -82.7649 },
    "Oklahoma": { lat: 35.5653, lng: -96.9289 },
    "Oregon": { lat: 44.5720, lng: -122.0709 },
    "Pennsylvania": { lat: 40.5908, lng: -77.2098 },
    "Rhode Island": { lat: 41.6809, lng: -71.5118 },
    "South Carolina": { lat: 33.8569, lng: -80.9450 },
    "South Dakota": { lat: 44.2998, lng: -99.4388 },
    "Tennessee": { lat: 35.7478, lng: -86.6923 },
    "Texas": { lat: 31.1060, lng: -97.6475 },
    "Utah": { lat: 40.1500, lng: -111.8624 },
    "Vermont": { lat: 44.0459, lng: -72.7107 },
    "Virginia": { lat: 37.7693, lng: -78.1700 },
    "Washington": { lat: 47.4009, lng: -121.4905 },
    "West Virginia": { lat: 38.4912, lng: -80.9545 },
    "Wisconsin": { lat: 44.2685, lng: -89.6165 },
    "Wyoming": { lat: 42.7475, lng: -107.2085 }
};

const COUNTRY_CENTERS = {
    argentina: { lat: -38.4161, lng: -63.6167, zoom: 3 },
    albania: { lat: 41.1533, lng: 20.1683, zoom: 7 },
    algeria: { lat: 28.0339, lng: 1.6596, zoom: 5 },
    american_samoa: { lat: -14.2710, lng: -170.1322, zoom: 10 },
    andorra: { lat: 42.5063, lng: 1.5218, zoom: 11 },
    angola: { lat: -11.2027, lng: 17.8739, zoom: 5 },
    antigua_and_barbuda: { lat: 17.0608, lng: -61.7964, zoom: 10 },
    armenia: { lat: 40.0691, lng: 45.0382, zoom: 7 },
    aruba: { lat: 12.5211, lng: -69.9683, zoom: 11 },
    austria: { lat: 47.5162, lng: 14.5501, zoom: 7 },
    australia: { lat: -25.2744, lng: 133.7751, zoom: 3 },
    india: { lat: 20.5937, lng: 78.9629, zoom: 3 },
    bo: { lat: -16.2902, lng: -63.5887, zoom: 5 }, // ISO code for Bolivia
    br: { lat: -14.2350, lng: -51.9253, zoom: 4 }, // ISO code for Brazil
    bahamas: { lat: 25.0343, lng: -77.3963, zoom: 7 },
    bahrain: { lat: 26.0667, lng: 50.5577, zoom: 9 },
    bangladesh: { lat: 23.6850, lng: 90.3563, zoom: 7 },
    barbados: { lat: 13.1939, lng: -59.5432, zoom: 11 },
    belgium: { lat: 50.5039, lng: 4.4699, zoom: 7 },
    belize: { lat: 17.1899, lng: -88.4976, zoom: 8 },
    bhutan: { lat: 27.5142, lng: 90.4336, zoom: 8 },
    bolivia: { lat: -16.2902, lng: -63.5887, zoom: 5 },
    bosnia_and_herzegovina: { lat: 43.9159, lng: 17.6791, zoom: 7 },
    botswana: { lat: -22.3285, lng: 24.6849, zoom: 6 },
    british_indian_ocean_territory: { lat: -7.3346, lng: 72.4242, zoom: 9 },
    british_virgin_islands: { lat: 18.4207, lng: -64.6400, zoom: 11 },
    bulgaria: { lat: 42.7339, lng: 25.4858, zoom: 7 },
    brazil: { lat: -14.2350, lng: -51.9253, zoom: 3 },
    burkina_faso: { lat: 12.2383, lng: -1.5616, zoom: 6 },
    canada: { lat: 56.1304, lng: -106.3468, zoom: 2 },
    ca: { lat: 56.1304, lng: -106.3468, zoom: 3 }, // ISO code for Canada
    co: { lat: 4.5709, lng: -74.2973, zoom: 5 }, // ISO code for Colombia
    cambodia: { lat: 12.5657, lng: 104.9910, zoom: 7 },
    cameroon: { lat: 7.3697, lng: 12.3547, zoom: 6 },
    caribbean_netherlands: { lat: 12.2021, lng: -68.2624, zoom: 9 },
    cayman_islands: { lat: 19.3133, lng: -81.2546, zoom: 10 },
    chile: { lat: -35.6751, lng: -71.5430, zoom: 4 },
    china: { lat: 35.8617, lng: 104.1954, zoom: 3 },
    colombia: { lat: 4.5709, lng: -74.2973, zoom: 5 },
    congo_kinshasa: { lat: -4.0383, lng: 21.7587, zoom: 5 },
    costa_rica: { lat: 9.7489, lng: -83.7534, zoom: 7 },
    croatia: { lat: 45.1000, lng: 15.2000, zoom: 7 },
    curacao: { lat: 12.1696, lng: -68.9900, zoom: 11 },
    czechia: { lat: 49.8175, lng: 15.4730, zoom: 7 },
    cote_divoire: { lat: 7.5400, lng: -5.5471, zoom: 6 },
    denmark: { lat: 56.2639, lng: 9.5018, zoom: 6 },
    dominica: { lat: 15.4150, lng: -61.3710, zoom: 10 },
    dominican_republic: { lat: 18.7357, lng: -70.1627, zoom: 8 },
    es: { lat: 40.4637, lng: -3.7492, zoom: 4 }, // ISO code for Spain
    ecuador: { lat: -1.8312, lng: -78.1834, zoom: 6 },
    egypt: { lat: 26.8206, lng: 30.8025, zoom: 5 },
    el_salvador: { lat: 13.7942, lng: -88.8965, zoom: 8 },
    equatorial_guinea: { lat: 1.6508, lng: 10.2679, zoom: 7 },
    estonia: { lat: 58.5953, lng: 25.0136, zoom: 7 },
    ethiopia: { lat: 9.1450, lng: 40.4897, zoom: 5 },
    fr: { lat: 46.2276, lng: 2.2137, zoom: 5 }, // ISO code for France
    finland: { lat: 61.9241, lng: 25.7482, zoom: 5 },
    france: { lat: 46.2276, lng: 2.2137, zoom: 4 },
    gb: { lat: 55.3781, lng: -3.4360, zoom: 5 }, // ISO code for United Kingdom
    gh: { lat: 7.9465, lng: -1.0232, zoom: 6 }, // ISO code for Ghana
    gt: { lat: 15.7835, lng: -90.2308, zoom: 6 }, // ISO code for Guatemala
    georgia: { lat: 42.3154, lng: 43.3569, zoom: 7 },
    germany: { lat: 51.1657, lng: 10.4515, zoom: 5 },
    ghana: { lat: 7.9465, lng: -1.0232, zoom: 6 },
    greece: { lat: 39.0742, lng: 21.8243, zoom: 6 },
    grenada: { lat: 12.1165, lng: -61.6790, zoom: 11 },
    guam: { lat: 13.4443, lng: 144.7937, zoom: 10 },
    guatemala: { lat: 15.7835, lng: -90.2308, zoom: 6 },
    guinea: { lat: 9.9456, lng: -9.6966, zoom: 6 },
    guyana: { lat: 4.8604, lng: -58.9302, zoom: 6 },
    honduras: { lat: 15.1991, lng: -86.2419, zoom: 7 },
    hong_kong: { lat: 22.3193, lng: 114.1694, zoom: 10 },
    hungary: { lat: 47.1625, lng: 19.5033, zoom: 7 },
    ie: { lat: 53.1424, lng: -7.6921, zoom: 6 }, // ISO code for Ireland
    in: { lat: 20.5937, lng: 78.9629, zoom: 4 }, // ISO code for India
    iceland: { lat: 64.9631, lng: -19.0208, zoom: 6 },
    indonesia: { lat: -0.7893, lng: 113.9213, zoom: 4 },
    iran: { lat: 32.4279, lng: 53.6880, zoom: 5 },
    iraq: { lat: 33.2232, lng: 43.6793, zoom: 5 },
    ireland: { lat: 53.1424, lng: -7.6921, zoom: 6 },
    isle_of_man: { lat: 54.2361, lng: -4.5481, zoom: 10 },
    israel: { lat: 31.0461, lng: 34.8516, zoom: 7 },
    italy: { lat: 41.8719, lng: 12.5674, zoom: 4 },
    jp: { lat: 36.2048, lng: 138.2529, zoom: 5 }, // ISO code for Japan
    jamaica: { lat: 18.1096, lng: -77.2975, zoom: 8 },
    jersey: { lat: 49.2144, lng: -2.1312, zoom: 11 },
    jordan: { lat: 30.5852, lng: 36.2384, zoom: 7 },
    ke: { lat: -0.0236, lng: 37.9062, zoom: 6 }, // ISO code for Kenya
    kazakhstan: { lat: 48.0196, lng: 66.9237, zoom: 4 },
    kenya: { lat: -0.0236, lng: 37.9062, zoom: 6 },
    kosovo: { lat: 42.6026, lng: 20.9030, zoom: 8 },
    kuwait: { lat: 29.3117, lng: 47.4818, zoom: 8 },
    kyrgyzstan: { lat: 41.2044, lng: 74.7661, zoom: 6 },
    laos: { lat: 19.8563, lng: 102.4955, zoom: 6 },
    lebanon: { lat: 33.8547, lng: 35.8623, zoom: 8 },
    liberia: { lat: 6.4281, lng: -9.4295, zoom: 7 },
    liechtenstein: { lat: 47.1660, lng: 9.5554, zoom: 11 },
    lithuania: { lat: 55.1694, lng: 23.8813, zoom: 7 },
    luxembourg: { lat: 49.8153, lng: 6.1296, zoom: 9 },
    mx: { lat: 23.6345, lng: -102.5528, zoom: 4 }, // ISO code for Mexico
    madagascar: { lat: -18.7669, lng: 46.8691, zoom: 5 },
    malawi: { lat: -13.2543, lng: 34.3015, zoom: 6 },
    malaysia: { lat: 4.2105, lng: 101.9758, zoom: 5 },
    maldives: { lat: 3.2028, lng: 73.2207, zoom: 9 },
    malta: { lat: 35.9375, lng: 14.3754, zoom: 10 },
    martinique: { lat: 14.6415, lng: -61.0242, zoom: 10 },
    mauritius: { lat: -20.3484, lng: 57.5522, zoom: 10 },
    mexico: { lat: 23.6345, lng: -102.5528, zoom: 4 },
    micronesia: { lat: 7.4256, lng: 150.5508, zoom: 7 },
    monaco: { lat: 43.7384, lng: 7.4246, zoom: 13 },
    mongolia: { lat: 46.8625, lng: 103.8467, zoom: 5 },
    montenegro: { lat: 42.7087, lng: 19.3744, zoom: 8 },
    morocco: { lat: 31.7917, lng: -7.0926, zoom: 5 },
    mozambique: { lat: -18.6657, lng: 35.5296, zoom: 5 },
    myanmar: { lat: 21.9162, lng: 95.9560, zoom: 5 },
    ne: { lat: 17.6078, lng: 8.0817, zoom: 5 }, // ISO code for Niger
    ng: { lat: 9.0820, lng: 8.6753, zoom: 5 }, // ISO code for Nigeria
    nz: { lat: -40.9006, lng: 174.8860, zoom: 5 }, // ISO code for New Zealand
    namibia: { lat: -22.9576, lng: 18.4904, zoom: 5 },
    nepal: { lat: 28.3949, lng: 84.1240, zoom: 6 },
    netherlands: { lat: 52.1326, lng: 5.2913, zoom: 7 },
    "new zealand": { lat: -40.9006, lng: 174.8860, zoom: 5 },
    nicaragua: { lat: 12.8654, lng: -85.2072, zoom: 7 },
    nigeria: { lat: 9.0820, lng: 8.6753, zoom: 5 },
    north_macedonia: { lat: 41.6086, lng: 21.7453, zoom: 8 },
    northern_mariana_islands: { lat: 15.0979, lng: 145.6739, zoom: 10 },
    norway: { lat: 60.4720, lng: 8.4689, zoom: 5 },
    oman: { lat: 21.4735, lng: 55.9754, zoom: 6 },
    pe: { lat: -9.1900, lng: -75.0152, zoom: 5 }, // ISO code for Peru
    ph: { lat: 12.8797, lng: 121.7740, zoom: 5 }, // ISO code for Philippines
    pakistan: { lat: 30.3753, lng: 69.3451, zoom: 5 },
    palestine: { lat: 31.9522, lng: 35.2332, zoom: 8 },
    panama: { lat: 8.5380, lng: -80.7821, zoom: 7 },
    papua_new_guinea: { lat: -6.3149, lng: 143.9555, zoom: 6 },
    paraguay: { lat: -23.4425, lng: -58.4438, zoom: 6 },
    peru: { lat: -9.1900, lng: -75.0152, zoom: 4 },
    philippines: { lat: 12.8797, lng: 121.7740, zoom: 5 },
    poland: { lat: 51.9194, lng: 19.1451, zoom: 6 },
    portugal: { lat: 39.3999, lng: -8.2245, zoom: 6 },
    puerto_rico: { lat: 18.2208, lng: -66.5901, zoom: 9 },
    qatar: { lat: 25.3548, lng: 51.1839, zoom: 8 },
    romania: { lat: 45.9432, lng: 24.9668, zoom: 6 },
    rwanda: { lat: -1.9403, lng: 29.8739, zoom: 8 },
    "russia": { lat: 61.5240, lng: 105.3188, zoom: 2 },
    samoa: { lat: -13.7590, lng: -172.1046, zoom: 9 },
    "saudi arabia": { lat: 23.8859, lng: 45.0792, zoom: 5 },
    senegal: { lat: 14.4974, lng: -14.4524, zoom: 6 },
    serbia: { lat: 44.0165, lng: 21.0059, zoom: 7 },
    seychelles: { lat: -4.6796, lng: 55.4920, zoom: 10 },
    sierra_leone: { lat: 8.4606, lng: -11.7799, zoom: 7 },
    singapore: { lat: 1.3521, lng: 103.8198, zoom: 11 },
    sint_maarten: { lat: 18.0425, lng: -63.0548, zoom: 12 },
    slovenia: { lat: 46.1512, lng: 14.9955, zoom: 8 },
    solomon_islands: { lat: -9.6457, lng: 160.1562, zoom: 7 },
    somalia: { lat: 5.1521, lng: 46.1996, zoom: 5 },
    "south africa": { lat: -30.5595, lng: 22.9375, zoom: 5 },
    "south korea": { lat: 35.9078, lng: 127.7669, zoom: 6 },
    "south sudan": { lat: 6.8770, lng: 31.3070, zoom: 6 },
    spain: { lat: 40.4637, lng: -3.7492, zoom: 5 },
    "sri lanka": { lat: 7.8731, lng: 80.7718, zoom: 7 },
    st_kitts_and_nevis: { lat: 17.3578, lng: -62.7830, zoom: 11 },
    st_lucia: { lat: 13.9094, lng: -60.9789, zoom: 10 },
    st_vincent_and_grenadines: { lat: 13.2587, lng: -61.1938, zoom: 10 },
    suriname: { lat: 3.9193, lng: -56.0278, zoom: 6 },
    sweden: { lat: 60.1282, lng: 18.6435, zoom: 5 },
    switzerland: { lat: 46.8182, lng: 8.2275, zoom: 7 },
    taiwan: { lat: 23.6978, lng: 120.9605, zoom: 7 },
    tajikistan: { lat: 38.8610, lng: 71.2761, zoom: 6 },
    tanzania: { lat: -6.3690, lng: 34.8888, zoom: 5 },
    thailand: { lat: 15.8700, lng: 100.9925, zoom: 5 },
    turkmenistan: { lat: 38.9697, lng: 59.5563, zoom: 5 },
    tuvalu: { lat: -7.1095, lng: 177.6493, zoom: 10 },
    turkey: { lat: 38.9637, lng: 35.2433, zoom: 5 },
    turkiye: { lat: 38.9637, lng: 35.2433, zoom: 5 },
    us_virgin_islands: { lat: 18.3358, lng: -64.8963, zoom: 11 },
    ug: { lat: 1.3733, lng: 32.2903, zoom: 6 }, // ISO code for Uganda
    uganda: { lat: 1.3733, lng: 32.2903, zoom: 6 },
    ukraine: { lat: 48.3794, lng: 31.1656, zoom: 5 },
    "united arab emirates": { lat: 23.4241, lng: 53.8478, zoom: 7 },
    "united kingdom": { lat: 55.3781, lng: -3.4360, zoom: 4 },
    "united states": { lat: 37.0902, lng: -95.7129, zoom: 2 },
    uruguay: { lat: -32.5228, lng: -55.7658, zoom: 6 },
    uzbekistan: { lat: 41.3775, lng: 64.5853, zoom: 5 },
    ve: { lat: 6.4238, lng: -66.5897, zoom: 5 }, // ISO code for Venezuela
    venezuela: { lat: 6.4238, lng: -66.5897, zoom: 5 },
    vietnam: { lat: 14.0583, lng: 108.2772, zoom: 5 },
    yemen: { lat: 15.5527, lng: 48.5164, zoom: 5 },
    za: { lat: -30.5595, lng: 22.9375, zoom: 5 }, // ISO code for South Africa
    zm: { lat: -13.1339, lng: 27.8493, zoom: 5 }, // ISO code for Zambia
    zambia: { lat: -13.1339, lng: 27.8493, zoom: 5 },
    zimbabwe: { lat: -19.0154, lng: 29.1549, zoom: 5 }
};

const LOCATION_CACHE = {
    "India": { lat: 20.5937, lng: 78.9629 },
    "United States": { lat: 37.0902, lng: -95.7129 },
    "Mexico": { lat: 23.6345, lng: -102.5528 },
    "Japan": { lat: 36.2048, lng: 138.2529 },
    "Venezuela": { lat: 6.4238, lng: -66.5897 },
    "Peru": { lat: -9.1900, lng: -75.0152 },
    "Argentina": { lat: -38.4161, lng: -63.6167 },
    "USA": { lat: 37.0902, lng: -95.7129 },
    "US": { lat: 37.0902, lng: -95.7129 },
    "China": { lat: 35.8617, lng: 104.1954 },
    "Brazil": { lat: -14.2350, lng: -51.9253 },
    "Canada": { lat: 56.1304, lng: -106.3468 },
    "UK": { lat: 55.3781, lng: -3.4360 },
    "United Kingdom": { lat: 55.3781, lng: -3.4360 },
    "Australia": { lat: -25.2744, lng: 133.7751 },
    "Russia": { lat: 61.5240, lng: 105.3188 },
    "Germany": { lat: 51.1657, lng: 10.4515 },
    "France": { lat: 46.2276, lng: 2.2137 },
    "Italy": { lat: 41.8719, lng: 12.5674 },
    "Spain": { lat: 40.4637, lng: -3.7492 },
};

const countryNameMap = {
    'usa': 'united states of america',
    'us': 'united states of america',
    'united states': 'united states of america',
    'uk': 'united kingdom',
    'great britain': 'united kingdom',
    'england': 'united kingdom',
    'myanmar (burma)': 'myanmar',
    'congo - kinshasa': 'congo_kinshasa',
    'côte d\'ivoire': 'cote_divoire',
    'st. kitts & nevis': 'st_kitts_and_nevis',
    'st. lucia': 'st_lucia',
    'st. vincent & grenadines': 'st_vincent_and_grenadines',
    'trinidad & tobago': 'trinidad_and_tobago',
    'antigua & barbuda': 'antigua_and_barbuda',
    'bosnia & herzegovina': 'bosnia_and_herzegovina',
    'u.s. virgin islands': 'us_virgin_islands'
};

const geocodeCache = {};

const formatDisplayNumber = (num) => {
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}K`;
    if (num < 1000000) return `${Math.round(num / 1000)}K`;
    return `${(num / 1000000).toFixed(1)}M`;
};

const MapComponent = ({
    locations = [],
    mapHeight = '305px',
    isDarkMode,
    highlightCountry = null,
    highlightUSState = null
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.MAP_KEY,
        libraries: ['places', 'geometry']
    });

    const dispatch = useDispatch();

    const GEOJSON_SOURCES = {
        global: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        us_states: '/data/us-states.json'
    };

    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const clustererRef = useRef(null);
    const dataLayerRef = useRef(null);
    const [center, setCenter] = useState({ lat: 39.8283, lng: -98.5795 });
    const [zoom, setZoom] = useState(2);
    const [activeMarker, setActiveMarker] = useState(null);
    const [resolvedLocations, setResolvedLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mapInitialized, setMapInitialized] = useState(false);

    const { mutate: addLatLng } = usePost(API_ROUTES["storeLatLong"], {
        onSuccess: (response) => {
        },
    }, {}, true);

    const checkCache = (loc) => {
        // Check direct match first
        if (geocodeCache[loc.name]) {
            return geocodeCache[loc.name];
        }

        if (loc?.lat && loc?.lng) {
            return {
                ...loc,
                lat: Number(loc.lat),
                lng: Number(loc.lng),
                address: loc.name
            };
        }

        // Check predefined locations
        if (LOCATION_CACHE[loc.name]) {
            return { ...LOCATION_CACHE[loc.name], address: loc.name };
        }

        // Check US States
        if (US_STATES[loc.name]) {
            return { ...US_STATES[loc.name], address: `${loc.name}, USA` };
        }

        // Check if it's a US state with "state" suffix or similar patterns
        const stateMatch = loc.name.match(/^(.*?)\s*(?:state|province|region)$/i);
        if (stateMatch && US_STATES[stateMatch[1]]) {
            return { ...US_STATES[stateMatch[1]], address: `${stateMatch[1]}, USA` };
        }

        return null;
    };

    const batchGeocodeLocations = async (locationsToGeocode) => {
        const results = [];
        const geocodingQueue = [];

        // First, check cache for all locations
        for (const loc of locationsToGeocode) {
            const cachedLocation = checkCache(loc);

            if (cachedLocation) {
                // Use cached coordinates
                results.push({
                    ...loc,
                    lat: cachedLocation.lat,
                    lng: cachedLocation.lng,
                    address: cachedLocation.address || loc.name,
                    fromCache: true
                });
            } else {
                // Add to queue for API geocoding
                geocodingQueue.push(loc);
            }
        }

        // Process the queue in batches to reduce API calls
        const BATCH_SIZE = 10;
        const DELAY_MS = 1000; // 1 second delay between batches

        for (let i = 0; i < geocodingQueue.length; i += BATCH_SIZE) {
            const batch = geocodingQueue.slice(i, i + BATCH_SIZE);

            // Process batch in parallel
            const batchPromises = batch.map(async (loc) => {
                try {
                    // Try geocoding with country suffix first if not already included
                    let url;
                    url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(loc.name)}&key=${process.env.MAP_KEY}`;


                    const res = await fetch(url);
                    const data = await res.json();

                    if (data.status === "OK" && data.results && data.results.length > 0) {
                        const position = data.results[0].geometry.location;
                        const result = {
                            ...loc,
                            lat: position.lat,
                            lng: position.lng,
                            address: data.results[0].formatted_address,
                            originalQuery: loc.name
                        };
                        addLatLng(result);
                        // Add to cache for future use
                        geocodeCache[loc.name] = {
                            lat: position.lat,
                            lng: position.lng,
                            address: data.results[0].formatted_address
                        };

                        return result;
                    }

                    return null;
                } catch (err) {
                    console.error(`Error geocoding ${loc.name}:`, err);
                    return null;
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.filter(r => r !== null));

            // Delay before next batch to avoid rate limits
            if (i + BATCH_SIZE < geocodingQueue.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_MS));
            }
        }

        return results;
    };

    const highlightCountryOnMap = async (countryName) => {
        if (!isLoaded || !mapRef.current || !countryName) return;

        if (dataLayerRef.current) {
            dataLayerRef.current.setMap(null);
            dataLayerRef.current = null;
        }

        const dataLayer = new window.google.maps.Data();
        dataLayerRef.current = dataLayer;

        dataLayer.setStyle({
            fillColor: isDarkMode ? '#005cb8' : '#3b82f6',
            fillOpacity: 0.2,
            strokeColor: isDarkMode ? '#0284c7' : '#2563eb',
            strokeWeight: 2,
            strokeOpacity: 0.8
        });

        try {
            let normalizedCountryName = countryName.toLowerCase().trim();

            if (countryNameMap[normalizedCountryName]) {
                normalizedCountryName = countryNameMap[normalizedCountryName];
            }
            const geoJsonUrl = GEOJSON_SOURCES.global;

            const response = await fetch(geoJsonUrl);
            const geoJson = await response.json();

            const countryFeature = geoJson.features.find(feature => {
                const admin = (feature.properties.ADMIN || '').toLowerCase();
                const name = (feature.properties.NAME || feature.properties.name || '').toLowerCase();
                const sovereignt = (feature.properties.SOVEREIGNT || '').toLowerCase();
                const formal = (feature.properties.FORMAL_EN || '').toLowerCase();

                const isoA2 = (feature.properties.ISO_A2 || '').toLowerCase();
                const isoA3 = (feature.properties.ISO_A3 || '').toLowerCase();

                if (normalizedCountryName === 'united states of america' &&
                    (admin === 'united states of america' || name === 'united states' ||
                        isoA2 === 'us' || isoA3 === 'usa')) {
                    return true;
                }

                if (normalizedCountryName === 'united kingdom' &&
                    (admin === 'united kingdom' || name === 'united kingdom' ||
                        isoA2 === 'gb' || isoA3 === 'gbr')) {
                    return true;
                }

                return (
                    admin === normalizedCountryName ||
                    name === normalizedCountryName ||
                    sovereignt === normalizedCountryName ||
                    formal === normalizedCountryName ||
                    isoA2 === normalizedCountryName ||
                    isoA3 === normalizedCountryName
                );
            });

            if (!countryFeature) {
                console.error(`Country feature not found in GeoJSON: ${countryName} (normalized: ${normalizedCountryName})`);
                return;
            }
            dataLayer.addGeoJson(countryFeature);
            dataLayer.setMap(mapRef.current);
            const originalNormalized = countryName.toLowerCase().trim();
            if (COUNTRY_CENTERS[originalNormalized]) {
                const { lat, lng, zoom } = COUNTRY_CENTERS[originalNormalized];
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(zoom);
            }
            else if (COUNTRY_CENTERS[normalizedCountryName]) {
                const { lat, lng, zoom } = COUNTRY_CENTERS[normalizedCountryName];
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(zoom);
            }
        } catch (error) {
            console.error('Error highlighting country:', error);
        }
    };

    const highlightUSStateOnMap = async (stateName) => {
        if (!isLoaded || !mapRef.current || !stateName) return;

        if (dataLayerRef.current) {
            dataLayerRef.current.setMap(null);
            dataLayerRef.current = null;
        }

        const dataLayer = new window.google.maps.Data();
        dataLayerRef.current = dataLayer;

        dataLayer.setStyle({
            fillColor: isDarkMode ? '#005cb8' : '#3b82f6',
            fillOpacity: 0.2,
            strokeColor: isDarkMode ? '#0284c7' : '#2563eb',
            strokeWeight: 2,
            strokeOpacity: 0.8
        });

        try {
            const normalizedStateName = stateName.toLowerCase().trim();
            const geoJsonUrl = GEOJSON_SOURCES.us_states;

            const response = await fetch(geoJsonUrl);
            const geoJson = await response.json();

            // Based on your GeoJSON structure, the state name is in properties.NAME
            const stateFeature = geoJson.features.find(feature => {
                const name = (feature.properties.NAME || '').toLowerCase();
                return name === normalizedStateName;
            });

            if (!stateFeature) {
                console.error(`US State feature not found in GeoJSON: ${stateName} (normalized: ${normalizedStateName})`);
                return;
            }

            dataLayer.addGeoJson(stateFeature);
            dataLayer.setMap(mapRef.current);

            // Set center and zoom for the state
            if (US_STATE_CENTERS[normalizedStateName]) {
                const { lat, lng, zoom } = US_STATE_CENTERS[normalizedStateName];
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(zoom);
            }
        } catch (error) {
            console.error('Error highlighting US state:', error);
        }
    };

    useEffect(() => {
        if (!isLoaded) return;

        // Check if locations array is empty or contains no valid entries
        const hasValidLocations = locations.length > 0 &&
            locations.some(loc => loc.count && loc.count > 0);

        setIsLoading(hasValidLocations);

        if (!hasValidLocations) {
            setResolvedLocations([]);

            // If highlighting a country, just focus on that
            if (highlightCountry) {
                const normalizedCountryName = highlightCountry.toLowerCase().trim();
                if (COUNTRY_CENTERS[normalizedCountryName] && mapRef.current) {
                    const { lat, lng, zoom } = COUNTRY_CENTERS[normalizedCountryName];
                    mapRef.current.setCenter({ lat, lng });
                    mapRef.current.setZoom(zoom);
                }
            } else if (mapRef.current) {
                // Default USA view if no country to highlight
                mapRef.current.setCenter({ lat: 39.8283, lng: -98.5795 });
                mapRef.current.setZoom(2);
            }

            return;
        }

        // Only keep locations with count > 0
        const validLocations = locations.filter(loc => loc.count && loc.count > 0);

        const processLocations = async () => {
            const geoResults = await batchGeocodeLocations(validLocations);

            // NEW: Filter out USA locations if highlighting international
            const normalizedHighlight = highlightCountry?.toLowerCase().trim();
            const filteredResults = (normalizedHighlight === "international")
                ? geoResults.filter(loc => !isLocationInUSA(loc.lat, loc.lng))
                : geoResults;

            setResolvedLocations(filteredResults);

            // Set initial map view
            if (filteredResults.length > 0) {
                // Find US locations from filtered results (will be empty for international)
                const usLocations = filteredResults.filter(loc => isLocationInUSA(loc.lat, loc.lng));

                if (mapRef.current) {
                    // Check if a country highlight is active - prioritize this
                    if (highlightCountry && COUNTRY_CENTERS[highlightCountry.toLowerCase().trim()]) {
                        // Do nothing here - let the highlightCountry useEffect handle the view
                        console.log("Location processing complete, deferring to country highlight for map view");
                    }
                    // Otherwise handle based on pins
                    else if (geoResults.length === 1) {
                        // Single location - zoom to it but not too close
                        setTimeout(() => {
                            setCenter({ lat: geoResults[0].lat, lng: geoResults[0].lng });
                            setZoom(5); // Less zoomed in
                        }, 200);
                    } else if (usLocations.length > 0) {
                        // Multiple US locations - fit bounds and limit zoom
                        setTimeout(() => {
                            const bounds = new window.google.maps.LatLngBounds();
                            usLocations.forEach(loc => {
                                bounds.extend({ lat: loc.lat, lng: loc.lng });
                            });
                            mapRef.current.fitBounds(bounds);

                            // Add listener to limit zoom level after bounds change
                            window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
                                if (mapRef.current.getZoom() > 7) {
                                    mapRef.current.setZoom(7);
                                }
                            });
                        }, 200);
                    } else {
                        // Non-US locations - fit all pins with limited zoom
                        setTimeout(() => {
                            const bounds = new window.google.maps.LatLngBounds();
                            geoResults.forEach(loc => {
                                bounds.extend({ lat: loc.lat, lng: loc.lng });
                            });
                            mapRef.current.fitBounds(bounds);

                            window.google.maps.event.addListenerOnce(mapRef.current, 'bounds_changed', () => {
                                if (mapRef.current.getZoom() > 7) {
                                    mapRef.current.setZoom(7);
                                }
                            });
                        }, 200);
                    }
                }
            } else if (!highlightCountry) {
                setCenter({ lat: 39.8283, lng: -98.5795 });
                setZoom(4);
            }

            setIsLoading(false);
        };

        processLocations();
    }, [isLoaded, locations, highlightCountry]);

    useEffect(() => {
        if (!isLoaded || !mapRef.current || resolvedLocations.length === 0) return;

        if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => marker.setMap(null));
            markersRef.current = [];
        }

        if (clustererRef.current) {
            clustererRef.current.clearMarkers();
        }

        const markers = resolvedLocations.map((loc, index) => {
            const { width, height, fontSize } = getSvgParams(loc.count);
            const displayText = formatDisplayNumber(loc.count);

            const marker = new window.google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map: mapRef.current,
                icon: {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                        createPinSvg(width, height, fontSize, displayText)
                    )}`,
                    scaledSize: new window.google.maps.Size(width, height),
                    anchor: new window.google.maps.Point(width / 2, height),
                },
                title: loc.address,
            });

            marker.customCount = loc.count;
            marker.addListener('click', () => setActiveMarker(index));
            return marker;
        });

        markersRef.current = markers;

        clustererRef.current = new MarkerClusterer({
            markers,
            map: mapRef.current,
            renderer: {
                render: ({ markers, position }) => {
                    let total = 0;
                    markers.forEach((marker) => {
                        total += marker?.customCount || 0;
                    });

                    const { width, height, fontSize } = getSvgParams(total);
                    const displayValue = formatDisplayNumber(total);

                    return new window.google.maps.Marker({
                        position,
                        icon: {
                            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                                createPinSvg(width, height, fontSize, displayValue)
                            )}`,
                            scaledSize: new window.google.maps.Size(width, height),
                            anchor: new window.google.maps.Point(width / 2, height),
                        },
                    });
                },
            }
        });
    }, [isLoaded, resolvedLocations]);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setOptions({
                ...mapOptions,
                styles: isDarkMode ? darkMapStyle : [],
            });

            // Reapply country highlight if needed after theme change
            if (highlightCountry && dataLayerRef.current) {
                dataLayerRef.current.setStyle({
                    fillColor: isDarkMode ? '#005cb8' : '#3b82f6',
                    fillOpacity: 0.2,
                    strokeColor: isDarkMode ? '#0284c7' : '#2563eb',
                    strokeWeight: 2,
                    strokeOpacity: 0.8
                });
            }
        }
    }, [isDarkMode]);

    // Effect to handle highlighting country when the prop changes
    useEffect(() => {
        if (!isLoaded || !mapRef.current) return;

        // Clear any existing data layer first
        if (dataLayerRef.current) {
            dataLayerRef.current.setMap(null);
            dataLayerRef.current = null;
        }

        if (highlightUSState) {
            const normalizedStateName = highlightUSState.toLowerCase().trim();

            // First center and zoom to the state
            if (US_STATE_CENTERS[normalizedStateName]) {
                const { lat, lng, zoom } = US_STATE_CENTERS[normalizedStateName];
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(zoom);
            }

            // Then highlight it
            setTimeout(() => {
                highlightUSStateOnMap(highlightUSState);
            }, 500);
        } else if (highlightCountry) {
            const normalizedCountryName = highlightCountry.toLowerCase().trim();
            // Handle global/international case
            if (normalizedCountryName === "global" || normalizedCountryName === "international") {
                // Set center to show full globe and appropriate zoom level
                mapRef.current.setCenter({ lat: 10, lng: 0 });
                mapRef.current.setZoom(2);
                return; // Exit early, no need to highlight any specific country
            }

            // First center and zoom to the country
            if (COUNTRY_CENTERS[normalizedCountryName]) {
                const { lat, lng, zoom } = COUNTRY_CENTERS[normalizedCountryName];
                mapRef.current.setCenter({ lat, lng });
                mapRef.current.setZoom(zoom);
            }

            // Then highlight it
            setTimeout(() => {
                highlightCountryOnMap(highlightCountry);
            }, 500);
        }
    }, [isLoaded, highlightCountry, highlightUSState, isDarkMode, mapInitialized]);


    if (loadError) return <div>Error loading map</div>;
    if (!isLoaded) return <div>Loading Map...</div>;

    return (
        <div className="map-container relative">
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: mapHeight }}
                center={center}
                zoom={zoom}
                options={{
                    ...mapOptions,
                    styles: isDarkMode ? darkMapStyle : [],
                    restriction: {
                        latLngBounds: {
                            north: 85,
                            south: -85,
                            east: 180,
                            west: -180
                        },
                        strictBounds: true
                    }
                }}
                onLoad={(map) => {
                    mapRef.current = map;
                    if (highlightCountry) {
                        const normalizedCountryName = highlightCountry.toLowerCase().trim();

                        // Handle global/international view case
                        if (normalizedCountryName === "global" || normalizedCountryName === "international") {
                            map.setCenter({ lat: 10, lng: 0 });
                            map.setZoom(2);
                        } else if (COUNTRY_CENTERS[normalizedCountryName]) {
                            const { lat, lng, zoom } = COUNTRY_CENTERS[normalizedCountryName];
                            map.setCenter({ lat, lng });
                            map.setZoom(zoom);
                        } else {
                            map.fitBounds(USA_BOUNDS);
                        }
                    } else {
                        map.fitBounds(USA_BOUNDS);
                    }
                    setTimeout(() => {
                        setMapInitialized(true);
                    }, 300);
                }}
            >
                {activeMarker !== null && resolvedLocations[activeMarker] && (
                    <InfoWindow
                        position={{
                            lat: resolvedLocations[activeMarker].lat,
                            lng: resolvedLocations[activeMarker].lng,
                        }}
                        onCloseClick={() => setActiveMarker(null)}
                    >
                        <div className="p-3 pt-0 bg-white text-center">
                            <p className="text-sm text-gray-800">
                                <span className="text-lg font-bold text-black">
                                    POF : {formatNumber(resolvedLocations[activeMarker].count) || 0}
                                </span>
                                <p className="mt-1 font-medium text-xs text-gray-900">
                                    {resolvedLocations[activeMarker].address}
                                </p>
                            </p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-blue-500 font-medium">Loading locations...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(MapComponent);