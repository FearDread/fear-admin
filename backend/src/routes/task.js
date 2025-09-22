const Task = require('../controllers/task');

module.exports = (fear) => {
      const router = fear.createRouter();

      router.post("/new", Task.create)
            .put("/:id", Task.update)
            .delete("/:id", Task.delete)
            .get("/all", Task.all);

      return router;
};