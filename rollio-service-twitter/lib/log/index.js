const winston = require('winston');
const config = require('../../config');

const { format } = winston;
const { label } = format;

const getLabel = callingModule => `[${callingModule}]`;

module.exports = (callingModule) => {
  const isAWS = config.NODE_ENV === 'DEVELOPMENT_DOCKER' || config.NODE_ENV === 'PRODUCTION' || config.NODE_ENV === 'TEST_DOCKER';

  const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: format.combine(
      label({ label: getLabel(callingModule) }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
    ),
    transports: isAWS ? [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ] : [
      new winston.transports.File({ name: 'console.error', filename: 'error.log', level: 'error' }),
      new winston.transports.File({ name: 'console.info', filename: 'combined.log' }),
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  return logger;
};
