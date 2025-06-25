import { InstanceFactory } from "@feardread/feature-factory"

const instance = InstanceFactory({
    API_BASE_URL: 'http://fear.master.com:4000/fear/api',
    JWT_TOKEN: 'fear-x-token'
});

export const API = instance;

export default API;