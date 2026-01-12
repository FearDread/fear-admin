import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";


export const { slice, asyncActions: Mail } = FeatureFactory('mail', {})
    .create({
        service: {
            sendSubscribe: ThunkFactory.custom('mail', 'subscribe', {
                method: 'POST',
                useParams: true
            }),
            sendContact: ThunkFactory.custom('mail', 'contact', {
                method: 'POST',
                useParams: true,
            }),
            sendTest: ThunkFactory.custom('mail', 'test', {
                method: 'POST',
                useParams: true
            })
        }
    });

export const {
    sendContact,
    sendSubscribe,
    sendTest
} = Mail;

export const selectMailLoading = (state) => state.mail.loading;
export const selectMailSuccess = (state) => state.mail.success;

export default slice;