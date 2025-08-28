import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";

const service = {
    addToCart: ThunkFactory.post('cart', 'new'),
    getUserCart: ThunkFactory.post('cart', 'user')
}

const cartFeature = FeatureFactory('cart', {
    //TO DO:: Add cart state mutation methods
})

export const { slice: cartSlice, asyncActions: Cart } = cartFeature.create({service});

export default { cartSlice, Cart };