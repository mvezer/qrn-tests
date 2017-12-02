const ffi = require('ffi');
const config = require('../config');

const returnCodeStrings = [
  'QRNG_SUCCESS',
  'QRNG_ERR_FAILED_TO_BASE_INIT',
  'QRNG_ERR_FAILED_TO_INIT_SOCK',
  'QRNG_ERR_FAILED_TO_INIT_SSL',
  'QRNG_ERR_FAILED_TO_CONNECT',
  'QRNG_ERR_SERVER_FAILED_TO_INIT_SSL',
  'QRNG_ERR_FAILED_SSL_HANDSHAKE',
  'QRNG_ERR_DURING_USER_AUTH',
  'QRNG_ERR_USER_CONNECTION_QUOTA_EXCEEDED',
  'QRNG_ERR_BAD_CREDENTIALS',
  'QRNG_ERR_NOT_CONNECTED',
  'QRNG_ERR_BAD_BYTES_COUNT',
  'QRNG_ERR_BAD_BUFFER_ADDRESS',
  'QRNG_ERR_PASSWORD_CHARLIST_TOO_LONG',
  'QRNG_ERR_READING_RANDOM_DATA_FAILED_ZERO',
  'QRNG_ERR_READING_RANDOM_DATA_FAILED_INCOMPLETE',
  'QRNG_ERR_READING_RANDOM_DATA_OVERFLOW',
  'QRNG_ERR_FAILED_TO_READ_WELCOMEMSG',
  'QRNG_ERR_FAILED_TO_READ_AUTH_REPLY',
  'QRNG_ERR_FAILED_TO_READ_USER_REPLY',
  'QRNG_ERR_FAILED_TO_READ_PASS_REPLY',
  'QRNG_ERR_FAILED_TO_SEND_COMMAND',
];

const QrngService = function constructQrngService() {
  this.libQRNG = ffi.Library('libQRNG', {
    qrng_connect_and_get_byte_array: ['int', ['string', 'string', 'pointer', 'int', 'pointer']],
  });
};

QrngService.prototype.getArray = async function getArray(bufferSize) {
  const qrnBuffer = Buffer.alloc(bufferSize);
  const receivedBytesBuffer = Buffer.alloc(4);
  const returnCode = await new Promise((resolve, reject) => {
    this.libQRNG.qrng_connect_and_get_byte_array
      .async(
        config.QRNG_USER,
        config.QRNG_PASSWORD,
        qrnBuffer,
        bufferSize,
        receivedBytesBuffer,
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        },
      );
  });

  if (returnCode !== 0) {
    throw new Error(`QRNG service error: ${returnCodeStrings[returnCode]}`);
  }

  const arr = new Array(bufferSize);
  const receivedBytes = receivedBytesBuffer.readInt32LE(0);
  for (let i = 0; i < receivedBytes; i += 1) {
    arr[i] = qrnBuffer.readUInt8(i);
  }

  return arr;
};

module.exports = QrngService;

