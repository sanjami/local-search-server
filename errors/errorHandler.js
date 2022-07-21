const InternalError = require('./InternalError');
const BadRequestError = require('./BadRequestError');
const NotFoundError = require('./NotFoundError');

/**
 * Custom error handler to standardize error objects returned to
 * the client
 *
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param _next NextFunction function provided by Express
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof InternalError) {
    res
      .status(500)
      .json({ message: err.message, code: 500 });
  } else if (err instanceof BadRequestError) {
    res
      .status(400)
      .json({ message: err.message, code: 400 });
  } else if (err instanceof NotFoundError) {
    res
      .status(404)
      .json({ message: err.message, code: 404 });
  } else {
    res
      .status(
        err && !!err.statusCode
          ? err.statusCode
          : 500,
      )
      .json({
        error: err && !!err.message
          ? { message: err.message, code: err.systemCode || 500 }
          : { message: 'Unknown server error', code: err.systemCode || 500 },
      });
  }
};

module.exports = errorHandler;
