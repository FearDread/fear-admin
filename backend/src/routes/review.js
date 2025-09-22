const Review = require("../controllers/review");

module.exports = (fear) => {
      const router = fear.createRouter();

      router.post("/new", Review.review)
            .get("/rating", Review.rating)
            .get("/product/:id", Review.getProductReviews);
            
      return router;
};