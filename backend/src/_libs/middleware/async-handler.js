

const asyncHandler = (fn) => {
    return function (req, res, next) {
        const resp = fn(req, res, next);
        if (resp instanceof Promise) {
          return resp.catch(next);
        }
        return resp;
    };
}

module.exports = asyncHandler;
