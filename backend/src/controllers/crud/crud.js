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
 * Sanitizes update data by removing undefined values
 * @param {Object} data - Data object to sanitize
 * @returns {Object} Sanitized data object
 */
const sanitizeUpdateData = (data) => {
  const sanitized = { ...data };
  Object.keys(sanitized).forEach(key => {
    if (sanitized[key] === undefined) {
      delete sanitized[key];
    }
  });
  return sanitized;
};

/**
 * Processes image data for upload
 * @param {string|Array} images - Images to process
 * @returns {Promise<Array>} Promise resolving to uploaded image URLs
 */
const processImages = (images) => {
  if (!images) return Promise.resolve(null);
  console.log('processing images = ', images);
  const imageArray = Array.isArray(images) 
    ? images 
    : images.split(',').map(item => item.trim());
  
  return cloud.uploadImages(imageArray)
    .then(imageLinks => imageLinks || null)
    .catch(error => {
      console.error('Error uploading images:', error);
      return null;
    });
};

/**
 * Get all documents for requested Model
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.all = tryCatch((Model, req, res) => {
  const { sort = 'category', order = 'asc', populate = 'true' } = req.query;
  const sortOrder = order === 'desc' ? -1 : 1;
  
  let query = Model.find().sort({ [sort]: sortOrder });

  if (populate !== 'false') query = query.populate();

  return query
    .exec()
    .then(result => {
      if (!result || result.length === 0) {
        return res.status(200).json({result: [],success: true,message: "No documents found",count: 0});
      }

      return res.status(200).json({result,success: true,message: `Found ${result.length} documents`,count: result.length});
    })
    .catch(error => {
      console.error('Error fetching documents:', error);
      return res.status(500).json({result: null,success: false});
    });
});

/**
 * Retrieves a single document by id
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.read = tryCatch((Model, req, res) => {
  const { id } = req.params;

  if (!id || !isValidObjectId(id)) {
    return Promise.resolve(
      res.status(400).json({
        result: null,
        success: false,
        message: "Invalid or missing document ID"
      })
    );
  }

  return Model.findById(id).exec()
    .then(result => {
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
    .catch(error => {
      console.error('Error reading document:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error reading document"
      });
    });
});

/**
 * Creates a single document with all necessary req.body fields
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.create = tryCatch((Model, req, res) => {
  const documentData = { ...req.body };
  const featured = documentData.featuredImage;
  if (featured && documentData.images) documentData.images.push(featured);
  let imagePromise;
  
  if (documentData.images && documentData.images.length !== 0) {
    imagePromise = processImages(documentData.images);
  } else {
    imagePromise = Promise.resolve(null);
  }

  return imagePromise
  .then((imageLinks) => {
      if (imageLinks) {
        documentData.images = imageLinks;
      }
    
      const document = new Model(documentData);      
      return document.save();
  })
  .then((result) => {
      return res.status(201)
        .json({ result, success: true, message: `Document created successfully in ${Model.modelName} collection`
      });
  })
  .catch((error) => {
      console.error('Error creating document:', error);
      return res.status(500).json({ result: null,  success: false,  message: "Error creating document",  error: error.message });
  })
});

/**
 * Updates a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.update = tryCatch((Model, req, res) => {
  const { id } = req.params;

  if (!id) {
    return Promise.resolve(
      res.status(400).json({
        result: null,
        success: false,
        message: "Document ID is required"
      })
    );
  }

  if (!isValidObjectId(id)) {
    return Promise.resolve(
      res.status(400).json({
        result: null,
        success: false,
        message: "Invalid document ID format"
      })
    );
  }

  const updateData = sanitizeUpdateData(req.body);

  const imagePromise = (updateData.images && Array.isArray(updateData.images) && updateData.images.length > 0)
    ? processImages(updateData.images)
    : Promise.resolve(null);

  return imagePromise
    .then(uploadedImages => {
      if (uploadedImages) {
        updateData.images = uploadedImages;
      }

      return Model.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).exec();
    })
    .then(result => {
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
    .catch(error => {
      console.error('Error updating document:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error updating document",
        error: error.message
      });
    });
});

/**
 * Delete a single document
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.delete = tryCatch((Model, req, res) => {
  const { id } = req.params;

  if (!id) {
    return Promise.resolve(
      res.status(400).json({
        result: null,
        success: false,
        message: "Document ID is required"
      })
    );
  }

  if (!isValidObjectId(id)) {
    return Promise.resolve(
      res.status(400).json({
        result: null,
        success: false,
        message: "Invalid document ID format"
      })
    );
  }

  return Model.findByIdAndDelete(id)
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({ result: null, success: false });
      }

      // Clean up associated images if they exist
      if (result.images && Array.isArray(result.images) && result.images.length > 0) {
        console.log('Document had images that should be cleaned up:', result.images);
        // Uncomment when cloud.deleteImages is available:
        // return cloud.deleteImages(result.images)
        //   .then(() => result)
        //   .catch(err => {
        //     console.error('Error deleting images:', err);
        //     return result;
        //   });
      }

      return result;
    })
    .then(result => {
      return res.status(200)
        .json({ result, success: true,
          message: `Document deleted successfully with ID: ${id}`
        });
    })
    .catch(error => {
      console.error('Error deleting document:', error);
      return res.status(500).json({ result: error, success: false });
    });
});

/**
 * Get paginated list of documents
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.list = tryCatch((Model, req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.items) || 10));
  const skip = (page - 1) * limit;
  const { sort = 'createdAt', order = 'desc', populate = 'true' } = req.query;

  const sortOrder = order === 'asc' ? 1 : -1;

  const findQuery = Model.find()
    .skip(skip)
    .limit(limit)
    .sort({ [sort]: sortOrder })
    .populate(populate !== 'false' ? undefined : null)
    .exec();

  const countQuery = Model.countDocuments().exec();

  return Promise.all([findQuery, countQuery])
    .then(([result, count]) => {
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
    })
    .catch(error => {
      console.error('Error listing documents:', error);
      return res.status(500).json({
        result: null,
        success: false,
        message: "Error listing documents"
      });
    });
});

/**
 * Search documents with specific properties
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
exports.search = tryCatch((Model, req, res) => {
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

  return searchApi
    .search(['_id', 'id', 'price', 'name', 'description', 'brand', 'tags'])
    .filter()
    .sort()
    .selectFields('-__v,-updatedAt')
    .populate('reviews')
    .paginate(parseInt(limit), 50)
    .execute()
    .then(result => {
      return res.status(200).json({
        success: true,
        ...result
      });
    })
    .catch(error => {
      console.error('Error searching documents:', error);
      return res.status(500).json({
        success: false,
        message: "Error searching documents",
        error: error.message
      });
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