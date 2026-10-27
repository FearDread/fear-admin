const mongoose = require("mongoose");

// Mirrors the documents written by import-collection.mjs
const hipcomicItemSchema = new mongoose.Schema({
    hipcomicId: { type: String, required: true, unique: true, trim: true },
    url: { type: String },
    title: { type: String, trim: true },
    series: { type: String, trim: true, index: true },
    seriesYear: { type: Number },
    issue: { type: String, trim: true },
    variant: { type: String, trim: true },
    keyIssue: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    grade: { type: String },
    gradeLabel: { type: String },
    gradeNumeric: { type: Number },
    fmv: { type: Number, default: null },
    country: { type: String },
    publisherSlug: { type: String, index: true },
    seriesSlug: { type: String },
    issueSlug: { type: String },
    variantSlug: { type: String },
    image: { type: String, default: null },
    images: [{ type: String }],
    rawText: { type: String },
    importedAt: { type: Date },
    firstImportedAt: { type: Date },
},
    {
        // Must match the collection the import script writes to; without this
        // Mongoose would look in "hipcomicitems".
        collection: "hipcomic_collection",
        timestamps: false,
    }
);

hipcomicItemSchema.index({ series: 1, issue: 1 });

// All copies of a series, in issue order
hipcomicItemSchema.statics.findBySeries = function (series) {
    return this.find({ series: new RegExp(`^${escapeRegex(series)}$`, "i") })
        .collation({ locale: "en", numericOrdering: true })
        .sort({ issue: 1 });
};

// Total fair market value and count, optionally filtered
hipcomicItemSchema.statics.totals = async function (filter = {}) {
    const [row] = await this.aggregate([
        { $match: filter },
        { $group: { _id: null, count: { $sum: 1 }, fmv: { $sum: { $ifNull: ["$fmv", 0] } } } },
    ]);
    return row ? { count: row.count, fmv: Math.round(row.fmv * 100) / 100 } : { count: 0, fmv: 0 };
};

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = mongoose.model("HipcomicItem", hipcomicItemSchema);