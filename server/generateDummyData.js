const axios = require("axios");

const trainIds = ["TRN002", "TRN003", "TRN004", "TRN005", "TRN001"];

function getRandomLocation() {
  const minLat = 5.8509;
  const maxLat = 9.8354;
  const minLng = 79.652;
  const maxLng = 81.8811;

  const latitude = (Math.random() * (maxLat - minLat) + minLat).toFixed(4);
  const longitude = (Math.random() * (maxLng - minLng) + minLng).toFixed(4);

  return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
}

function updateTrainLocation(trainId) {
  const location = getRandomLocation();
  console.log(`Attempting to update train ${trainId} location to: `, location);

  axios
    .post("http://localhost:3000/api/trains/location", {
      trainId,
      location,
    })
    .then((response) => {
      console.log(`Successfully updated train ${trainId} location to: `, response.data);
    })
    .catch((error) => {
      console.error(`Error updating train ${trainId}: `, error.message);
    });
}

function generateData() {
  console.log("Generating new data...");
  trainIds.forEach((trainId) => {
    updateTrainLocation(trainId);
  });
}

// Run the data generation every 5 seconds
setInterval(generateData, 5000);
