import morgan from 'morgan';
import { logger } from '../utils/logger.js';

const stream = {
    // Morgan uses stream.write to log strings. 
    // We trim the trailing newline Morgan adds because Winston adds its own.
    write: (message) => logger.info(message.trim())
};

// Skip logging during tests or customize format here.
export const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    { stream }
);
