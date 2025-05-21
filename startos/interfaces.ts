import { sdk } from './sdk'
import { stratumPort, uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // UI
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
    query: {},
  })
  const uiReceipt = await uiMultiOrigin.export([ui])

  // Stratum
  const stratumMulti = sdk.MultiHost.of(effects, 'stratum-multi')
  const stratumMultiOrigin = await stratumMulti.bindPort(stratumPort, {
    protocol: 'http',
    preferredExternalPort: stratumPort,
  })
  const stratum = sdk.createInterface(effects, {
    name: 'Stratum Server',
    id: 'stratum',
    description: 'Point your ASICs here!',
    type: 'api',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })
  const stratumReceipt = await stratumMultiOrigin.export([stratum])

  return [uiReceipt, stratumReceipt]
})
