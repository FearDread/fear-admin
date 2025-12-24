const { tryCatch } = require("../../libs/handler/error");
const cloud = require("../../libs/cloud");
const SearchApi = require("../../libs/search/api");
const mongoose = require("mongoose");

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid ObjectId
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Get all documents for requested Model
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.all = tryCatch(async (Model, req, res) => {
  const { sort = 'category', order = 'asc', populate = 'true' } = req.query;
  
  const sortOrder = order === 'desc' ? -1 : 1;
  let query = Model.find().sort({ [sort]: sortOrder });

  // Apply population if requested
  if (populate !== 'false') {
    query = query.populate();
  }

  const result = await query.exec();

  if (!result || result.length === 0) {
    return res.status(200).json({
      result: [],
      success: true,
      message: "No documents found",
      count: 0
    });
  }

  return res.status(200).json({
    result,
    success: true,
    message: `Found ${result.length} documents`,
    count: result.length
  });
});

/**
 * Retrieves a single document by id
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.read = tryCatch(async (Model, req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid or Missing Document ID"
    });
  }
  const result = await Model.findById(id).exec();

  if (!result) {
    return res.status(404).json({
      result: null,
      success: false,
      message: `Document with ID ${id} not found`
    });
  }

  return res.status(200).json({
    result,
    success: true,
    message: "Document found successfully"
  });
});

/**
 * Creates a single document with all necessary req.body fields
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.create = tryCatch(async (Model, req, res) => {
  const documentData = { ...req.body };
  // Handle image uploads if present
  if (documentData.images) {

      documentData.images.split(',').map(item => item.trim());
    
      const imageLinks = await cloud.uploadImages(documentData.images);
    
      if ( imageLinks ) documentData.images = imageLinks;
  }

  console.log('Creating document:', documentData);

  const document = new Model(documentData);
  await document.save()
      .then((result) => {
        return res.status(201).json({ result, success: true,
          message: `Document created successfully in ${Model.modelName} collection`});
      })
      .catch((error) => {console.log('Error Saving document :: ', error);});
});

/**
 * Updates a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.update = tryCatch(async (Model, req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Document ID is required"
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid document ID format"
    });
  }

  const updateData = { ...req.body };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // Handle image uploads if present
  if (updateData.images && Array.isArray(updateData.images) && updateData.images.length > 0) {
    const uploadedImages = await cloud.uploadImages(updateData.images);
    updateData.images = uploadedImages;
  }

  // Update document
  const result = await Model.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).exec();

  if (!result) {
    return res.status(404).json({
      result: null,
      success: false,
      message: `Document with ID ${id} not found`
    });
  }

  return res.status(200).json({
    result,
    success: true,
    message: `Document updated successfully with ID: ${id}`
  });
});

/**
 * Delete a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.delete = tryCatch(async (Model, req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Document ID is required"
    });
  }

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid document ID format"
    });
  }

  const result = await Model.findByIdAndDelete(id).exec();

  if (!result) {
    return res.status(404).json({
      result: null,
      success: false,
      message: `Document with ID ${id} not found`
    });
  }

  // TODO: Clean up associated images if they exist
  if (result.images && Array.isArray(result.images) && result.images.length > 0) {
    console.log('Document had images that should be cleaned up:', result.images);
    // Uncomment when cloud.deleteImages is available:
    // await cloud.deleteImages(result.images);
  }

  return res.status(200).json({
    result,
    success: true,
    message: `Document deleted successfully with ID: ${id}`
  });
});

/**
 * Get paginated list of documents
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.list = tryCatch(async (Model, req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.items) || 10));
  const skip = (page - 1) * limit;
  const { sort = 'createdAt', order = 'desc', populate = 'true' } = req.query;

  const sortOrder = order === 'asc' ? 1 : -1;

  // Execute count and find queries in parallel
  const [result, count] = await Promise.all([
    Model.find()
      .skip(skip)
      .limit(limit)
      .sort({ [sort]: sortOrder })
      .populate(populate !== 'false' ? undefined : null)
      .exec(),
    Model.countDocuments().exec()
  ]);

  const totalPages = Math.ceil(count / limit);
  const pagination = {
    currentPage: page,
    totalPages,
    totalItems: count,
    itemsPerPage: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  };

  return res.status(200).json({
    result,
    success: true,
    pagination,
    message: count > 0 
      ? `Found ${result.length} of ${count} documents` 
      : "Collection is empty"
  });
});

/**
 * Search documents with specific properties
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.search = tryCatch(async (Model, req, res) => {
  console.log('CRUD search query:', req.query);

  const {
    keyword,
    category,
    brand,
    minPrice,
    maxPrice,
    rating,
    sortBy = 'popularity',
    page = 1,
    limit = 24
  } = req.query;

  // Build query object
  const queryObj = { 
    page: parseInt(page), 
    limit: parseInt(limit) 
  };

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
    'price-low': { price: 1 },
    'price-high': { price: -1 },
    rating: { rating: -1 }
  };

  const searchApi = new SearchApi(Model, queryObj, {
    searchFields: ['_id', 'id', 'price', 'name', 'description', 'tags'],
    defaultSort: sortOptions[sortBy] || sortOptions.popularity
  });

  const result = await searchApi
    .search(['_id', 'id', 'price', 'name', 'description', 'brand', 'tags'])
    .filter()
    .sort()
    .selectFields('-__v,-updatedAt')
    .populate('reviews')
    .paginate(parseInt(limit), 50)
    .execute();

  return res.status(200).json({
    success: true,
    ...result
  });
});

/**
 * Create a controller object with all CRUD methods bound to a specific Model
 * @param {mongoose.Model} Model - Mongoose model
 * @returns {Object} Controller object with all CRUD methods
 */
module.exports = (Model) => {
  return {
    all: (req, res) => exports.all(Model, req, res),
    read: (req, res) => exports.read(Model, req, res),
    create: (req, res) => exports.create(Model, req, res),
    update: (req, res) => exports.update(Model, req, res),
    delete: (req, res) => exports.delete(Model, req, res),
    list: (req, res) => exports.list(Model, req, res),
    search: (req, res) => exports.search(Model, req, res)
  };
};