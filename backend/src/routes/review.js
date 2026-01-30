const Review = require("../controllers/review");

module.exports = (fear) => {
      const router = fear.createRouter();

      router.post("/new", Review.review)
            .get("/rating", Review.rating)
            //.get("/by-product/:productId", Review.getProductReviews);
      router.get("/by-product", Review.getProductReviews);
      return router;
};