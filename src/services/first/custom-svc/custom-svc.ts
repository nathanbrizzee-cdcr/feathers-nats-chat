// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  customSvcDataValidator,
  customSvcPatchValidator,
  customSvcQueryValidator,
  customSvcResolver,
  customSvcExternalResolver,
  customSvcDataResolver,
  customSvcPatchResolver,
  customSvcQueryResolver
} from './custom-svc.schema'

import type { Application } from '../../../declarations'
import { CustomSvcService, getOptions } from './custom-svc.class'
import { customSvcPath, customSvcMethods } from './custom-svc.shared'

export * from './custom-svc.class'
export * from './custom-svc.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const customSvc = (app: Application) => {
  // Register our service on the Feathers application
  app.use(customSvcPath, new CustomSvcService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: customSvcMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(customSvcPath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(customSvcExternalResolver),
        schemaHooks.resolveResult(customSvcResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(customSvcQueryValidator),
        schemaHooks.resolveQuery(customSvcQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(customSvcDataValidator),
        schemaHooks.resolveData(customSvcDataResolver)
      ],
      patch: [
        schemaHooks.validateData(customSvcPatchValidator),
        schemaHooks.resolveData(customSvcPatchResolver)
      ],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../../declarations' {
  interface ServiceTypes {
    [customSvcPath]: CustomSvcService
  }
}
