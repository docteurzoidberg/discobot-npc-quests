//index return 403 for crowdsec actions when scanning the service
const noIndexHandler = (req, res) => {
  return res.status(403).send('Forbidden: no index');
};

const notFoundHandler = (req, res) => {
  res.status(404).send('Not found');
};

const errorHandler = (err, req, res, next) => {
  req.logger.error(err);
  req.logger.debug(req.stack);
  res.status(500).send('Something broke!');
};

module.exports = {
  noIndexHandler,
  notFoundHandler,
  errorHandler,
};
