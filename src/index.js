process.env.DEBUG = 'qrn-service:*';

const QrngService = require('./services/qrngService');
const restify = require('restify');
const config = require('./config');
const log = require('debug')('qrn-service:server');

async function getRandomNumbers(req, res, next) {
  let randomNumbers;
  const qrngService = new QrngService();

  try {
    randomNumbers = await qrngService.getArray(parseInt(req.params.count, 10));
  } catch (e) {
    res.send(e);
  } finally {
    next();
  }

  res.send(randomNumbers);
}

const server = restify.createServer();
server.get('/randomNumbers/:count', getRandomNumbers);

server.listen(config.SERVER_PORT || 80, () => {
  log('%s listening at %s', server.name, server.url);
});

