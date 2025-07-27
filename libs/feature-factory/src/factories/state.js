
export const StateFactory = (namespace) => ({
    [namespace]: {},
    data: [],
    loading: false,
    success: false,
    error: null
});

export default StateFactory;