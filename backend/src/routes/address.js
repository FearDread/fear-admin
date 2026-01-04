const Address = require('../controllers/address');

module.exports = ( fear ) => {
      const router = fear.createRouter();
      const handler = fear.getHandler();

      router.get("/all", handler.async(Address.all));
      router.post("/new", handler.async(Address.create));
      router.post("/create", handler.async(Address.create));
      router.route("/:id")
            .get(handler.async(Address.read))
            .put(handler.async(Address.update))
            .delete(handler.async(Address.delete));

      return router;
}