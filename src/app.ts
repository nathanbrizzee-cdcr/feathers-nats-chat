// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
//import dotenv from "dotenv";
//dotenv.config();
'use strict'
import 'dotenv/config'

import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import {
  koa,
  rest,
  bodyParser,
  errorHandler,
  parseAuthentication,
  cors,
  serveStatic,
  FeathersKoaContext
} from '@feathersjs/koa'
//import socketio from '@feathersjs/socketio'
import { FeathersError, NotFound, GeneralError } from '@feathersjs/errors'
import type { Application } from './declarations'
import { configurationValidator } from './configuration'
import { logError } from './hooks/log-error'
import { postgresql } from './postgresql'
import { authentication } from './authentication'
import { services } from './services/index'
import { channels } from './channels'
import { ConnectionOptions } from 'nats'

const packageFile = require('../package.json')

const debug = require('debug')

feathers.setDebug(debug)

import { Server, Client } from 'feathers-nats-distributed'
import { nats as sync } from 'feathers-sync'

const app: Application = koa(feathers())

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

const url: string = 'nats.local'
const port: number = 4222
const NATSurl: string = `nats://${url}:${port}`
const AppName = String(packageFile.name) || ''
const AppVersion = String(packageFile.version) || ''
const natsConfig: ConnectionOptions = {
  servers: ['nats.local:4222'],
  name: AppName,
  timeout: 20000 // 20000 is default
}

app.configure(
  Server({
    appName: AppName,
    appVersion: AppVersion,
    natsConfig: natsConfig,
    servicePublisher: {
      publishServices: true,
      servicesIgnoreList: ['authentication'],
      publishDelay: 60000
    }
  })
)

app.configure(
  Client({
    appName: AppName,
    appVersion: AppVersion,
    natsConfig: natsConfig
  })
)

// app.use(Client({
//   appName: AppName,
//   natsConfig: natsConfig
// }));

// const errorHandler2 = () => async (ctx: FeathersKoaContext, next: () => Promise<any>) => {
//   try {
//     await next()
//     //ctx.body = {}
//     if (ctx.body === undefined) {
//       throw new NotFound(`Path ${ctx.path} not found`)
//     }
//   } catch (error: any) {
//     ctx.response.status = error instanceof FeathersError ? error.code : 500
//     ctx.body =
//       typeof error.toJSON === 'function'
//         ? error.toJSON()
//         : {
//             message: error.message
//           }
//   }
// }

// const errorHandler3 = function () {
//   return async (ctx: any, next: () => Promise<any>) => {
//     try {
//       await next()
//       ctx.body = {}
//       // if (ctx.body === undefined) {
//       //   throw new NotFound(`Path ${ctx.path} not found`)
//       // }
//     } catch (error: any) {
//       ctx.response.status = error instanceof FeathersError ? error.code : 500
//       ctx.body =
//         typeof error.toJSON === 'function'
//           ? error.toJSON()
//           : {
//               message: error.message
//             }
//     }
//   }
// }
// app.use(errorHandler2())
//app.use(errorHandler3())

app.configure(
  sync({
    uri: NATSurl,
    key: 'feathers-sync.nats',
    natsConnectionOptions: natsConfig
  })
)

export { app }
// nats request ServerName.users.create '{"data": {"email":"nathan.brizzee4@cdcr.ca.gov", "password": "supersecret"}}'
// nats request ServerName.create.users '{"data": {"email":"nathan.brizzee4@cdcr.ca.gov", "password": "supersecret"}}'
// nats request ServerName.get.users '{}'
// nats request ServerName.find.users '{}'
// nats request ServerName.get.users '{"id": "1"}'
// nats request ServerName.find.users '{"params": {"query": {"$limit":1, "$skip": 1}}}'
// nats sub "*.>"
