import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Optional(Type.Object({
    NatsService:Type.Object({}),
  })),
  Type.Optional(Type.Object({
    NatsInstance:Type.Object({}),
  })),
  Type.Object({
    host: Type.String(),
    port: Type.Number(),
    public: Type.String()
  })
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)
