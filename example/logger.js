'use strict';

const {
    format,
    createLogger,
    transports,
    addColors
} = require('winston');

const ignorePrivate = format(info => {
    if (info.private) {
        return false;
    }
    return info;
});

const configLevels = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7
    },
    colors: {
        error: 'red',
        debug: 'white',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow'
    }
};

addColors(configLevels.colors);
var file_name;
const filename  =  function filename(config_filename, callback) {
   let filename  = config_filename;
   file_name = filename;
   console.log(file_name);
   callback(null, filename)
}

const logger = createLogger({
    levels: configLevels.levels,
    format: format.combine(
        ignorePrivate(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => {
            const obj = Object.assign({}, info);
            delete obj.message;
            delete obj.level;
            delete obj.timestamp;
            return `${info.timestamp} ${info.level} - ${info.message}: ${JSON.stringify(obj, null, 2)}`;
        })
    ),
    transports: [
        new transports.File({
            filename: 'errors.log',
            level: 'error',
            maxsize: 10000000,
            handleExceptions: true
        }),
        new transports.File({
            filename: 'full.log',
            maxsize: 10000000,
            handleExceptions: true
        })
    ],
    level: 'silly',
    exitOnError: false
})
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new transports.File({
        filename: file_name+'.log',
        level:'info',
        maxsize: 10000000,
        handleExceptions: true,
        humanReadableUnhandledException: true
      }))

    logger.add(new transports.Console({
        handleExceptions: true,
        format: format.combine(
            format.colorize({
                all: true
            }),
            format.printf(info => {
                const obj = Object.assign({}, info);
                delete obj.message;
                delete obj.level;
                delete obj.timestamp;
                return `${info.timestamp} ${info.level} - ${info.message}: ${JSON.stringify(obj, null, 2)}`;
            })
        ),
    }));
    
}

module.exports = {
    logger:logger,
    filename: filename
} 



// Messages with { private: true } will not be written when logged.
logger.log({
    private: true,
    level: 'error',
    message: 'This is super secret - hide it.'
});