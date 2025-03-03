import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '>=28.0.0:1-knots',
    healthChecks: [],
  },
}))
