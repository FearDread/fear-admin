const { tryCatch } = require("../../libs/handler/error");
const cloud = require("../../libs/cloud");
const SearchApi = require("../../libs/search/api");
const mongoose = require("mongoose");
const R = require("../request");

// ── helpers ──────────────────────────────────────────────────────────────────

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);

/** Returns a resolved failure response if the id is unusable, otherwise null. */
const checkId = (res, id) => {
    if (id && isValidObjectId(id)) return null;
    // tryCatch expects a Promise back, so early exits resolve too.
    return Promise.resolve(R.fail(res, 400, id ? "Invalid document ID format" : "Document ID is required"));
};

/** Maps the errors Mongoose throws onto the right status + envelope. */
const handleError = (res, error, message) => {
    console.error(`${message}:`, error);

    if (error.name === "ValidationError") {
        const errors = {};
        Object.keys(error.errors).forEach((field) => { errors[field] = [error.errors[field].message]; });
        return R.fail(res, 400, message, errors);
    }
    if (error.name === "CastError") {
        return R.fail(res, 400, `Invalid value for ${error.path}`);
    }
    if (error.code === 11000) {
        const errors = {};
        Object.keys(error.keyPattern || error.keyValue || {}).forEach((field) => { errors[field] = ["Already exists"]; });
        return R.fail(res, 409, "Duplicate value", errors);
    }
    return R.fail(res, 500, message, error); // `error` only reaches the client in development
};

const sanitizeUpdateData = (data) => {
    const sanitized = { ...data };
    Object.keys(sanitized).forEach((key) => {
        if (sanitized[key] === undefined) delete sanitized[key];
    });
    return sanitized;
};

const processImages = (images) => {
    if (!images) return Promise.resolve(null);

    const imageArray = Array.isArray(images) ? images : images.split(",").map((item) => item.trim());

    return cloud.uploadImages(imageArray)
        .then((imageLinks) => imageLinks || null)
        .catch((error) => {
            console.error("Error uploading images:", error);
            return null;
        });
};

// ── handlers ─────────────────────────────────────────────────────────────────

/** GET /all → { result: [...], count } */
exports.all = tryCatch((Model, req, res) => {
    const { sort = "category", order = "asc", populate = "true" } = req.query;

    let query = Model.find().sort({ [sort]: order === "desc" ? -1 : 1 });
    if (populate !== "false") query = query.populate();

    return query
        .exec()
        .then((result) => {
            if (!result || result.length === 0) return R.ok(res, [], "No documents found");
            return R.ok(res, result, `Found ${result.length} documents`);
        })
        .catch((error) => handleError(res, error, "Error fetching documents"));
});

/** GET /:id → { result: doc } */
exports.read = tryCatch((Model, req, res) => {
    const { id } = req.params;
    const bad = checkId(res, id);
    if (bad) return bad;

    return Model.findById(id).exec()
        .then((result) => {
            if (!result) return R.fail(res, 404, `Document with ID ${id} not found`);
            return R.ok(res, result, "Document found successfully");
        })
        .catch((error) => handleError(res, error, "Error reading document"));
});

/** POST /new → 201 { result: doc } */
exports.create = tryCatch((Model, req, res) => {
    const documentData = { ...req.body };
    const featured = documentData.featuredImage;
    if (featured && documentData.images) documentData.images.push(featured);

    const imagePromise = documentData.images && documentData.images.length !== 0
        ? processImages(documentData.images)
        : Promise.resolve(null);

    return imagePromise
        .then((imageLinks) => {
            if (imageLinks) documentData.images = imageLinks;
            return new Model(documentData).save();
        })
        .then((result) => R.created(res, result, `Document created successfully in ${Model.modelName} collection`))
        .catch((error) => handleError(res, error, "Error creating document"));
});

/** PUT /:id → { result: updatedDoc } */
exports.update = tryCatch((Model, req, res) => {
    const { id } = req.params;
    const bad = checkId(res, id);
    if (bad) return bad;

    const updateData = sanitizeUpdateData(req.body);

    const imagePromise = Array.isArray(updateData.images) && updateData.images.length > 0
        ? processImages(updateData.images)
        : Promise.resolve(null);

    return imagePromise
        .then((uploadedImages) => {
            if (uploadedImages) updateData.images = uploadedImages;
            return Model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
        })
        .then((result) => {
            if (!result) return R.fail(res, 404, `Document with ID ${id} not found`);
            return R.ok(res, result, `Document updated successfully with ID: ${id}`);
        })
        .catch((error) => handleError(res, error, "Error updating document"));
});

/** DELETE /:id → { result: deletedDoc } */
exports.delete = tryCatch((Model, req, res) => {
    const { id } = req.params;
    const bad = checkId(res, id);
    if (bad) return bad;

    return Model.findByIdAndDelete(id).exec()
        .then((result) => {
            if (!result) return R.fail(res, 404, `Document with ID ${id} not found`);

            if (Array.isArray(result.images) && result.images.length > 0) {
                // TODO: cloud.deleteImages(result.images) once it exists
                console.log("Document had images that should be cleaned up:", result.images);
            }

            return R.ok(res, result, `Document deleted successfully with ID: ${id}`);
        })
        .catch((error) => handleError(res, error, "Error deleting document"));
});

/** GET / → { result: [...], count, pagination } */
exports.list = tryCatch((Model, req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.items) || 10));
    const { sort = "createdAt", order = "desc", populate = "true" } = req.query;

    const findQuery = Model.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ [sort]: order === "asc" ? 1 : -1 })
        .populate(populate !== "false" ? undefined : null)
        .exec();

    return Promise.all([findQuery, Model.countDocuments().exec()])
        .then(([result, count]) => {
            const totalPages = Math.ceil(count / limit);
            const pagination = {
                currentPage: page,
                totalPages,
                totalItems: count,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            };

            return R.list(res, result, pagination, count > 0 ? `Found ${result.length} of ${count} documents` : "Collection is empty");
        })
        .catch((error) => handleError(res, error, "Error listing documents"));
});

/** POST /search → { result: [...], count, meta: { total, count, pagination, query } } */
exports.search = tryCatch((Model, req, res) => {
    const { keyword, category, brand, minPrice, maxPrice, rating, sortBy = "popularity", page = 1, limit = 24 } = req.query;

    const queryObj = { page: parseInt(page), limit: parseInt(limit) };

    if (keyword) queryObj.keyword = keyword;
    if (category) queryObj.category = category;
    if (brand) queryObj.brand = { in: brand };

    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.gte = parseFloat(minPrice);
        if (maxPrice) queryObj.price.lte = parseFloat(maxPrice);
    }

    if (rating) queryObj.rating = { gte: parseFloat(rating) };

    const sortOptions = {
        popularity: { popularity: -1 },
        newest: { createdAt: -1 },
        "price-low": { price: 1 },
        "price-high": { price: -1 },
        rating: { rating: -1 },
    };

    const searchApi = new SearchApi(Model, queryObj, {
        searchFields: ["_id", "id", "price", "name", "description", "tags"],
        defaultSort: sortOptions[sortBy] || sortOptions.popularity,
    });

    return searchApi
        .search(["_id", "id", "price", "name", "description", "brand", "tags"])
        .filter()
        .sort()
        .selectFields("-__v,-updatedAt")
        .populate("reviews")
        .paginate(parseInt(limit), 50)
        .execute()
        .then(({ result, meta }) => R.send(res, 200, result, `Found ${meta.total} documents`, { meta, ...(meta.pagination ? { pagination: meta.pagination } : {}) }))
        .catch((error) => handleError(res, error, "Error searching documents"));
});

/** Controller with every CRUD method bound to one Model. */
module.exports = (Model) => ({
    all: (req, res) => exports.all(Model, req, res),
    read: (req, res) => exports.read(Model, req, res),
    create: (req, res) => exports.create(Model, req, res),
    update: (req, res) => exports.update(Model, req, res),
    delete: (req, res) => exports.delete(Model, req, res),
    list: (req, res) => exports.list(Model, req, res),
    search: (req, res) => exports.search(Model, req, res),
});