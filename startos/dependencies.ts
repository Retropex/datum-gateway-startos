import { sdk } from './sdk'
import { other } from 'bitcoin-knots/startos/actions/config/other'

export const setDependencies = sdk.setupDependencies(async ({ effects }) => {
  await sdk.action.createTask(effects, 'bitcoind', other, 'critical', {
    input: {
      kind: 'partial',
      value: {
        blocknotify: 'curl -s -m5 http://datum.startos:7152/NOTIFY',
      },
    },
    when: { condition: 'input-not-matches', once: false },
    reason: 'Datum requires a particular blocknotify url',
  })

  return {
    bitcoind: {
      kind: 'running',
      versionRange: '>#knots:28.1:3-alpha.2',
      healthChecks: ['primary'],
    },
  }
})
