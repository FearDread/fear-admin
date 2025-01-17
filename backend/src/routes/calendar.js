const express = require('express');
const Calendar = require('../controllers/calendar');
const router = express.Router();

router.get("/all", Calendar.all);
router.post("/new", Calendar.create);
router.route("/:id")
        .put(Calendar.update)
        .get(Calendar.read)
        .delete(Calendar.delete);

module.exports = router;