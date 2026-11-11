const Wishlist = require('../controllers/wishlist');
const Auth = require("../controllers/auth");

module.exports = (fear) => {
    const router = fear.createRouter();
    const validator = fear.getValidator();
    const handler = fear.getHandler();

    router.get('/all', ctrl.getWishlist);
    router.post('/new', ctrl.addToWishlist);
    router.delete('/:id', ctrl.removeFromWishlist);
    router.delete('/all', ctrl.clearWishlist);

    return router;
}