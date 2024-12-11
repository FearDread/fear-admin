const Task = require('../controllers/task');
const express = require("express");
const router = express.Router();

router.post("/new", Task.create)
      .put("/:id", Task.update)
      .delete("/:id", Task.delete)
      .get("/all", Task.all);

module.exports = router;