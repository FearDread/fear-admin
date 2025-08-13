import { FeatureFactory, ThunkFactory } from '@feardread/feature-factory';


export const placeOrder = ThunkFactory.post('order', 'new');
export const processPayment = ThunkFactory.post('order', 'payment');

export const { slice: orderSlice, asyncActions: Order } = FeatureFactory('order').create({
    service: { placeOrder, processPayment }
});

export default { orderSlice, Order };