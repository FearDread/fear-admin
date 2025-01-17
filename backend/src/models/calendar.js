const mongoose = require("mongoose");

const calendarSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, index: true },
    comment: { type: String, required: false },
    date: { type: Date, default: today() },
    author: { type: Object, required: true, default:
        { userId: '', username: ''}},
  }, 
  { timestamps: true }
);

module.exports = mongoose.model("Calendar", calendarSchema);