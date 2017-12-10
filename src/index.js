process.env.DEBUG = 'qrn-service:*';

const QrngService = require('./services/qrngService');
const restify = require('restify');
const config = require('./config');
const log = require('debug')('qrn-service:server');

async function getRandomNumbers(req, res, next) {
  let randomNumbers;
  const qrngService = new QrngService();
  const numbersCount = parseInt(req.params.count, 10);
  try {
    randomNumbers = await qrngService.getArray(numbersCount);
  } catch (e) {
    res.send(e);
  } finally {
    next();
  }

  res.header('Access-Control-Allow-Origin', '*');

  res.send({ count: numbersCount, numbers: randomNumbers });
}

const server = restify.createServer();
server.get('/randomNumbers/:count', getRandomNumbers);

server.listen(config.SERVER_PORT || 80, () => {
  log('%s listening at %s', server.name, server.url);
});

