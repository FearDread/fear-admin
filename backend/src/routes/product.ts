import { Router } from 'express';
import Product from '../controllers/product';
import asyncHandler from '../middleware/async-handler';

const router: Router = Router();

router.route('/').get(asyncHandler(Product.list));
router.route('/categories').get(asyncHandler(Product.categories));

router.route('/:id')
    .get(asyncHandler(Product.read))
    .put(asyncHandler(Product.update))
    .delete(asyncHandler(Product.delete));

router.route('/new').post(asyncHandler(Product.create));

router.route('/review/new').put(asyncHandler(Product.Review.create));
router.route('/reviews').get(Product.Review.list);
router.route('/reviews/delete').delete(Product.Review.delete);

export default router;