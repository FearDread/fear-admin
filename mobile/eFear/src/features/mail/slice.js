import { FeatureFactory, ThunkFactory } from "@feardread/feature-factory";


export const { slice, asyncActions: Mail } = FeatureFactory('mail', {})
    .create({
        service: {
            sendSubscribe: ThunkFactory.custom('mail', 'subscribe', {
                method: 'POST',
                useParams: false
            }),
            sendContact: ThunkFactory.custom('mail', 'contact', {
                method: 'POST',
                useParams: false,
            }),
            sendRegister: ThunkFactory.custom('mail', 'welcome', {
                method: 'POST',
                useParams: false,
            }),
            sendTest: ThunkFactory.custom('mail', 'test', {
                method: 'POST',
                useParams: true
            }),
            sendForgotPassword: ThunkFactory.custom('mail', 'forgot', {
                method: 'POST',
                useParams: true
            })
        }
    });

export const {
    sendContact,
    sendForgotPassword,
    sendSubscribe,
    sendRegister,
    sendTest,
} = Mail;

export const selectMailLoading = (state) => state.mail.loading;
export const selectMailSuccess = (state) => state.mail.success;

export default slice;