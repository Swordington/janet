// Configuration File

const env = process.env.MODE // 'dev', 'prod', 'staging'
const permLevels = require('./permLevels.cfg')

const dev = {
  name: 'Janet Dev',
  description: 'Locally hosted dev',
  devs: ['248540313059196928'],
  token: process.env.DEV_DTOKEN,
  logger: {
    config: {
      displayTimestamp: true,
      displayFilename: true
    },
    types: {
      log: {
        color: 'blue',
        label: 'log'
      },
      load: {
        color: 'yellow',
        label: 'load'
      },
      unload: {
        color: 'yellow',
        label: 'unload'
      },
      ready: {
        color: 'green',
        label: 'ready'
      },
      cmd: {
        color: 'cyan',
        label: 'cmd'
      },
      error: {
        color: 'redBright',
        label: 'error',
        badge: '!!'
      },
      api: {
        color: 'magentaBright',
        label: 'api',
        logLevel: 'debug'
      },
      cache: {
        color: 'magenta',
        label: 'cache',
        logLevel: 'debug'
      },
      task: {
        color: 'cyanBright',
        label: 'task',
        logLevel: 'debug'
      }
    }
  },
  perms: permLevels.dev
}

const staging = {
  name: 'Janet Alpha',
  description: 'Live Alpha Janet',
  devs: ['248540313059196928'],
  token: process.env.DTOKEN,
  logger: {
    config: {
      displayTimestamp: true,
      displayFilename: true
    },
    types: {
      log: {
        color: 'blue',
        label: 'log'
      },
      load: {
        color: 'yellow',
        label: 'load'
      },
      unload: {
        color: 'yellow',
        label: 'unload'
      },
      ready: {
        color: 'green',
        label: 'ready'
      },
      cmd: {
        color: 'cyan',
        label: 'cmd'
      },
      error: {
        color: 'redBright',
        label: 'error',
        badge: '!!'
      },
      api: {
        color: 'magentaBright',
        label: 'api',
        logLevel: 'debug'
      },
      cache: {
        color: 'magenta',
        label: 'cache',
        logLevel: 'debug'
      },
      task: {
        color: 'cyanBright',
        label: 'task',
        logLevel: 'debug'
      }
    }
  },
  perms: permLevels.staging
}

const prod = {
  name: 'Janet',
  description: 'Here\'s a cactus',
  devs: ['248540313059196928'],
  token: process.env.DTOKEN,
  logger: {
    displayTimestamp: true,
    types: {
      log: {
        color: 'blue',
        label: 'log'
      },
      load: {
        color: 'yellow',
        label: 'load'
      },
      unload: {
        color: 'yellow',
        label: 'unload'
      },
      ready: {
        color: 'green',
        label: 'ready'
      },
      cmd: {
        color: 'cyan',
        label: 'cmd'
      },
      error: {
        color: 'redBright',
        label: 'error',
        badge: '!!'
      },
      api: {
        color: 'magentaBright',
        label: 'api',
        logLevel: 'debug'
      },
      cache: {
        color: 'magenta',
        label: 'cache',
        logLevel: 'debug'
      },
      task: {
        color: 'cyanBright',
        label: 'task',
        logLevel: 'debug'
      }
    }
  },
  perms: permLevels.prod
}

const config = {
  dev,
  staging,
  prod
}

module.exports = config[env.toLowerCase()]
