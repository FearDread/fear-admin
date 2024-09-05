/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
exports.catchError = (fn) => {
    return function (req, res, next) {
      const resp = fn(req, res, next);
      if (resp instanceof Promise) {
        return resp.catch(next);
      }
      return resp;
    };
  };
  
/*
    Not Found Error Handler
    If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = ( req, res ) => {
    return res.status(StatusCodes.NOT_FOUND).send("Route does not exist");
};

  /*
    Development Error Handler
  
    In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
  */
exports.devError = (err, req, res, next) => {
    err.stack = err.stack || "";
    const details = {
      message: err.message || "Server Error",
      status: err.status,
      stackHighlighted: err.stack.replace(
        /[a-z_-\d]+.js:\d+:\d+/gi,
        "<mark>$&</mark>"
      ),
    };
    res.status(500).json({ success: false, error: details });
  };
  
  /*
    Production Error Handler 
    No stacktraces are leaked to admin
  */
exports.prodError = (err, req, res, next) => {
    res.status(500).json({ success: false, message: "Error in Server" });
};