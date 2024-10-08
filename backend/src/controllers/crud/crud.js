const { tryCatch } = require("../../libs/handler/error");
const cloud = require("../../libs/cloud");


/**
 * @api {get} /all Request Model information
 * @apiName crud.all
 * @apiGroup Model
 *
 * @apiSuccess {Object} Model document.
 * @apiSuccess {Boolean} Success: true / false.
 * @apiSuccess {String} Informative message.
 */
exports.all = tryCatch(async (Model, req, res) => {
  await Model.find()
    .then((result) => { return res.status(200).json({ result, success: true, message: "All Documents found" }); })
    .catch((error) => { return res.status(400).json({ result: null, success: false, message: "No docs found." }); });
});

/**
 *  Retrieves a single document by id.
 *  @param {string} req.params.id
 *  @returns {Document} Single Document
 */
exports.read = tryCatch(async (Model, req, res) => {
  const { id } = req.params;
  //db.validateId(id);
  if (!req.params || req.params.id) throw new Error("No ID");
  const msg = "document with id :: " + req.params.id;
  await Model.findOne({ _id: req.params.id })
    .then((result) => { return res.status(200).json({ result, success: true, message: "Found " + msg }); })
    .catch((error) => { return res.status(404).json({ result:null, success: false, message: "No " + msg }); })
});

/**
 *  Creates a Single document by giving all necessary req.body fields
 *  @param {object} req.body
 *  @returns {string} Message
 */
exports.create = tryCatch(async (Model, req, res) => {
  if (req.body.images) {
    let links = await cloud.uploadImages(req.body.images);
    req.body.images = links;
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
});

/**
 *  Updates a Single document
 *  @param {object, string} (req.body, req.params.id)
 *  @returns {Document} Returns updated document
 */
exports.update = tryCatch(async (Model, req, res) => {

  await Model.findOneAndUpdate({ _id: req.params.id }, req.body,
      { new: true, runValidators: true })
      .exec()
      .then((result) => {
        return res.status(200).json({ result, success: true, message: "we update this document by this id: " + req.params.id });
      })
      .catch((err) => {
        if (err.name == "ValidationError") {
          return res.status(400).json({ success: false, result: null, message: "Required fields are not supplied" });
        } else {
          throw new Error("Internal Server Error");
        }
      })
});

/**
 *  Delete a Single document
 *  @param {string} req.params.id
 *  @returns {string} Message response
 */
exports.delete = tryCatch(async (Model, req, res) => {
  const { id } = req.params;

  await Model.findOneAndDelete({ _id: id }).exec()
    .then((result) => { return res.status(200).json({ result, success: true, message: "Successfully Deleted the document by id: " + id}); })
    .catch((error) => { return res.status(404).json({ success: false, result: null, message: error.message }); });
});

/**
 *  Get all documents of a Model
 *  @param {Object} req.params
 *  @returns {Object} Results with pagination
 */

exports.list = tryCatch(async (Model, req, res) => {
  const page = req.query.page || 1;
  const limit = 10;
  const skip = page * limit - limit;
  //const countPromise = Model.count();
  await Model.find()
    .then((result) => {
      console.log("list result = ", result);
      const count = result.length || 1;
      const pages = Math.ceil(count / limit);
      const pagination = { page, pages, count };

      if (!result) return res.status(203).json({ result: [], success: false, pagination, message: "Collection is Empty" });
      
      return res.status(200).json({ result, success: true, pagination, message: "Successfully found all documents" });
    })
    .catch((error) => { return res.status(400).json({ success: false, result: [], error }); });
});

/**
 *  Searching documents with specific properties
 *  @param {Object} req.query
 *  @returns {Array} List of Documents
 */
exports.search = tryCatch(async (Model, req, res) => {
  if (req.query.q === undefined || req.query.q === "" || req.query.q === " ") {
    return res
      .status(202)
      .json({ result: [], success: false, message: "No document found by this request" })
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
});
