const Review = require("../controllers/review");

module.exports = (fear) => {
      const router = fear.createRouter();

      router.post("/new", Review.add)
            .get("/rating", Review.rating)
            .get("/:id", Review.getProductReviews);

      router.get("/by-product", Review.getProductReviews);
      
      return router;
};