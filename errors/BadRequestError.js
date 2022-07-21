class BadRequestError extends Error {
  constructor(msg, status = 400) {
    super(msg);

    this.status = status;
  }
}

module.exports = BadRequestError;
