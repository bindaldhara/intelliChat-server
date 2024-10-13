class ExpressError extends Error {
  constructor(message = "Internal server error", statusCode = 500) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default ExpressError;
