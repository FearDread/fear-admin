import { api } from './api.js';

export const ROOM_PATTERN = /^[\w-]{1,64}$/;

const read = (key) => {
    try {
        return localStorage.getItem(key) || '';
    } catch (err) {
        return '';
    }
};

const invite = new URLSearchParams(location.search).get('room');

export const state = {
    user: null,
    config: null,
    room: null,
    name: read('vchat:name'),
    pendingRoom: invite && ROOM_PATTERN.test(invite) ? invite : null,
};

export function setName(name) {
    state.name = name;
    try {
        localStorage.setItem('vchat:name', name);
    } catch (err) {
        /* storage unavailable */
    }
}

export function go(view) {
    if (location.hash.slice(1) !== view) location.hash = view;
}

export async function ensureConfig() {
    if (!state.config) state.config = await api.config();
    return state.config;
}
