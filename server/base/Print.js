const chalk = require("chalk");

const error = chalk.hex("ff6d67");
const warning = chalk.hex("#DEA82A");
const info = chalk.hex("#00c5c7");
const success = chalk.hex("#32CD32");
const { bold } = chalk;

class Print {
    constructor() {
        this.print = console.log;
        this.log = this.log.bind(this);
        this.info = this.info.bind(this);
        this.error = this.error.bind(this);
        this.warning = this.warning.bind(this);
    }

    static parseArguments(obj = []) {
        return Object.keys(obj).reduce((acc, key) => {
            acc.push(obj[key]);
            return acc;
        }, []);
    }

    success(...args) {
        this.print(success(`${bold("[SUCCESS]")} ${Print.parseArguments(args)}`));
    }

    log(...args) {
        this.print((`${bold("[LOG]")} ${Print.parseArguments(args)}`));
    }

    info(...args) {
        this.print(info(`${bold("[INFO]")} ${Print.parseArguments(args)}`));
    }

    error(...args) {
        this.print(error(`${bold("[ERROR]")} ${Print.parseArguments(args)}`));
    }

    warning(...args) {
        this.print(warning(`${bold("[WARNING]")} ${Print.parseArguments(args)}`));
    }
}

module.exports = new Print();
