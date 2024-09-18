const router = require("express").Router();
const Category = require("../controllers/category");
const { authMiddleware, isAdmin } = require("../controllers/auth");

router.get("/all", Category.list);
router.post("/new", Category.create);
router.route("/:id")
      .get(Category.read)
      .put(Category.update)
      .delete(Category.delete);

module.exports = router;
