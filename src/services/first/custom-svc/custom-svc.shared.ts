// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../../client'
import type {
  CustomSvc,
  CustomSvcData,
  CustomSvcPatch,
  CustomSvcQuery,
  CustomSvcService
} from './custom-svc.class'

export type { CustomSvc, CustomSvcData, CustomSvcPatch, CustomSvcQuery }

export type CustomSvcClientService = Pick<
  CustomSvcService<Params<CustomSvcQuery>>,
  (typeof customSvcMethods)[number]
>

export const customSvcPath = '/first/custom-svc'

export const customSvcMethods = ['find', 'get', 'create', 'update', 'patch', 'remove', 'schema'] as const

export const customSvcClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(customSvcPath, connection.service(customSvcPath), {
    methods: customSvcMethods
  })
}

// Add this service to the client service type index
declare module '../../../client' {
  interface ServiceTypes {
    [customSvcPath]: CustomSvcClientService
  }
}
