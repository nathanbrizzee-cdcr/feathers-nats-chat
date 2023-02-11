// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../../src/app'

describe('/first/custom-svc service', () => {
  it('registered the service', () => {
    const service = app.service('/first/custom-svc')

    assert.ok(service, 'Registered the service')
  })
})
