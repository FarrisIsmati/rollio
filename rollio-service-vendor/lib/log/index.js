// DEPENDENCIES
const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const moment = require('moment');
const config = require('../../config');

const { format } = winston;
const { label } = format;

const getLabel = callingModule => `[${callingModule}]`;

module.exports = (callingModule) => {
  const now = moment();

  const isAWS = config.NODE_ENV !== 'DEVELOPMENT_LOCAL' || config.NODE_ENV !== 'TEST_LOCAL' || config.NODE_ENV !== 'TEST_DOCKER';

  // eslint-disable-next-line new-cap
  const logger = new winston.createLogger({
    levels: winston.config.syslog.levels,
    format: format.combine(
      label({ label: getLabel(callingModule) }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.json(),
    ),
    // If we log to AWS use don't transport to a local file
    transports: isAWS ? [
      new (winston.transports.Console)({
        timestamp: true,
        colorize: true,
      }),
    ] : [
      new winston.transports.File({ name: 'console.error', filename: 'error.log', level: 'error' }),
      new winston.transports.File({ name: 'console.info', filename: 'combined.log' }),
    ],
  });

  const cloudwatchConfig = {
    logGroupName: 'rollio-service-vendor-dev',
    logStreamName: `rollio-service-vendor -  ${now.format('YYYY-MM-DD')}`,
    awsAccessKeyId: config.CLOUDWATCH_ACCESS_KEY_ID,
    awsSecretKey: config.CLOUDWATCH_SECRET_ACCESS_KEY,
    awsRegion: config.CLOUDWATCH_REGION,
    messageFormatter: ({ level, message, additionalInfo }) => `[${level}] : ${message} \nAdditional Info: ${JSON.stringify(additionalInfo)}}`,
  };

  if (isAWS) {
    logger.add(new WinstonCloudWatch(cloudwatchConfig));
  } else if (config.NODE_ENV === 'DEVELOPMENT_DOCKER') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }

  return logger;
};
