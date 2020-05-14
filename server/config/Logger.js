import * as winston from 'winston';
import * as rotate from 'winston-daily-rotate-file';
import * as fs from 'fs';

const dir = process.env.LOG_DIR;

if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const init = async() => {
    return winston.createLogger({
        level: 'info',
        transports: [
            new (winston.transports.Console)({
                colorize: true,
            }),
            new winston.transports.DailyRotateFile({
                filename: "info.log",
                dirname: process.env.LOG_DIR,
                maxsize: 20971520, //20MB
                maxFiles: 25,
                datePattern: '.dd-MM-yyyy'
            })
        ]
    });    
}


export default init;