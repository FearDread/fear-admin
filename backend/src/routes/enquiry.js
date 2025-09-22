const Enquiry = require("../controllers/enquiry");

module.exports = (fear) => {
    const router = fear.createRouter();

    /*
    router.post("/", createEnquiry);
    router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
    router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
    router.get("/:id", getEnquiry);
    router.get("/", getallEnquiry);
    */
    return router;
}