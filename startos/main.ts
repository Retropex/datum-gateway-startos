import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Datum Gateway...')

  const stratumHealthCheck = sdk.HealthCheck.of(effects, {
    id: 'stratum-interface',
    name: 'Stratum Interface',
    fn: () =>
      sdk.healthCheck.checkWebUrl(
        effects,
        'http://datum.startos:23335',
        {
          timeout: 1000,
          successMessage: `Stratum server is available. Ensure you're forwarding with simpleproxy and then connect your miner(s).`,
          errorMessage: `Stratum server is unavailable`,
        },
      ),
  })

  const healthReceipts: T.HealthReceipt[] = [stratumHealthCheck]

  return sdk.Daemons.of(effects, started, healthReceipts).addDaemon('primary', {
    subcontainer: { imageId: 'main' },
    command: ['datum_gateway', '-c', '/media/startos/volumes/main/config.json'],
    mounts: sdk.Mounts.of().addVolume('main', null, '/data', false),
    ready: {
      display: 'Web Interface',
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: 'The Datum Gateway dashboard is ready',
          errorMessage: 'The Datum Gateway dashboard is not ready',
        }),
    },
    requires: [],
  })
})
