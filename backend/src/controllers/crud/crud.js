const { tryCatch } = require("../../libs/handler/error");
const cloud = require("../../libs/cloud");
const SearchApi = require("../../libs/search/api");

/**
 * Generic CRUD operations for any Mongoose Model
 * All methods use then/catch pattern for consistency
 */
/**
 * Get all documents for requested Model
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {boolean} Success
 * @returns {string} Message
 * @returns {Array} Result: Array of found Documents
 */
exports.all = tryCatch(async (Model, req, res) => {
  const { sort = 'category', order = 'asc', populate = true } = req.query;
  let query = Model.find();
  // Apply sorting
  const sortOrder = order === 'desc' ? 'desc' : 'asc';
  query = query.sort({ [sort]: sortOrder });
  // Apply population if requested
  if (populate && populate !== 'false') {
    query = query.populate();
  }
  return query
    .then((result) => {
      if (!result || result.length === 0) {
        return res.status(200).json({ result: [], success: true, message: "No documents found", count: 0 });
      }
      return res.status(200).json({
        result, success: true, message: `Found ${result.length} documents`, count: result.length
      });
    })
    .catch((error) => {
      console.error('Error in all method:', error);
      return res.status(500).json({ result: null, success: false, message: "Error retrieving documents", error: error.message });
    });
});

/**
 * Retrieves a single document by id
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.id - Document ID
 * @returns {Document} Single Document
 */
exports.read = tryCatch(async (Model, req, res) => {
  console.log('crud read id = ', req.params);
  /*
  if (!req.params || !req.params.id) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Document ID is required"
    });
  }
*/
  const { id } = req.query;
  const { populate = true } = req.query;

  /*
  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid document ID format"
    });
  }
*/
  let query = Model.findById(id);

  // Apply population if requested
  if (populate && populate !== 'false') {
    query = query.populate();
  }

  return query
    .then((result) => {
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
    })
    .catch((error) => {
      console.error('Error in read method:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error retrieving document",
        error: error.message
      });
    });
});

/**
 * Creates a single document with all necessary req.body fields
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body - Document data
 * @returns {string} Message
 */
exports.create = tryCatch(async (Model, req, res) => {
  const documentData = { ...req.body };

  // Handle image uploads if present
  if (documentData.images)  {
      documentData.images.split(',').map(item => item.trim());

      const imageLinks = await cloud.uploadImages(documentData.images);
      if ( imageLinks ) documentData.images = imageLinks;
      console.log('Added Images:', imageLinks);
  }
  console.log('Creating modified document:', documentData);
  await new Model(documentData).save()
      .then((result) => {
        if (!result) {
          throw new Error("Failed to save document");
        }
        return res.status(201).json({
          result, success: true, message: `Document created successfully in ${Model.modelName} collection`
        });
      })
      .catch((error) => {
        console.error('Error in create method with images:', error);

        if (error.name === "ValidationError") {
          return res.status(400).json({
            result: null,
            success: false,
            message: "Validation failed: Required fields are missing or invalid",
            errors: error.errors
          });
        }

        return res.status(500).json({
          result: null,
          success: false,
          message: "Internal server error during document creation",
          error: error.message
        });
      });

  });

/**
 * Updates a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.body - Updated document data
 * @param {string} req.params.id - Document ID
 * @returns {Document} Returns updated document
 */
exports.update = tryCatch(async (Model, req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Document ID is required"
    });
  }

  const { id } = req.params;
  const updateData = { ...req.body };

  // Remove undefined values
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid document ID format"
    });
  }

  // Handle image uploads if present
  if (updateData.images && Array.isArray(updateData.images)) {
    return cloud.uploadImages(updateData.images)
      .then((uploadedImages) => {
        updateData.images = uploadedImages;

        // Update document with uploaded images
        return Model.findOneAndUpdate(
          { _id: id },
          updateData,
          { new: true, runValidators: true }
        ).exec();
      })
      .then((result) => {
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
      })
      .catch((error) => {
        console.error('Error in update method with images:', error);

        if (error.name === "ValidationError") {
          return res.status(400).json({
            result: null,
            success: false,
            message: "Validation failed: Invalid field values provided",
            errors: error.errors
          });
        }

        return res.status(500).json({
          result: null,
          success: false,
          message: "Internal server error during document update",
          error: error.message
        });
      });
  }

  // Update document without image uploads
  return Model.findOneAndUpdate(
    { _id: id },
    updateData,
    { new: true, runValidators: true }
  )
    .exec()
    .then((result) => {
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
    })
    .catch((error) => {
      console.error('Error in update method:', error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          result: null,
          success: false,
          message: "Validation failed: Invalid field values provided",
          errors: error.errors
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          result: null,
          success: false,
          message: "Update failed: Duplicate value for unique field",
          error: error.message
        });
      }

      return res.status(500).json({
        result: null,
        success: false,
        message: "Internal server error during document update",
        error: error.message
      });
    });
});

/**
 * Delete a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.params.id - Document ID
 * @returns {string} Message response
 */
exports.delete = tryCatch(async (Model, req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Document ID is required"
    });
  }

  const { id } = req.params;

  // Validate ObjectId format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      result: null,
      success: false,
      message: "Invalid document ID format"
    });
  }

  return Model.findOneAndDelete({ _id: id })
    .exec()
    .then((result) => {
      if (!result) {
        return res.status(404).json({
          result: null,
          success: false,
          message: `Document with ID ${id} not found`
        });
      }

      // TODO: Clean up associated images if they exist
      if (result.images && Array.isArray(result.images)) {
        // Could add cloud.deleteImages(result.images) here
        console.log('Document had images that should be cleaned up:', result.images);
      }

      return res.status(200).json({
        result,
        success: true,
        message: `Document deleted successfully with ID: ${id}`
      });
    })
    .catch((error) => {
      console.error('Error in delete method:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error deleting document",
        error: error.message
      });
    });
});

/**
 * Get paginated list of documents
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.query - Query parameters
 * @returns {Object} Results with pagination
 */
exports.list = tryCatch(async (Model, req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = (page - 1) * limit;
  const { sort = 'createdAt', order = 'desc', populate = true } = req.query;

  // Limit maximum items per page
  const maxLimit = Math.min(limit, 100);
  const sortOrder = order === 'asc' ? 1 : -1;

  // Create count and results promises
  const countPromise = Model.countDocuments();

  let resultsQuery = Model.find()
    .skip(skip)
    .limit(maxLimit)
    .sort({ [sort]: sortOrder });

  // Apply population if requested
  if (populate && populate !== 'false') {
    resultsQuery = resultsQuery.populate();
  }

  const resultsPromise = resultsQuery.exec();

  return Promise.all([resultsPromise, countPromise])
    .then(([result, count]) => {
      const totalPages = Math.ceil(count / maxLimit);
      const pagination = {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: maxLimit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };

      if (count > 0) {
        return res.status(200).json({
          result,
          success: true,
          pagination,
          message: `Found ${result.length} of ${count} documents`
        });
      } else {
        return res.status(200).json({
          result: [],
          success: true,
          pagination,
          message: "Collection is empty"
        });
      }
    })
    .catch((error) => {
      console.error('Error in list method:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error retrieving document list",
        error: error.message
      });
    });
});

/**
 * Search documents with specific properties
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} req.query - Query parameters
 * @returns {Array} List of Documents
 */
exports.search = tryCatch(async (Model, req, res) => {
  console.log('crud serach req:: ', req.query);
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
    const queryObj = { page, limit };
    if (keyword) queryObj.keyword = keyword;
    if (category) queryObj.category = category;
    if (brand) queryObj.brand = { in: brand }; // Support multiple brands
    if (minPrice || maxPrice) {
        queryObj.price = {};
        if (minPrice) queryObj.price.gte = minPrice;
        if (maxPrice) queryObj.price.lte = maxPrice;
    }
    if (rating) queryObj.rating = { gte: rating };

    const sortOptions = {
        popularity: { popularity: -1 },
        newest: { createdAt: -1 },
        'price-low': { price: 1 },
        'price-high': { price: -1 },
        rating: { rating: -1 }
    };

    const Search = new SearchApi(Model, queryObj, {
        searchFields: ['_id', 'id', 'price', 'name', 'description', 'tags'],
        defaultSort: sortOptions[sortBy] || sortOptions.popularity
    });

    return await Search
        .search(['_id', 'id', 'price', 'name', 'description', 'brand', 'tags'])
        .filter()
        .sort()
        .selectFields('-__v,-updatedAt')
        .populate('reviews')
        .paginate(limit, 50) // Max 50 items per page
        .execute()
        .then((result) => { return res.status(200).json({ success: true, ...result }); })
        .catch((error) => { return res.status(500).json({ success: false, message: error.message }); })
});


/**
 * Create a controller object with all CRUD methods bound to a specific Model
 * @param {mongoose.Model} Model - Mongoose model
 * @returns {Object} Controller object with all CRUD methods
 */
module.exports = ( Model ) => {

  return {
    all: (req, res) => exports.all(Model, req, res),
    read: (req, res) => exports.read(Model, req, res),
    create: (req, res) => exports.create(Model, req, res),
    update: (req, res) => exports.update(Model, req, res),
    delete: (req, res) => exports.delete(Model, req, res),
    list: (req, res) => exports.list(Model, req, res),
    search: (req, res) => exports.search(Model, req, res),
  };
};