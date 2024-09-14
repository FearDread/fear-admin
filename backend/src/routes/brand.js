const express = require("express");
const Brand = require("../controllers/brand");
const { isAuthorized, isAdmin } = require("../libs/auth");
const router = express.Router();

/*
router.post("/", authMiddleware, isAdmin, createBrand);
router.put("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", authMiddleware, isAdmin, deleteBrand);
router.get("/:id", getBrand);
router.get("/", getallBrand);
*/

module.exports = router;
