// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../../declarations'
import { dataValidator, queryValidator } from '../../../validators'

// Main data model schema
export const customSvcSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.Optional(Type.String())
  },
  { $id: 'CustomSvc', additionalProperties: false }
)
export type CustomSvc = Static<typeof customSvcSchema>
export const customSvcValidator = getValidator(customSvcSchema, dataValidator)
export const customSvcResolver = resolve<CustomSvc, HookContext>({})

export const customSvcExternalResolver = resolve<CustomSvc, HookContext>({})

// Schema for creating new entries
export const customSvcDataSchema = Type.Pick(customSvcSchema, ['email', 'password'], {
  $id: 'CustomSvcData'
})
export type CustomSvcData = Static<typeof customSvcDataSchema>
export const customSvcDataValidator = getValidator(customSvcDataSchema, dataValidator)
export const customSvcDataResolver = resolve<CustomSvc, HookContext>({})

// Schema for updating existing entries
export const customSvcPatchSchema = Type.Partial(customSvcDataSchema, {
  $id: 'CustomSvcPatch'
})
export type CustomSvcPatch = Static<typeof customSvcPatchSchema>
export const customSvcPatchValidator = getValidator(customSvcPatchSchema, dataValidator)
export const customSvcPatchResolver = resolve<CustomSvc, HookContext>({})

// Schema for allowed query properties
export const customSvcQueryProperties = Type.Pick(customSvcSchema, ['id', 'email'])
export const customSvcQuerySchema = Type.Intersect(
  [
    querySyntax(customSvcQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type CustomSvcQuery = Static<typeof customSvcQuerySchema>
export const customSvcQueryValidator = getValidator(customSvcQuerySchema, queryValidator)
export const customSvcQueryResolver = resolve<CustomSvcQuery, HookContext>({})
