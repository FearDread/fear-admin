const { tryCatch } = require("../libs/handler/error");
const Product = require("../models/product");
const Review = require("../models/review");
const methods = require("./crud");

exports.review = tryCatch(async (req, res) => {
  const { rating, comment } = req.body;
  
  await Product.findById(req.params.id)
    .then((product) => {
      if (product) {
        const alreadyReviewed = product.reviews.find(
          (r) => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) throw new Error("Product already reviewed");

        const review = {
          user: req.user._id,
          product: product._id,
          rating: Number(rating),
          comment
        };
        product.reviews.push(review);
        product.rating =
          product.reviews.reduce((acc, item) => item.rating + acc, 0) /
          product.reviews.length;
  
        product.save()
          .then((finalProduct) => { return res.status(200).json({ result: finalProduct, success: true });})
          .catch((err) => { throw new Error(err);});
      } else {
        return res.status(400).json({result: null, success: false, message: "No Product found"});
      }
    })
    .catch((error) => { throw new Error(error); })
});


exports.rating = tryCatch(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  const product = await Product.findById(prodId);
  let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    
  const getallratings = await Product.findById(prodId);
  let totalRating = getallratings.ratings.length;
  let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    
  let actualRating = Math.round(ratingsum / totalRating);
    
  await Product.findByIdAndUpdate( prodId, { totalrating: actualRating }, { new: true })
      .then((finalProduct) => { return res.status(200).json({ result: finalProduct, success: true }); })
      .catch((error) => { throw new Error(error); });
});

exports.trending = tryCatch(async (req, res) => {

  await Product.find().sort({ $natural: -1 }).limit(8)
    .then((result) => { 
      if (!result) {
        return res.status(400).json({ success:false, message: "Error find documents"});
      }
      return res.status(200).json({ result, success: true, message: "Latest Trending Products" });
     })
    .catch((error) => {  throw new Error(error); })
})

const crud = methods.crudController( Product );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}