import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, splat } = winston.format;

const myFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level}]: ${message}`;
    
    if (stack) {
        logMessage += `\n${stack}`;
    }

    // Check if there are any additional metadata keys and if so, log them nicely.
    // Winston includes Symbol keys for colorized levels, so we filter those out via Object.keys.
    if (Object.keys(meta).length) {
        logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: combine(
        errors({ stack: true }), // capture stack traces
        splat(), // string interpolation
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        colorize(),
        myFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});
