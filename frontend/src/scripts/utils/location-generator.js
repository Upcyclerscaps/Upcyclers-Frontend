/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */

const generateNearbyLocation = (centerLat, centerLng, radiusKm = 5) => {
  const earthRadius = 6371; // Earth's radius in km
  const randomDistance = Math.random() * radiusKm;
  const randomAngle = Math.random() * 2 * Math.PI;

  const lat = centerLat + (randomDistance / earthRadius) * (180 / Math.PI);
  const lng = centerLng + (randomDistance / earthRadius) * (180 / Math.PI) / Math.cos(centerLat * Math.PI / 180);

  return { lat, lng, distance: randomDistance };
};

export { generateNearbyLocation };