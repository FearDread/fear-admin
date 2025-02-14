const express = require('express');
const Events = require('../controllers/events');
const router = express.Router();

router.get("/all", Events.all);
router.post("/new", Events.create);
router.route("/:id")
        .put(Events.update)
        .get(Events.read)
        .delete(Events.delete);

module.exports = router;