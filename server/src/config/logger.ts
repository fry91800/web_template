import winston, { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
  transports: [
    // Console transport with colors
    new transports.Console({
      format: format.combine(
        format.colorize(), // Adds colors
        format.timestamp(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
          if (message && typeof message === 'object' && 'stack' in message && 'message' in message) {
            // If the message is an Error object, log the message and stack trace
            return `${timestamp} [${level}]: ${message.message} \nStack: ${message.stack}`;
          }
          // If it's not an Error, just log the message
          return `${timestamp} [${level}]: ${message}`;
        })
      )
    }),
    // File transport without colors
    new transports.File({
      filename: 'logs/app.log',
      format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      )
    })
  ]
});
// Simple way to bypass a kind of bug that prevents from logging error properly
const originalError = logger.error;
// Override the `error` method
logger.error = ((err: unknown) => {
  if (err && typeof err === 'object' && 'message' in err && 'stack' in err) {
    // @ts-ignore: We know `err` has a `message` property
    originalError.call(logger, `${err.message} ${err.stack}`);  // Log the message from the object
  }
  else if (err && typeof err === 'object' && 'message' in err) {
    // @ts-ignore: We know `err` has a `message` property
    originalError.call(logger, err.message);  // Log the message from the object
  }
  else if (err && typeof err === 'string'){
    // @ts-ignore: We know `err` has a `message` property
    originalError.call(logger, err);  // Log the message from the object
  }
  else{
    originalError.call(logger, { message: "An unknown error occurred" });
  }
}) as winston.LeveledLogMethod;
export default logger;
