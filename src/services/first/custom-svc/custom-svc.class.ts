// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../../declarations'
import type { CustomSvc, CustomSvcData, CustomSvcPatch, CustomSvcQuery } from './custom-svc.schema'

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
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<CustomSvc> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
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

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: CustomSvcData, _params?: ServiceParams): Promise<CustomSvc> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: CustomSvcPatch, _params?: ServiceParams): Promise<CustomSvc> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<CustomSvc> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
