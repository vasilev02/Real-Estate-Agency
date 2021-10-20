const errorMiddleware = (error, req, res, next) => {
  let message = error.message || 'Something went wrong!';
  let status = error.status || 500;


}

module.exports = errorMiddleware;