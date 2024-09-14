const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/upload");
const { uploadPhoto, productImgResize } = require("../libs/middlewares/uploadImage");
const { isAuthorized, isAdmin } = require("../libs/auth");
const router = express.Router();

router.post("/", 
    isAuthorized, isAdmin,
   uploadPhoto.array("images", 10),
   productImgResize,
   uploadImages )

router.delete("/delete-img/:id", isAuthorized, isAdmin, deleteImages);

module.exports = router;
/*

const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;

*/
