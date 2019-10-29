const path = require('path');
const util = require('util');
const winston = require('winston');
const moment = require('moment');
const cleanStacktrace = require('clean-stacktrace');

const pathRoot = path.resolve(__dirname, '../../');
const stackLineRelative = line => {
  const m = /.*\((.*)\).?/.exec(line) || [];
  return m[1] ? line.replace(m[1], path.relative(pathRoot, m[1])) : line;
};

class Log {
  constructor() {
    this._colors = {
      error: 'red',
      warn: 'yellow',
      info: 'cyan',
      debug: 'green',
      message: 'white',
      verbose: 'grey',
    };
    this.logger = new winston.Logger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        message: 3,
        verbose: 4,
        debug: 5,
        silly: 6,
      },
      transports: [
        new winston.transports.Console({
          colorize: true,
          prettyPrint: true,
          timestamp: () => moment().format('MM/D/YY HH:mm:ss'),
          align: true,
          level: process.env.LOG_LEVEL || 'info',
        }),
      ],
      exitOnError: false,
    });

    winston.addColors(this._colors);

    this.error = this.error.bind(this);
    this.warn = this.warn.bind(this);
    this.info = this.info.bind(this);
    this.verbose = this.verbose.bind(this);
    this.debug = this.debug.bind(this);
    this.silly = this.silly.bind(this);

    this._token = process.env.DISCORD_TOKEN;
    this._tokenRegEx = new RegExp(this._token, 'g');
  }
  error(error, ...args) {
    if (error && typeof error === 'object' && error.response)
      error = error.response
        ? error.response.body || error.response.text
        : error.stack;
    if (error && (error instanceof Error || error.stack)) {
      error.stack = cleanStacktrace(error.stack, stackLineRelative);
      if (this._token)
        error.stack = error.stack.replace(this._tokenRegEx, '-- token --');
    }
    if (error && typeof error === 'object' && error.content)
      error = `Discord API - ${
        error.content ? error.content[0] : error.message
      }`;
    if (error && typeof error === 'object' && error.code && error.message)
      error = `Discord API - ${error.message} (${error.code})`;
    this.logger.error(error, ...args);
    return this;
  }
  warn(warn, ...args) {
    this.logger.warn(warn, ...args);
    return this;
  }
  info(...args) {
    this.logger.info(...args);
    return this;
  }
  verbose(...args) {
    this.logger.verbose(...args);
    return this;
  }
  debug(arg, ...args) {
    if (typeof arg === 'object') arg = util.inspect(arg, { depth: 0 });
    this.logger.debug(arg, ...args);
    return this;
  }
  silly(...args) {
    this.logger.silly(...args);
    return this;
  }
}

module.exports = new Log();
