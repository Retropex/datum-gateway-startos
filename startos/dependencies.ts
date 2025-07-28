import { sdk } from './sdk'

// @TODO set config for knots
// configInput.rpc.enable = true
// configInput.advanced.blocknotify =
//   'curl -s -m5 http://datum.startos:7152/NOTIFY'


export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '=#knots:28.1:3-alpha.2',
    healthChecks: ['primary'],
  },
}))
