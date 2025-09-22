const Coupon = require("../controllers/coupon");

module.exports = (fear) => {
  const router = fear.createRouter();
  const validator = fear.getValidator();
  const handler = fear.getHandler();
  /*
  router.post("/", Coupon.createCoupon);
  router.get("/", Coupon.getAllCoupons);
  router.get("/:id", Coupon.getCoupon);
  router.put("/:id", Coupon.updateCoupon);
  router.delete("/:id", Coupon.deleteCoupon);
  */
  return router;
};
