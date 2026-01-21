const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    description: { type: String, require: false },
    start: { type: Date, required: true, default: mongoose.now() },
    end:  { type: Date, required: false, default: mongoose.now() },
    allDay: { type: Boolean, default: false },
    color: { type: String, required: false, default: 'azure' }
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Events", eventSchema);