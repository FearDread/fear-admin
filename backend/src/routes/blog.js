const express = require("express");
const Blog = require("../controllers/blog");
const router = express.Router();

router.get("/all", Blog.all);
router.post("/new",  Blog.create);

router.put("/likes", Blog.likes);
router.put("/dislikes", Blog.dislikes);

router.route("/:id")
      .get(Blog.read)
      .put(Blog.update)
      .delete(Blog.delete);

module.exports = router;
