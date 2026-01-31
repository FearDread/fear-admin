const Review = require("../controllers/review");

module.exports = (fear) => {
      const router = fear.createRouter();
      const handler = fear.getHandler();
      
      router.get("/all", handler.async(Review.all));
      router.post("/new", handler.async(Review.add));
      router.route("/:id")
            .put(Review.update)
            .delete(Review.delete)
            .get(Review.getProductReviews);
      
      return router;
};