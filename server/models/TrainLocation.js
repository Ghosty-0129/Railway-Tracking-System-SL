const mongoose = require("mongoose");

const trainLocationSchema = new mongoose.Schema({
  trainId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

const TrainLocation = mongoose.model("TrainLocation", trainLocationSchema);

module.exports = TrainLocation;
