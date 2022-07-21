class NotFoundError extends Error {
  constructor(msg, status = 404) {
    super(msg, 404);

    this.status = status;
  }
}

module.exports = NotFoundError;
