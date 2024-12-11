const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    task: { type: String, required: true, index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type:Date, default:Date.now },
    isComplete: { type: Boolean, default: false},
    }, {timestamps: true}
)

module.exports = mongoose.model("Task", taskSchema);