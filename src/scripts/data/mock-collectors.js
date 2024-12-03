/* eslint-disable linebreak-style */
import { generateNearbyLocation } from '../utils/location-generator';

let MOCK_COLLECTORS = [];

const generateCollectors = (centerLat, centerLng) => {
  const collectorTemplates = [
    { name: 'Pengepul Sejahtera', categories: ['Logam', 'Plastik'], rating: 4.5 },
    { name: 'Rongsok Jaya', categories: ['Kertas', 'Elektronik'], rating: 4.8 },
    { name: 'Daur Ulang Mandiri', categories: ['Logam', 'Elektronik'], rating: 4.3 },
    { name: 'Sampah Berkah', categories: ['Plastik', 'Kertas'], rating: 4.6 }
  ];

  MOCK_COLLECTORS = collectorTemplates.map((template, index) => {
    const { lat, lng, distance } = generateNearbyLocation(centerLat, centerLng);
    return {
      id: index + 1,
      ...template,
      location: { lat, lng },
      distance: parseFloat(distance.toFixed(1)),
      address: `Jl. Sample No. ${index + 1}`,
      phone: `08123456789${index}`
    };
  });

  return MOCK_COLLECTORS;
};

export { MOCK_COLLECTORS, generateCollectors };