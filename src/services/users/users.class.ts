// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { User, UserData, UserPatch, UserQuery } from './users.schema'
import { userSchema, userDataSchema, userPatchSchema, userQuerySchema } from './users.schema'
export type { User, UserData, UserPatch, UserQuery }

export interface UserParams extends KnexAdapterParams<UserQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService<ServiceParams extends Params = UserParams> extends KnexService<
  User,
  UserData,
  ServiceParams,
  UserPatch
> {
  // @ts-expect-error
  async schema(_data?: any, _params?: Params):Promise<object> {
    return {
      serviceSchema: {
        "$schema": "http://json-schema.org/draft-06/schema#",
        ...userSchema
      },
      createSchema: userDataSchema,
      patchSchema: userPatchSchema,
      querySchema: userQuerySchema
    } 
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('postgresqlClient'),
    name: 'users'
  }
}
