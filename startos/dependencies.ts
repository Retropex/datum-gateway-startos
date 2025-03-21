import { sdk } from './sdk'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => ({
  bitcoind: {
    kind: 'running',
    versionRange: '=#knots28.1.0:3',
    healthChecks: ['primary'],
  },
}))
