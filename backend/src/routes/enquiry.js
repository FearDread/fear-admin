const express = require("express");
const enquiry= require("../controllers/enquiry");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const router = express.Router();

/*
router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getEnquiry);
router.get("/", getallEnquiry);
*/

module.exports = router;
