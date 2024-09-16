const cloudinary = require("cloudinary");
const cloud = require("../../libs/cloud");
//const cloud = require("../../libs/cloud");
/**
 * @api {get} /all Request Model information
 * @apiName crud.all
 * @apiGroup Model
 *
 * @apiSuccess {Object} Model document.
 * @apiSuccess {Boolean} Success: true / false.
 * @apiSuccess {String} Informative message.
 */
exports.all = async (Model, req, res) => {



}


/**
 *  Retrieves a single document by id.
 *  @param {string} req.params.id
 *  @returns {Document} Single Document
 */

exports.read = async (Model, req, res) => {
  if (!req.params || req.params.id) throw new Error("No ID");
  const msg = "document with id :: " + req.params.id;

  try {
    await Model.findOne({ _id: req.params.id })
      .then((result) => {
        if (!result) return res.status(404).json({ result:null, success: false, message: "No " + msg });
        return res.status(200).json({ result, success: true, message: "Found " + msg });
      })
      .catch((error) => {
        throw new Error("Unable to find document Error");
      })
  } catch (err) {
    throw new Error("Internal Server Error");
  }
};

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */

exports.create = async (Model, req, res) => {
  let images = [];

  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    const imagesLinks = [];
    const chunkSize = 3;
    const imageChunks = [];
    
    while (images.length > 0) {
      imageChunks.push(images.splice(0, chunkSize));
    }
    for (let chunk of imageChunks) {
      const uploadPromises = chunk.map((img) =>
        cloudinary.v2.uploader.upload(img, {
          folder: "products",
        })
      );

      const results = await Promise.all(uploadPromises);
      for (let result of results) { 
        imagesLinks.push({
          product_id: result.public_id,
          url: result.secure_url,
        });
      }
    }
    //TODO:: use this instead
    //links = cloud.uploadImages(req.body.images);
    //req.body.images = links;

    req.body.images = imagesLinks;
  }

  console.log("Creating Document :: ", req.body);
  await new Model(req.body).save()
    .then(( result ) => { 
      if (!result) throw new Error("Error saving document");
      return res.status(200).json({ result, success: true, message: "Successfully Created the document in Model " });
    }) 
    .catch(( error ) => {
      if (error.name == "ValidationError") {
        return res.status(400).json({ result: null, success: false, message: "Required fields are not supplied" });
      } else {
        throw new Error("Internal Server Error");
      }
    });
};

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */

exports.update = async (Model, req, res) => {
  try {
    // Find document by id and updates with the required fields
    const result = await Model.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();

    return res.status(200).json({
      success: true,
      result,
      message: "we update this document by this id: " + req.params.id,
    });
  } catch (err) {
    // If err is thrown by Mongoose due to required validations
    if (err.name == "ValidationError") {
      return res.status(400).json({
        success: false,
        result: null,
        message: "Required fields are not supplied",
      });
    } else {
      // Server Error
      return res.status(500).json({
        success: false,
        result: null,
        message: "Oops there is an Error",
      });
    }
  }
};

/**
 *  Delete a Single document
 *  @param {string} req.params.id
 *  @returns {string} Message response
 */

exports.delete = async (Model, req, res) => {
  try {
    // Find the document by id and delete it

    // Find the document by id and delete it
    const result = await Model.findOneAndDelete({ _id: req.params.id }).exec();
    // If no results found, return document not found
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this id: " + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "Successfully Deleted the document by id: " + req.params.id,
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
};

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  try {
    const resultsPromise = Model.find()
      .skip(skip)
      .limit(limit)
      .sort({ created: "desc" })
      .populate();

    const countPromise = Model.count();
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const pages = Math.ceil(count / limit);

    // Getting Pagination Object
    const pagination = { page, pages, count };
    if (count > 0) {
      return res.status(200).json({
        result,
        success: true,
        pagination,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: "Collection is Empty",
      });
    }
  } catch {
    return res.status(500).json({ success: false, result: [], message: "Oops there is an Error" });
  }
};

/**
 *  Searching documents with specific properties
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */

exports.search = async (Model, req, res) => {
  if (req.query.q === undefined || req.query.q === "" || req.query.q === " ") {
    return res
      .status(202)
      .json({
        success: false,
        result: [],
        message: "No document found by this request",
      })
      .end();
  }

  const fieldsArray = req.query.fields.split(",");
  const fields = { $or: [] };

  for (const field of fieldsArray) {
    fields.$or.push({ [field]: { $regex: new RegExp(req.query.q, "i") } });
  }

  try {
    let results = await Model.find(fields).sort({ name: "asc" }).limit(10);

    if (results.length >= 1) {
      return res.status(200).json({
        success: true,
        result: results,
        message: "Successfully found all documents",
      });
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "No document found by this request",
        })
        .end();
    }
  } catch {
    throw new Error("Internal Server Error");
  }
};
