const express = require("express");
const router = express.Router();
const TrainLocation = require("../models/TrainLocation");

router.post("/trains/location", async (req, res) => {
  const { trainId, location } = req.body;
  const { latitude, longitude } = location;

  const newLocation = new TrainLocation({
    trainId,
    latitude,
    longitude,
  });

  try {
    const savedLocation = await newLocation.save();
    res.status(201).json(savedLocation);
  } catch (error) {
    res.status(500).json({ message: "Error saving location", error });
  }
});

router.post("/trains/locations", async (req, res) => {
  const locations = req.body;

  try {
    const savedLocations = await Promise.all(
      locations.map(async (locationData) => {
        const { trainId, location } = locationData;
        const { latitude, longitude } = location;

        const newLocation = new TrainLocation({
          trainId,
          latitude,
          longitude,
        });

        return await newLocation.save();
      })
    );

    res.status(201).json(savedLocations);
  } catch (error) {
    res.status(500).json({ message: "Error saving locations", error });
  }
});

router.get("/trains/:trainId/location", async (req, res) => {
  const { trainId } = req.params;
  try {
    const location = await TrainLocation.findOne({ trainId }).sort({
      timestamp: -1,
    });
    if (location) {
      res.json(location); // Send the whole location object
    } else {
      res.status(404).json({ message: "Location not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

router.get("/trains/location/history", async (req, res) => {
  const { trainId, startDate, endDate } = req.query;

  if (!trainId || !startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "trainId, startDate, and endDate are required." });
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // Ensure inclusivity for the entire end date

  if (isNaN(start) || isNaN(end)) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD format." });
  }

  console.log("Query:", {
    trainId,
    timestamp: { $gte: start, $lte: end },
  });

  try {
    const locations = await TrainLocation.find({
      trainId,
      timestamp: { $gte: start, $lte: end },
    });
    console.log("Locations:", locations);
    res.json(locations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving location history", error });
  }
});

router.get("/trains/latest-locations", async (req, res) => {
  try {
    const latestLocations = await TrainLocation.aggregate([
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: "$trainId",
          latestLocation: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$latestLocation" },
      },
    ]);

    res.json(latestLocations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving latest locations", error });
  }
});

module.exports = router;
