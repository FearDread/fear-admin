const { tryCatch } = require("../libs/handler/error");
const Product = require("../models/product");
const methods = require("./crud");


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
      .then((finalProduct) => {
        return res.status(200).json({ result: finalproduct, success: true });
      })
      .catch((error) => {
        throw new Error(error);
      });
});

exports.trending = tryCatch(async (req, res) => {

  await Product.find().sort({ $natural: -1 }).limit(8)
    .then((result) => { 
      //console.log('trendy result = ', result);
      if (!result) {
        return res.status(400).json({ success:false, message: "Error find documents"});
      }
      return res.status(200).json({ result, success: true, message: "Latest Trending Products" });
     })
    .catch((error) => { 
      throw new Error(error);
     })
})

const crud = methods.crudController( Product );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}