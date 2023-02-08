// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
//import dotenv from "dotenv";
//dotenv.config();
"use strict"
import "dotenv/config"

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
//import socketio from '@feathersjs/socketio'
import { FeathersError, NotFound } from '@feathersjs/errors'
import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { ConnectionOptions } from 'nats'

const debug = require('debug')

feathers.setDebug(debug)

// const { Server } = require('feathers-mq');
// @ts-expect-error
import { Server }  from 'feathers-nats-distributed';
import {nats as sync} from "feathers-sync"

const app: Application = koa(feathers())
// set the name of app - required
//// @ts-expect-error
// app.set("name", "ServerName");

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
// app.configure(
//   socketio({
//     cors: {
//       origin: app.get('origins')
//     }
//   })
// )
app.configure(postgresql)
app.configure(authentication)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})


const url:string = "nats.local"
const port: number = 4222;
const jsonMode:boolean = true;
const NATSurl:string =`nats://${url}:${port}`
const natsConfig: ConnectionOptions = {
  servers: "nats.local:4222",
  debug: false, // Do not set to true in Production
  verbose: false, // Do not set to true in Production
  name: "ServerName",
  timeout: 60000, // 20000 is default
}

// setup mq transport for server
// app.configure(Server({
//   url: url, // hostname for NATS - optional (defaults to `localhost`)
//   port: port, // port(s) for NATS - optional (defaults to 4222)
// }));
app.configure(Server({
  appName:"ServerName",
  natsConfig: natsConfig
}));

const errorHandler2 = () => async (ctx: any, next: () => Promise<any>) => {
  try {
    await next()
    ctx.body = {}
    // if (ctx.body === undefined) {
    //   throw new NotFound(`Path ${ctx.path} not found`)
    // }
  } catch (error: any) {
    ctx.response.status = error instanceof FeathersError ? error.code : 500
    ctx.body =
      typeof error.toJSON === 'function'
        ? error.toJSON()
        : {
            message: error.message
          }
  }
}
app.use(errorHandler2())

app.configure(
  sync({
    uri: `nats://${url}:${port}`,
    key: 'feathers-sync.nats',
    natsConnectionOptions: {
      servers: [`${url}:${port}`]
    }
  })
);

export { app }
// nats request ServerName.users.create '{"data": {"email":"nathan.brizzee4@cdcr.ca.gov", "password": "supersecret"}}'
// nats sub "*.>"

