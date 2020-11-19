class BookmarkValidationError extends Error {
  constructor(line, column, message) {
    super(`[line ${line} column ${column}] ${message}`);
    this.name = 'BookmarkValidationError';
  }
}

module.exports = { BookmarkValidationError };
