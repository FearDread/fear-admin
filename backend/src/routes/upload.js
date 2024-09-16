const express = require("express");
const { uploadImages, deleteImages } = require("../controllers/upload");
const { uploadPhoto, resize } = require("../libs/cloud");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const router = express.Router();

router.post("/", 
    isAdmin,
    uploadPhoto.array("images", 10),
    resize,
    uploadImages )

router.delete("/delete-img/:id", isAuthorized, isAdmin, deleteImages);

module.exports = router;
