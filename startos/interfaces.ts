import { sdk } from './sdk'
import { stratumPort, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
  const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
    protocol: 'http',
  })
  const ui = sdk.createInterface(effects, {
    name: 'Web UI',
    id: 'ui',
    description: 'The web interface of Datum Gateway',
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })

  const stratumMulti = sdk.MultiHost.of(effects, 'stratum-multi')
  const stratumMultiOrigin = await stratumMulti.bindPort(stratumPort, {
    protocol: 'http',
    preferredExternalPort: stratumPort,
  })
  const api = sdk.createInterface(effects, {
    name: 'Mining Interface',
    id: 'stratum',
    description: 'Point your ASICs here!',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    search: {},
  })

  const uiReceipt = await uiMultiOrigin.export([ui])
  const stratumReceipt = await stratumMultiOrigin.export([ui])

  return [uiReceipt, stratumReceipt]
})
