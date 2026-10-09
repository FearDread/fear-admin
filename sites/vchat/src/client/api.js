const BASE = '/fear/api/vchat';

async function request(method, path, body) {
    const res = await fetch(BASE + path, {
        method,
        credentials: 'same-origin',
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        data = await res.json();
    } catch (err) {
        /* empty or non-JSON body */
    }

    if (res.status === 401 && path !== '/login' && path !== '/session') {
        window.dispatchEvent(new Event('vchat:unauthorized'));
    }

    if (!res.ok) {
        const error = new Error((data && (data.error || data.message)) || `Request failed (${res.status})`);
        error.status = res.status;
        throw error;
    }

    return data;
}

export const api = {
    session: () => request('GET', '/session'),
    login: (email, password) => request('POST', '/login', { email, password }),
    logout: () => request('POST', '/logout'),
    config: () => request('GET', '/config'),
    token: () => request('GET', '/token'),
    createRoom: () => request('POST', '/rooms'),
};
