import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Datum Gateway...')

  return sdk.Daemons.of(effects, started)
    .addDaemon('primary', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'datum' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: '/data',
          readonly: false,
        }),
        'datum-sub',
      ),
      exec: {
        command: [
          'datum_gateway',
          '-c',
          '/media/startos/volumes/main/config.json',
        ],
      },
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
    .addHealthCheck('stratumInterface', {
      ready: {
        display: 'Stratum Interface',
        fn: () => sdk.healthCheck.checkWebUrl(effects, 'http://datum.startos:23334', {
          timeout: 1000,
          successMessage: `Stratum server is available`,
          errorMessage: `Stratum server is unavailable`,
        }),
      },
      requires: ['primary'],
    })
})
