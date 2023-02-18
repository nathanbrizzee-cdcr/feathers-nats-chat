// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../../declarations'
import type { CustomSvc, CustomSvcData, CustomSvcPatch, CustomSvcQuery } from './custom-svc.schema'
import { NatsService } from 'feathers-nats-distributed'
export type { CustomSvc, CustomSvcData, CustomSvcPatch, CustomSvcQuery }

export interface CustomSvcServiceOptions {
  app: Application
}

export interface CustomSvcParams extends Params<CustomSvcQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class CustomSvcService<ServiceParams extends Params = CustomSvcParams>
  implements ServiceInterface<CustomSvc, CustomSvcData, ServiceParams, CustomSvcPatch>
{
  constructor(public options: CustomSvcServiceOptions) {}

  async find(_params?: ServiceParams): Promise<CustomSvc[]> {
    const natsService = this.options.app.get('NatsService') as NatsService
    console.log(_params)
    const reply: any = await natsService.find('@cdcr/testsrv2', 'api/users', _params)
    return reply
  }

  async get(id: Id, _params?: ServiceParams): Promise<CustomSvc> {
    const natsService = this.options.app.get('NatsService') as NatsService
    const reply: any = await natsService.get('@cdcr/testsrv2', 'api/users', id, _params)
    return reply
  }

  async create(data: CustomSvcData, params?: ServiceParams): Promise<CustomSvc>
  async create(data: CustomSvcData[], params?: ServiceParams): Promise<CustomSvc[]>
  async create(
    data: CustomSvcData | CustomSvcData[],
    params?: ServiceParams
  ): Promise<CustomSvc | CustomSvc[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }
    const natsService = this.options.app.get('NatsService') as NatsService
    const reply: any = await natsService.create('@cdcr/testsrv2', 'api/users', data, params)
    return reply
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: CustomSvcData, _params?: ServiceParams): Promise<CustomSvc> {
    const natsService = this.options.app.get('NatsService') as NatsService
    const reply: any = await natsService.update('@cdcr/testsrv2', 'api/users', id, data, _params)
    return reply
  }

  async patch(id: NullableId, data: CustomSvcPatch, _params?: ServiceParams): Promise<CustomSvc> {
    const natsService = this.options.app.get('NatsService') as NatsService
    const reply: any = await natsService.patch('@cdcr/testsrv2', 'api/users', id, data, _params)
    return reply
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<CustomSvc> {
    const natsService = this.options.app.get('NatsService') as NatsService
    const reply: any = await natsService.remove('@cdcr/testsrv2', 'api/users', id, _params)
    return reply
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
