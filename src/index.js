const ffi = require('ffi');
const ref = require('ref');
const libbQRNGcodes =require('../libQRNGcodes');

const BUFFER_SIZE = 1024*1024;

let buffer = new Buffer(BUFFER_SIZE);
const USERNAME = 'mvezer';
const PASSWORD = 'dtJeH9BRXFRC';

const receivedBytesCount = Buffer.alloc(4);



// You can also access just functions in the current process by passing a null
// int qrng_connect_and_get_byte_array(const char *username, const char *password, char *byte_array, int byte_array_size, int *actual_bytes_rcvd);
var libQRNG = ffi.Library('libQRNG', {

  'qrng_connect_and_get_byte_array': [ 'int', [ 'string' , 'string', 'pointer', 'int', 'pointer'] ]
});
console.log('Requesting quantum numbers...');

const retCode = libQRNG.qrng_connect_and_get_byte_array(USERNAME, PASSWORD, buffer, BUFFER_SIZE, receivedBytesCount);
console.log(`Received: ${libbQRNGcodes[retCode]}`);

const qrnArr = new Array(BUFFER_SIZE);
const receivedBytes =  receivedBytesCount.readInt32LE(0);
let i = 0;
while (i < receivedBytes) {
	qrnArr[i] = buffer.readUInt8(i);
	i++;
}
console.log(qrnArr);



