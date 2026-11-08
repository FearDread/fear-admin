const BASE = '/fear/api/vchat';
const AUTH = '/fear/api/auth';

const request = (method, path, body) => {
    return fetch(BASE + path, {
        method,
        credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
    })
        .then((res) => {
            return res.json()
                .catch(() => null) /* empty or non-JSON body */
                .then((data) => ({ res, data }));
        })
        .then(({ res, data }) => {
            if (res.status === 401 && path !== '/login' && path !== '/session') {
                window.dispatchEvent(new Event('vchat:unauthorized'));
            }

            if (!res.ok) {
                const error = new Error((data && (data.error || data.message)) || `Request failed (${res.status})`);
                error.status = res.status;
                throw error;
            }

            return data;
        });
}

export const api = {
    session: () => request('GET', '/session'),
    register: (data) => request('POST', '/register', data),
    login: (email, password) => request('POST', '/login', { email, password }),
    logout: () => request('POST', '/logout'),
    config: () => request('GET', '/config'),
    token: () => request('GET', '/token'),
    createRoom: () => request('POST', '/rooms'),
};