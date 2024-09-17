const Product = require("../models/product");
const methods = require("./crud");


exports rating = async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  try {
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
        res.status(200).json({ result: finalproduct, success: true });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    throw new Error(error);
  }
}

const crud = methods.crudController( Product );
for(prop in crud) {
  if(crud.hasOwnProperty(prop)) {
    module.exports[prop] = crud[prop];
  }
}