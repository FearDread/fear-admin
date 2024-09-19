const express = require("express");
const Brand = require("../controllers/brand");
const { isAuthorized, isAdmin } = require("../controllers/auth");
const router = express.Router();

router.get("/all", Brand.all);
router.post("/new", Brand.create);
router.route("/:id")
        .put(Brand.update)
        .get(Brand.read)
        .delete(Brand.delete);

module.exports = router;