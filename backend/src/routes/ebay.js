const Ebay = require("../libs/ebay");

module.exports = ( fear ) => {
      const router = fear.createRouter();
      const handler = fear.getHandler();

      router.route("/auth/connect")
            .get(handler.async(Ebay.connect));                    

      router.route("/auth/callback")
            .get(handler.async(Ebay.callback));                

      router.route("/auth/status")
            .get(handler.async(Ebay.status));               

      router.route("/auth/disconnect")
            .post(handler.async(Ebay.disconnect));                 

      router.route("/auth/refresh")
            .post(handler.async(Ebay.refresh));                  

      router.route("/listings")
            .get(handler.async(Ebay.listListings));                

      router.route("/listings/import")
            .post(handler.async(Ebay.importListings));            

      router.route("/listings/search")
            .post(handler.async(Ebay.searchListings));          

      router.route("/listings/:listingId")
            .get(handler.async(Ebay.getListing))              
            .put(handler.async(Ebay.updateListing))              
            .delete(handler.async(Ebay.deleteListing));          

      router.route("/listings/export")
            .post(handler.async(Ebay.exportProducts));  

      router.route("/listings/sync/:productId")
            .post(handler.async(Ebay.syncProduct));     

      router.route("/listings/sync")
            .post(handler.async(Ebay.syncAll));  

      return router;
};