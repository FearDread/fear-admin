const express = require("express");
const Blog = require("../controllers/blog");
const { isAuthorized, isAdmin } = require("../libs/auth");
const { blogImgResize, uploadPhoto } = require("../libs/middlewares/uploadImage");
const router = express.Router();

/*
router.post("/", isAuthorized, isAdmin, createBlog);
router.put(
  "/upload/:id",
  isAuthorized,
  isAdmin,
  uploadPhoto.array("images", 2),
  blogImgResize,
  uploadImages
);
router.put("/likes", isAuthorized, liketheBlog);
router.put("/dislikes", isAuthorized, disliketheBlog);

router.put("/:id", isAuthorized, isAdmin, updateBlog);

router.get("/:id", getBlog);
router.get("/", getAllBlogs);

router.delete("/:id", isAuthorized, isAdmin, deleteBlog);
*/
module.exports = router;
