const winston = require('winston');
const config = require('../../config');

const { format } = winston;
const { label } = format;

const getLabel = callingModule => `[${callingModule}]`;

module.exports = (callingModule) => {
  const logger = winston.createLogger({
    levels: winston.config.syslog.levels,
    format: format.combine(
      label({ label: getLabel(callingModule) }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
    ),
    transports: [
      new winston.transports.File({ name: 'console.error', filename: 'error.log', level: 'error' }),
      new winston.transports.File({ name: 'console.info', filename: 'combined.log' }),
    ],
  });

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (config.NODE_ENV === 'DEVELOPMENT_LOCAL' || config.NODE_ENV === 'DEVELOPMENT_DOCKER') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return logger;
};
