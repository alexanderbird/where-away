const path = require('path');

if (!process.env.TEST_SANDBOX) {
  throw new Error('Configuration error: expected TEST_SANDBOX environment variable with path to test sandbox');
}

module.exports = {
  htmlOutputPath: path.join(process.env.TEST_SANDBOX, process.env.RESULT_FILE),
  fakeExternalLinkPath: path.join(process.env.TEST_SANDBOX, 'fake_external_link.html')
}
